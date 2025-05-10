import os
import cv2
import numpy as np
import torch
import torch.nn as nn
import pickle
import mediapipe as mp
import time
from collections import deque
from typing import Dict, List, Optional, Union, Any
from dotenv import load_dotenv
import logging

# Import Gemini analyzer
from analyze_gemini import analyze_asl_gemini

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Try to load environment variables from .env file, but don't fail if it doesn't exist
try:
    load_dotenv(dotenv_path=".env", verbose=False)
except Exception as e:
    logger.warning(f"Could not load .env file: {e}. Using environment variables directly.")

class HandGestureLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes, dropout_prob=0.5):
        super(HandGestureLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        lstm_dropout = dropout_prob if num_layers > 1 else 0
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
                            batch_first=True, dropout=lstm_dropout)
        self.dropout = nn.Dropout(dropout_prob)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        # Initialize hidden and cell states
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        # Detach states to prevent backprop through time if not needed
        out, _ = self.lstm(x, (h0.detach(), c0.detach()))
        # We only need the output of the last time step
        out = self.dropout(out[:, -1, :])
        out = self.fc(out)
        return out

class ASLRecognizer:
    def __init__(self):
        # Constants (configurable via environment variables)
        self.MODEL_SAVE_DIR = os.environ.get('MODEL_SAVE_DIR', '../../../gnec_hackathon/ai/models')
        self.BEST_MODEL_PATH = os.environ.get('BEST_MODEL_PATH', os.path.join(self.MODEL_SAVE_DIR, 'best_lstm_model_sequences_sorted.pth'))
        self.LABEL_MAP_PATH = os.environ.get('LABEL_MAP_PATH', os.path.join(self.MODEL_SAVE_DIR, 'label_map_sequences.pickle'))
        
        self.SEQUENCE_LENGTH = int(os.environ.get('SEQUENCE_LENGTH', 10))
        self.NUM_LANDMARKS = int(os.environ.get('NUM_LANDMARKS', 21))
        self.FEATURES_PER_LANDMARK = int(os.environ.get('FEATURES_PER_LANDMARK', 2))
        self.FEATURES_PER_HAND = self.NUM_LANDMARKS * self.FEATURES_PER_LANDMARK
        self.TARGET_FEATURES_PER_FRAME = self.FEATURES_PER_HAND * 2
        self.PREDICTION_THRESHOLD = float(os.environ.get('PREDICTION_THRESHOLD', 0.7))
        
        self.stable_threshold = int(os.environ.get('STABLE_THRESHOLD', 8))
        self.required_hold_time = float(os.environ.get('REQUIRED_HOLD_TIME', 0.0))
        self.cooldown_time = float(os.environ.get('COOLDOWN_TIME', 1.5))
        
        # Initialize state variables
        self.sequence_buffer = deque(maxlen=self.SEQUENCE_LENGTH)
        self.letter_history = deque(maxlen=self.stable_threshold)
        self.sentence = ""
        self.current_letter = None
        self.candidate_letter = None
        self.letter_hold_start = 0
        self.cooldown_active = False
        self.cooldown_start = 0
        self.last_prediction_time = time.time()
        self.prediction_interval = 0.2  # Limit predictions to 5 per second
        
        # For Gemini analysis
        self.analyzed_sentence = ""
        self.last_analyzed_sentence = ""
        self.no_hands_frames = 0
        self.pause_threshold = 10  # Number of frames without hands to trigger analysis
        
        # Model variables
        self.device = None
        self.model = None
        self.label_map = None
        self.reverse_label_map = None
        self.model_loaded = False
        
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Load model
        self._load_model()
    
    def _load_model(self):
        """Load the ASL recognition model and label mapping"""
        try:
            # Set the device
            if torch.backends.mps.is_available():
                self.device = torch.device("mps")
                logger.info("Using MPS (Apple Silicon GPU)")
            elif torch.cuda.is_available():
                self.device = torch.device("cuda")
                logger.info("Using CUDA GPU")
            else:
                self.device = torch.device("cpu")
                logger.info("Using CPU")
            
            # Load label mapping
            logger.info(f"Loading label mapping from: {self.LABEL_MAP_PATH}")
            if not os.path.exists(self.LABEL_MAP_PATH):
                logger.error(f"Error: Label map file not found at {self.LABEL_MAP_PATH}.")
                return
            
            try:
                with open(self.LABEL_MAP_PATH, 'rb') as f:
                    label_info = pickle.load(f)
                    # Ensure the expected keys exist
                    if 'label_map' not in label_info or 'reverse_label_map' not in label_info:
                        logger.error("Label map file missing required keys.")
                        return
                    self.label_map = label_info['label_map']
                    self.reverse_label_map = label_info['reverse_label_map']
                    num_classes = len(self.label_map)
                    logger.info(f"Loaded {num_classes} classes.")
            except Exception as e:
                logger.error(f"Error loading label map file: {e}")
                return
            
            # Load model
            logger.info(f"Loading model from: {self.BEST_MODEL_PATH}")
            if not os.path.exists(self.BEST_MODEL_PATH):
                logger.error(f"Error: Model file not found at {self.BEST_MODEL_PATH}.")
                return
            
            input_size = self.TARGET_FEATURES_PER_FRAME
            hidden_size = 128
            num_layers = 2
            dropout_prob = 0.5
            
            self.model = HandGestureLSTM(input_size, hidden_size, num_layers, num_classes, dropout_prob)
            try:
                self.model.load_state_dict(torch.load(self.BEST_MODEL_PATH, map_location=self.device))
                self.model.to(self.device)
                self.model.eval()
                logger.info("Model loaded successfully.")
                self.model_loaded = True
            except Exception as e:
                logger.error(f"Error loading model state dictionary: {e}")
                if "size mismatch" in str(e):
                    logger.error("This often means the model architecture does not match the saved model file.")
                return
        
        except Exception as e:
            logger.error(f"Error initializing ASL recognizer: {e}")
    
    def process_hand_landmarks(self, landmarks, image_shape):
        """
        Extracts and normalizes hand landmarks relative to the hand's bounding box.
        Returns a dictionary containing normalized features and bounding box coords, or None.
        """
        if not landmarks:
            return None
        
        image_height, image_width = image_shape[:2]
        
        # Get absolute pixel coordinates
        x_coords = [lm.x * image_width for lm in landmarks.landmark]
        y_coords = [lm.y * image_height for lm in landmarks.landmark]
        
        # Calculate bounding box
        x_min, x_max = min(x_coords), max(x_coords)
        y_min, y_max = min(y_coords), max(y_coords)
        box_width = x_max - x_min
        box_height = y_max - y_min
        
        # Avoid division by zero if bounding box is degenerate
        if box_width == 0 or box_height == 0:
            return None
        
        # Normalize landmarks relative to the bounding box top-left corner
        normalized_features = []
        for lm in landmarks.landmark:
            # Calculate position relative to top-left corner of the box
            relative_x = lm.x * image_width - x_min
            relative_y = lm.y * image_height - y_min
            # Normalize by box dimensions
            norm_x = relative_x / box_width
            norm_y = relative_y / box_height
            normalized_features.extend([norm_x, norm_y])
        
        # Ensure we have the correct number of features
        if len(normalized_features) != self.FEATURES_PER_HAND:
            logger.warning(f"Expected {self.FEATURES_PER_HAND} features, got {len(normalized_features)}. Padding/truncating.")
            normalized_features = normalized_features[:self.FEATURES_PER_HAND]  # Truncate
            while len(normalized_features) < self.FEATURES_PER_HAND:  # Pad
                normalized_features.append(0.0)
        
        return {
            'features': normalized_features,
            'x_min': x_min, 'y_min': y_min,
            'x_max': x_max, 'y_max': y_max
        }
    
    def analyze_sentence(self, text_to_analyze):
        """
        Analyze a sentence using Gemini API
        """
        if not text_to_analyze or text_to_analyze.isspace():
            return ""
            
        try:
            # Use Gemini to analyze the text
            logger.info(f"Analyzing sentence with Gemini: '{text_to_analyze}'")
            analysis = analyze_asl_gemini(text_to_analyze)
            logger.info(f"Gemini analysis result: '{analysis}'")
            return analysis
        except Exception as e:
            logger.error(f"Error analyzing sentence: {e}")
            return f"Error analyzing: {text_to_analyze}"
    
    def process_frame(self, frame):
        """
        Process a video frame to recognize ASL gestures.
        
        Returns a dict with:
            - prediction: The current recognized letter/gesture
            - confidence: Confidence score (0-1)
            - sentence: Current accumulated sentence
            - analyzed_sentence: Gemini-analyzed version (if applicable)
        """
        frame_time = time.time()
        
        # Only run prediction every X seconds to avoid overloading
        if frame_time - self.last_prediction_time < self.prediction_interval:
            # Return the last predictions without processing
            if self.current_letter:
                return {
                    'prediction': self.current_letter,
                    'confidence': 0.0,  # No new confidence, using last letter
                    'sentence': self.sentence,
                    'analyzed_sentence': self.analyzed_sentence
                }
            return {'sentence': self.sentence, 'analyzed_sentence': self.analyzed_sentence}
        
        self.last_prediction_time = frame_time
        
        # Get frame dimensions
        H, W = frame.shape[:2]
        
        # Convert BGR to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        rgb_frame.flags.writeable = False
        results = self.hands.process(rgb_frame)
        rgb_frame.flags.writeable = True
        
        # --- Cooldown Check ---
        if self.cooldown_active and frame_time - self.cooldown_start >= self.cooldown_time:
            self.cooldown_active = False
            self.candidate_letter = None  # Clear candidate when cooldown ends
        
        # --- Check for hands ---
        hands_detected = bool(results.multi_hand_landmarks)
        
        # --- Process hand landmarks if hands are detected ---
        frame_features = np.zeros(self.TARGET_FEATURES_PER_FRAME, dtype=np.float32)
        
        if hands_detected:
            self.no_hands_frames = 0  # Reset no hands counter
            
            processed_hands = []
            
            # Process each detected hand (up to 2)
            for hand_landmarks in results.multi_hand_landmarks[:2]:
                hand_data = self.process_hand_landmarks(hand_landmarks, (H, W))
                if hand_data:
                    processed_hands.append(hand_data)
            
            # Populate feature vector
            if len(processed_hands) >= 1:
                features1 = processed_hands[0]['features']
                len1 = min(len(features1), self.FEATURES_PER_HAND)
                frame_features[:len1] = features1[:len1]
                if len(processed_hands) >= 2:
                    features2 = processed_hands[1]['features']
                    len2 = min(len(features2), self.FEATURES_PER_HAND)
                    frame_features[self.FEATURES_PER_HAND : self.FEATURES_PER_HAND + len2] = features2[:len2]
        else:
            # No hands detected
            self.no_hands_frames += 1
            self.letter_history.clear()
            self.candidate_letter = None
            
            # If hands are absent for a while, add space and possibly analyze
            if self.no_hands_frames == self.pause_threshold and self.sentence and not self.sentence.endswith(" "):
                self.sentence += " "
                logger.info("Added space due to pause")
            
            # If significant pause and we have content, analyze with Gemini
            if self.no_hands_frames >= self.pause_threshold * 2 and self.sentence.strip() and self.sentence != self.last_analyzed_sentence:
                trimmed_sentence = self.sentence.strip()
                self.analyzed_sentence = self.analyze_sentence(trimmed_sentence)
                self.last_analyzed_sentence = self.sentence
        
        # Add features to sequence buffer
        self.sequence_buffer.append(frame_features)
        
        # --- Make prediction if we have enough frames ---
        current_prediction = None
        current_confidence = 0.0
        prediction = None  # For stability check
        
        if hands_detected and len(self.sequence_buffer) == self.SEQUENCE_LENGTH and self.model_loaded:
            try:
                # Use real model for prediction
                input_sequence = np.array(list(self.sequence_buffer), dtype=np.float32)
                input_tensor = torch.FloatTensor(input_sequence).unsqueeze(0)
                if self.device:
                    input_tensor = input_tensor.to(self.device)
                
                with torch.inference_mode():
                    outputs = self.model(input_tensor)
                    probabilities = torch.nn.functional.softmax(outputs, dim=1)
                    confidence, predicted_idx = torch.max(probabilities, 1)
                    pred_idx = predicted_idx.item()
                    conf_val = confidence.item()
                    
                    # Check confidence threshold
                    if conf_val >= self.PREDICTION_THRESHOLD and pred_idx in self.reverse_label_map:
                        current_prediction = self.reverse_label_map[pred_idx]
                        current_confidence = conf_val
                
                # If we have a prediction, determine if it should be added immediately or checked for stability
                if current_prediction:
                    if current_prediction in ['J']:  # Add motion letters immediately
                        if not self.cooldown_active and (not self.sentence or self.sentence[-1] != current_prediction):
                            self.sentence += current_prediction
                            self.current_letter = current_prediction
                            self.cooldown_active = True
                            self.cooldown_start = frame_time
                            logger.info(f"Added motion letter: {current_prediction} | Sentence: {self.sentence}")
                            # Reset stability tracking
                            self.letter_history.clear()
                            self.candidate_letter = None
                    else:
                        # For non-motion letters, use stability check
                        prediction = current_prediction
            
            except Exception as e:
                logger.error(f"Prediction error: {str(e)}")
        
        # --- Letter Stability Check for non-motion letters ---
        if prediction:
            self.letter_history.append(prediction)
            
            if len(self.letter_history) >= self.stable_threshold:
                try:
                    most_common = max(set(self.letter_history), key=list(self.letter_history).count)
                    # Check if consistent enough (85% of frames)
                    if list(self.letter_history).count(most_common) >= int(0.85 * self.stable_threshold):
                        if self.candidate_letter != most_common:
                            # New stable letter detected
                            self.candidate_letter = most_common
                            self.letter_hold_start = frame_time
                        else:
                            # Still the same candidate, check hold time
                            held_time = frame_time - self.letter_hold_start
                            if held_time >= self.required_hold_time and not self.cooldown_active:
                                # Add if different from last letter
                                if not self.sentence or self.sentence[-1] != most_common:
                                    self.sentence += most_common
                                    self.current_letter = most_common
                                    self.cooldown_active = True
                                    self.cooldown_start = frame_time
                                    logger.info(f"Added stable letter: {most_common} | Sentence: {self.sentence}")
                                    # Reset stability tracking
                                    self.letter_history.clear()
                                    self.candidate_letter = None
                except ValueError:
                    pass
        
        # Return the current state
        return {
            'prediction': current_prediction,
            'confidence': current_confidence,
            'sentence': self.sentence,
            'analyzed_sentence': self.analyzed_sentence
        }
    
    def process_video(self, video_path):
        """
        Process a video file for ASL recognition.
        
        Returns a dict with recognized sentence and its analysis.
        """
        if not os.path.exists(video_path):
            logger.error(f"Video file not found: {video_path}")
            return {'error': f"Video file not found: {video_path}"}
        
        logger.info(f"Processing video: {video_path}")
        
        # Reset state
        self.reset()
        
        # Open video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"Could not open video: {video_path}")
            return {'error': f"Could not open video: {video_path}"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        logger.info(f"Video has {total_frames} frames at {fps} FPS")
        
        # Process frames
        processed_frames = 0
        last_log_time = time.time()
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Process the frame
            result = self.process_frame(frame)
            
            # Log progress periodically
            processed_frames += 1
            current_time = time.time()
            if current_time - last_log_time >= 5.0:  # Log every 5 seconds
                progress = (processed_frames / total_frames) * 100
                logger.info(f"Processing: {progress:.1f}% ({processed_frames}/{total_frames} frames)")
                last_log_time = current_time
        
        # Finalize results - analyze the final sentence if needed
        if self.sentence.strip() and self.sentence != self.last_analyzed_sentence:
            self.analyzed_sentence = self.analyze_sentence(self.sentence.strip())
            self.last_analyzed_sentence = self.sentence
        
        # Release resources
        cap.release()
        
        logger.info(f"Video processing complete. Recognized: '{self.sentence.strip()}'")
        logger.info(f"Analysis: '{self.analyzed_sentence}'")
        
        return {
            'sentence': self.sentence.strip(),
            'analysis': self.analyzed_sentence,
            'frames_processed': processed_frames
        }
    
    def reset(self):
        """Reset the recognizer state"""
        self.sequence_buffer.clear()
        self.letter_history.clear()
        self.sentence = ""
        self.analyzed_sentence = ""
        self.last_analyzed_sentence = ""
        self.current_letter = None
        self.candidate_letter = None
        self.letter_hold_start = 0
        self.cooldown_active = False
        self.cooldown_start = 0
        self.no_hands_frames = 0
        
        return {
            'status': 'reset',
            'message': 'Recognizer state has been reset'
        } 