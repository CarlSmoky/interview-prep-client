import { useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceInputProps {
  question: string
  onTranscriptComplete: (transcript: string) => void
  isDisabled?: boolean
  vapiPublicKey: string
  assistantId?: string
}

const VoiceInput = ({
  question,
  onTranscriptComplete,
  isDisabled,
  vapiPublicKey,
  assistantId
}: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [isInitializing, setIsInitializing] = useState(false)
  const vapiRef = useRef<Vapi | null>(null)

  useEffect(() => {
    // Initialize Vapi client
    if (vapiPublicKey && !vapiRef.current) {
      try {
        vapiRef.current = new Vapi(vapiPublicKey)
      } catch (err) {
        console.error('Vapi initialization error:', err)
      }
    }

    return () => {
      // Cleanup on unmount
      if (vapiRef.current) {
        vapiRef.current.stop()
      }
    }
  }, [vapiPublicKey])

  const startListening = async () => {
    if (!vapiRef.current || isDisabled) return

    setIsInitializing(true)
    setError('')
    setTranscript('')

    try {
      // Use assistant ID if provided, otherwise use minimal configuration
      // Vapi only handles voice transcription - backend evaluates answers
      const config = assistantId
        ? { assistantId }
        : {
          name: 'Interview Transcriber',
          // Minimal first message - just to acknowledge the mic is active
          firstMessage: 'Ready.',
          model: {
            provider: 'openai',
            model: 'gpt-3.5-turbo',  // Minimal model, only for basic acknowledgments
            messages: [
              {
                role: 'system',
                content: 'You are a simple voice transcriber. Only say "Ready" when starting and "Got it" when the user stops speaking. Do not engage in conversation.'
              }
            ]
          },
          transcriber: {
            provider: 'deepgram' as const,
            model: 'nova-2',  // This does the actual speech-to-text
            language: 'en' as const
          },
          voice: {
            provider: 'playht',
            voiceId: 'jennifer'
          }
        }

      console.log('Starting Vapi with config:', config)
      await vapiRef.current.start(config as Parameters<typeof vapiRef.current.start>[0])

      setIsInitializing(false)

      // Listen to events
      vapiRef.current.on('speech-start', () => {
        console.log('User started speaking')
        setIsListening(true)
      })

      vapiRef.current.on('speech-end', () => {
        console.log('User stopped speaking')
        setIsListening(false)
      })

      vapiRef.current.on('message', (message: { type: string; role: string; transcript: string }) => {
        console.log('Message received:', message)
        if (message.type === 'transcript' && message.role === 'user') {
          setTranscript(prev => prev + ' ' + message.transcript)
        }
      })

      vapiRef.current.on('call-end', () => {
        console.log('Call ended')
        setIsListening(false)
        setIsInitializing(false)
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('Vapi error:', error)
        const errorMsg = error?.error?.msg || error?.message || JSON.stringify(error)
        setError(`Vapi Error: ${errorMsg}. This may be a billing/credits issue or invalid config. Try SimpleSpeechInput instead.`)
        setIsListening(false)
        setIsInitializing(false)
      })

    } catch (err) {
      console.error('Failed to start Vapi:', err)
      setError(err instanceof Error ? err.message : 'Failed to start voice input. Check your API key and try again.')
      setIsListening(false)
      setIsInitializing(false)
    }
  }

  const stopListening = () => {
    if (vapiRef.current) {
      vapiRef.current.stop()
      setIsListening(false)
      setIsInitializing(false)

      // Submit the transcript
      if (transcript.trim()) {
        onTranscriptComplete(transcript)
        setTranscript('')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Question Display */}
      <div className="mb-4">
        <p className="text-xl leading-relaxed text-white">{question}</p>
      </div>

      {/* Voice Controls */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isDisabled || isInitializing}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center transition-all
            ${isListening
              ? 'bg-custom-red hover:bg-red-600 animate-pulse'
              : 'bg-white hover:bg-gray-200'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isInitializing ? (
            <Loader2 className="w-12 h-12 text-black animate-spin" />
          ) : isListening ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-black" />
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-medium text-white">
            {isInitializing
              ? 'Initializing microphone...'
              : isListening
                ? 'Listening... Click to stop'
                : 'Click to start recording'
            }
          </p>
        </div>
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded border border-gray-600">
          <p className="text-xs text-gray-400 mb-2">Your answer (live transcription):</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-custom-red text-sm text-center">{error}</div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-400 text-center space-y-1">
        <p>Press the microphone button, speak your answer, then press again to submit.</p>
        <p className="text-gray-500">
          Vapi transcribes your voice. Your backend evaluates the answer.
        </p>
      </div>
    </div>
  )
}

export default VoiceInput