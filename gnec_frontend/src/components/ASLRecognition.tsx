"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/CustomAlert"
import { XCircle } from "lucide-react"

interface ASLRecognitionProps {
  onTranslationUpdate?: (translation: string) => void
}

export default function ASLRecognition({ onTranslationUpdate }: ASLRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const cameraActiveRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [translation, setTranslation] = useState<string>("")
  const [analyzedTranslation, setAnalyzedTranslation] = useState<string>("")
  const [currentPrediction, setCurrentPrediction] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(0)
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      setIsConnecting(true)
      const wsUrl = process.env.NEXT_PUBLIC_ASL_SERVICE_URL || 'ws://localhost:8000'
      const ws = new WebSocket(`${wsUrl}/ws/asl-recognition`)
      
      ws.onopen = () => {
        setIsConnecting(false)
        setWebsocket(ws)
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.error) {
            console.error('WebSocket error:', data.error)
            return
          }
          
          if (data.sentence !== undefined) {
            setTranslation(data.sentence)
            if (onTranslationUpdate) {
              onTranslationUpdate(data.sentence)
            }
          }
          
          if (data.analyzed_sentence !== undefined) {
            setAnalyzedTranslation(data.analyzed_sentence)
          }
          
          if (data.prediction) {
            setCurrentPrediction(data.prediction)
            setConfidence(data.confidence || 0)
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e)
        }
      }
      
      ws.onerror = () => {
        setError('Failed to connect to the ASL recognition service')
        setIsConnecting(false)
      }
      
      ws.onclose = () => {
        setWebsocket(null)
      }
      
      return ws
    } catch (err) {
      setError('Failed to connect to the ASL recognition service')
      setIsConnecting(false)
      return null
    }
  }, [onTranslationUpdate])

  // Start camera and recognition
  const startCamera = async () => {
    try {
      setError(null)
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      // Store the stream in the ref for cleanup
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Set both state and ref to true immediately on obtaining the stream
        setCameraActive(true)
        cameraActiveRef.current = true
        
        // Connect to WebSocket
        const ws = connectWebSocket()
        
        // Start video playback
        videoRef.current.onloadedmetadata = () => {
          // Update canvas size based on video dimensions
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth || 640
            canvasRef.current.height = videoRef.current.videoHeight || 480
          }
          
          // Start playing video
          videoRef.current?.play()
            .then(() => {
              // Only start sending frames once video is playing
              if (ws && ws.readyState === WebSocket.OPEN) {
                startSendingFrames(ws)
              } else {
                // Set a timeout to check for WebSocket readiness
                setTimeout(() => {
                  if (ws && ws.readyState === WebSocket.OPEN) {
                    startSendingFrames(ws)
                  } else {
                    setError("Failed to connect to the ASL recognition service")
                  }
                }, 2000) // 2 second delay
              }
            })
            .catch(err => {
              console.error("Error playing video:", err)
              setError("Could not play video stream. Please check your browser settings.")
            })
        }
      } else {
        throw new Error("Video reference is null")
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Could not access camera. Please make sure camera permissions are granted')
      
      // Reset state on error
      setCameraActive(false)
      cameraActiveRef.current = false
    }
  }

  // Stop camera and recognition
  const stopCamera = () => {
    // Update both state and ref
    setCameraActive(false)
    cameraActiveRef.current = false
    setIsPaused(false)
    
    // Stop animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    // Stop all tracks from the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    // Close WebSocket connection
    if (websocket) {
      websocket.close()
      setWebsocket(null)
    }
  }

  // Pause/resume recognition
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Reset the translator
  const resetTranslation = () => {
    setTranslation("")
    if (onTranslationUpdate) {
      onTranslationUpdate("")
    }
  }

  // Send frames to the backend
  const startSendingFrames = (ws: WebSocket) => {
    if (!videoRef.current || !canvasRef.current || !ws) {
      return
    }
    
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      return
    }
    
    // Store the canvas element reference for use in the loop
    const canvas = canvasRef.current;
    
    let framesProcessed = 0
    let lastFrameTime = performance.now()
    const frameInterval = 1000 / 30; // Target 30fps
    
    const sendFrame = () => {
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      
      // Use the ref value instead of the state to avoid stale state issues
      if (cameraActiveRef.current && !isPaused && ws.readyState === WebSocket.OPEN && videoRef.current) {
        try {
          // Only send frames if enough time has elapsed and video is actually playing
          if (elapsed >= frameInterval && videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or better
            // Draw video frame to canvas
            ctx.drawImage(
              videoRef.current, 
              0, 0, 
              canvas.width, 
              canvas.height
            )
            
            // Convert canvas to base64 JPEG with reduced quality for better performance
            const imageData = canvas.toDataURL('image/jpeg', 0.6)
            
            // Send only the base64 data without the header
            ws.send(JSON.stringify({
              image: imageData.split(',')[1]
            }))
            
            // Update frame stats
            framesProcessed++
            lastFrameTime = now;
            
            // Log occasionally for debugging
            if (framesProcessed % 60 === 0) {
              console.log(`Processed ${framesProcessed} frames`)
            }
          }
        } catch (e) {
          console.error("Error in sendFrame:", e)
        }
      } else if (!cameraActiveRef.current) {
        return; // Exit the loop
      }
      
      // Continue the loop only if camera is still active
      if (cameraActiveRef.current) {
        animationRef.current = requestAnimationFrame(sendFrame)
      }
    }
    
    // Start the loop
    animationRef.current = requestAnimationFrame(sendFrame)
  }

  // Synchronize the cameraActive state with the ref
  useEffect(() => {
    cameraActiveRef.current = cameraActive;
  }, [cameraActive]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Stop animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      
      // Close WebSocket
      if (websocket) {
        websocket.close()
      }
      
      // Stop camera tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isConnecting && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTitle>Connecting to ASL service...</AlertTitle>
          <AlertDescription>Please wait while we establish a connection</AlertDescription>
        </Alert>
      )}
      
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
        {!cameraActive ? (
          <div className="text-center p-8 md:p-16">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <p className="text-gray-500">Camera feed will appear here</p>
            <p className="text-xs text-gray-400 mt-2">Camera access required for sign language translation</p>
          </div>
        ) : (
          <>
            {currentPrediction && (
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-md text-sm z-20">
                {currentPrediction} ({Math.round(confidence * 100)}%)
              </div>
            )}
            {isPaused && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                <div className="text-white text-xl font-bold">PAUSED</div>
              </div>
            )}
          </>
        )}
        
        {/* Video element */}
        <video 
          ref={videoRef} 
          className="h-full w-full object-cover rounded-lg absolute inset-0"
          autoPlay 
          playsInline
          muted
          style={{ 
            zIndex: 10, 
            display: cameraActive ? 'block' : 'none',
            opacity: cameraActive ? 1 : 0,
            transform: 'scaleX(-1)' // Mirror the video for more natural experience
          }}
        />
      </div>
      
      {/* Hidden canvas for processing video frames */}
      <canvas 
        ref={canvasRef} 
        width="640" 
        height="480" 
        style={{ 
          display: 'none', 
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          zIndex: -1 
        }} 
        aria-hidden="true"
      />
      
      <div className="flex justify-center gap-4">
        {!cameraActive ? (
          <Button 
            onClick={startCamera} 
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Start Camera'}
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant={isPaused ? "default" : "outline"}>
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button onClick={stopCamera} variant="destructive">
              Stop Camera
            </Button>
            <Button onClick={resetTranslation} variant="outline">
              Clear Translation
            </Button>
          </>
        )}
      </div>
      
      {/* Current translation display */}
      <div className="bg-gray-50 rounded-lg p-4 h-24 overflow-y-auto">
        <p className="font-medium text-sm text-gray-700 mb-2">ASL Letters:</p>
        <p className="text-gray-900">
          {translation || "No translation yet. Start signing..."}
        </p>
      </div>
      
      {/* Analyzed translation display */}
      {analyzedTranslation && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 h-24 overflow-y-auto">
          <p className="font-medium text-sm text-teal-700 mb-2">Analyzed Translation:</p>
          <p className="text-teal-900 font-medium">
            {analyzedTranslation}
          </p>
        </div>
      )}
    </div>
  )
} 