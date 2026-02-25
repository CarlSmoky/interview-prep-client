import { useEffect, useRef, useState, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

/**
 * SimpleSpeechInput Component
 * 
 * Uses browser's built-in Web Speech API (free, no external service needed)
 * - Works in Chrome, Edge, Safari
 * - No API keys required
 * - Simple speech-to-text transcription
 */

interface SimpleSpeechInputProps {
  question: string
  onTranscriptComplete: (transcript: string) => void
  isDisabled?: boolean
}

export function SimpleSpeechInput({ 
  question, 
  onTranscriptComplete, 
  isDisabled 
}: SimpleSpeechInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      return 'Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.'
    }
    return ''
  })
  const [isSupported] = useState(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    return !!SpeechRecognition
  })
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoReadQuestion, setAutoReadQuestion] = useState(true)
  const recognitionRef = useRef<any>(null)
  const hasReadQuestionRef = useRef(false)
  const shouldSubmitRef = useRef(false)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      return
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      console.log('onresult fired! Event:', event)
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' '
        } else {
          interimTranscript += transcriptPiece
        }
      }

      console.log('Final transcript piece:', finalTranscript)
      console.log('Interim transcript:', interimTranscript)

      if (finalTranscript) {
        setTranscript(prev => {
          const updated = prev + finalTranscript
          finalTranscriptRef.current = updated
          console.log('Updated transcript to:', updated)
          return updated
        })
      }
      
      // Always show interim results so user knows it's working
      setInterimText(interimTranscript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.')
      } else {
        setError(`Error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('Speech recognition ended')
      setIsListening(false)
      
      // If we should submit (user clicked stop), submit now with final transcript
      if (shouldSubmitRef.current) {
        const finalText = (finalTranscriptRef.current + ' ' + interimText).trim()
        console.log('Recognition ended, submitting:', finalText)
        
        if (finalText) {
          onTranscriptComplete(finalText)
          setTranscript('')
          setInterimText('')
          finalTranscriptRef.current = ''
        } else {
          setError('No speech detected. Please speak clearly and pause before stopping.')
        }
        shouldSubmitRef.current = false
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
    }
  }, [])

  const readQuestionAloud = useCallback(() => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(question)
    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }, [question])

  // Read question aloud when it changes
  useEffect(() => {
    if (autoReadQuestion && question && !hasReadQuestionRef.current) {
      readQuestionAloud()
      hasReadQuestionRef.current = true
    }
    
    // Reset when question changes
    return () => {
      hasReadQuestionRef.current = false
    }
  }, [question, autoReadQuestion, readQuestionAloud])

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const startListening = () => {
    if (!recognitionRef.current || isDisabled || !isSupported) return

    setError('')
    shouldSubmitRef.current = false
    finalTranscriptRef.current = ''
    
    try {
      recognitionRef.current.start()
      setIsListening(true)
      console.log('Started listening')
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Failed to start microphone. Please try again.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      console.log('Stop button clicked')
      shouldSubmitRef.current = true
      recognitionRef.current.stop()
      // Submission will happen in the onend event
    }
  }

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <p className="text-xl leading-relaxed text-white">{question}</p>
        </div>
        <div className="p-4 bg-red-900 bg-opacity-30 border border-red-600 rounded">
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Please use Chrome, Edge, or Safari for voice input, or switch to text mode.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Question Display */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <p className="text-xl leading-relaxed text-white flex-1">{question}</p>
          <button
            onClick={isSpeaking ? stopSpeaking : readQuestionAloud}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title={isSpeaking ? "Stop reading" : "Read question aloud"}
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        {isSpeaking && (
          <p className="text-xs text-blue-400 mt-2">🔊 Reading question...</p>
        )}
      </div>

      {/* Auto-read toggle */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <input
          type="checkbox"
          id="autoRead"
          checked={autoReadQuestion}
          onChange={(e) => setAutoReadQuestion(e.target.checked)}
          className="cursor-pointer"
        />
        <label htmlFor="autoRead" className="text-gray-400 cursor-pointer">
          Auto-read questions aloud
        </label>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isDisabled}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center transition-all
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-white hover:bg-gray-200'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isListening ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-black" />
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-medium text-white">
            {isDisabled 
              ? '✓ Submitting your answer...' 
              : isListening 
              ? 'Listening... Click to stop and submit' 
              : 'Click to start recording'
            }
          </p>
        </div>
      </div>

      {/* Live Transcript */}
      {(transcript || interimText) && (
        <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded border border-gray-600">
          <p className="text-xs text-gray-400 mb-2">Your answer (live transcription):</p>
          <p className="text-white">
            {transcript}
            {interimText && <span className="text-gray-400 italic">{interimText}</span>}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900 bg-opacity-30 border border-red-600 rounded">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-400 text-center space-y-1">
        <p>🔊 Question is read aloud automatically (or click the speaker icon)</p>
        <p>🎤 Click mic → Speak → Click again to <strong className="text-white">auto-submit & go to next question</strong></p>
        <p className="text-green-400">
          ✓ Using browser's built-in speech recognition (free, no API key needed)
        </p>
      </div>
    </div>
  )
}
