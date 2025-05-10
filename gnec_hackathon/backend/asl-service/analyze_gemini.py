import os
import google.generativeai as genai
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Try to load environment variables from .env file, but don't fail if it doesn't exist
try:
    load_dotenv(dotenv_path=".env", verbose=True)
    logger.info("Loaded environment variables from .env file")
except Exception as e:
    logger.warning(f"Could not load .env file: {e}. Using environment variables directly.")

# Configure the API key (either from .env or from environment variables set in run.py)
api_key = os.environ.get("GEMINI_API_KEY")

if not api_key or api_key == "":
    logger.warning("No valid Gemini API key found. Gemini analysis will not work.")
    logger.warning("Please set a valid GEMINI_API_KEY in your environment or .env file")
else:
    try:
        genai.configure(api_key=api_key)
        logger.info("Gemini API configured successfully")
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}")

# Create a model instance
model = None
try:
    model = genai.GenerativeModel("gemini-1.5-flash")  # Or "gemini-1.0-pro", or "gemini-1.5-flash", or "gemini-1.5-pro"
    logger.info("Gemini model initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {e}")


def analyze_asl_gemini(text):
    """
    Analyze ASL space-separated letters and convert to meaningful English sentences using the Gemini API.

    Args:
        text: Space-separated ASL letters/characters

    Returns:
        Analyzed text as complete sentences
    """
    if not text or text.isspace():
        return ""
        
    if not model:
        logger.warning("Gemini model not initialized. Cannot analyze text.")
        return f"Gemini analysis unavailable. Original text: {text}"
        
    prompt = (
        "You are an expert at accurately reconstructing English sentences from ASL fingerspelled letters. "
        "Your job is to return only the most likely sentence(s) the signer intended, based on the detected letter sequence. "
        "Do NOT be creative or infer unrelated phrases. "
        "You may only expand common abbreviations and acronyms into full words. "
        "Here are some common examples:\n"
        "- ILU -> I love you\n"
        "- ILY -> I love you\n"
        "- SW -> Software\n"
        "- SWE -> Software Engineer\n"
        "- CS -> Computer Science\n"
        "- AI -> Artificial Intelligence\n"
        "- USF -> University of South Florida\n"
        "- NYC -> New York City\n"
        "- GPT -> Generative Pre-trained Transformer\n"
        "- ASL -> American Sign Language\n"
        "- SM -> So much\n"
        "- FLA -> Florida\n"
        "- JB -> Job\b"
        "- Abbreviations of every state / country / location / app (like FB -> FaceBook, YT -> YouTube, etc.) / technologies (JS -> JavaScript, TF -> TensorFlow, etc.)\n"
        "Names (e.g., GIANG, JOHN) and acronyms should be preserved or expanded if clear."
        "Only output a sentence or short paragraph, without additional explanation or creative guessing.\n"
        "Only out put the constructed sentence, not the original sentence provided."
        "Make sentences grammatically correct from the keywords / spellings provided. Make it reasonable."
        "SPECIAL NOTE: Me is the same as I, so when decoding, pick the option that makes more sense for the sentence."
        f"You are given a space-separated string of letters from a fingerspelling segment in ASL video: {text}. "
        "Reconstruct the most likely English sentence using these letters. Prioritize names, abbreviations, and realistic phrases. "
        "Return ONLY the reconstructed sentence or sentences."
    )

    # Generate content using Gemini
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
        return f"Error analyzing: {text}" 
