import { Eye, EyeOff, Mic, MicOff, Send } from 'lucide-react'
import { useVapi } from '../hooks/useVapi'

interface VapiVoiceInputProps {
  question: string
  showQuestion?: boolean
  setShowQuestion?: (show: boolean) => void
  onTranscriptComplete: (transcript: string) => void
  isDisabled?: boolean
  vapiPublicKey: string
  isLastQuestion?: boolean
}

export function VapiVoiceInput({
  question,
  showQuestion,
  setShowQuestion,
  onTranscriptComplete,
  isDisabled = false,
  vapiPublicKey,
  isLastQuestion = false,
}: VapiVoiceInputProps) {
  const { start, stop, isCallActive, transcript, isSpeaking, assistantSpeaking, clearTranscript } = useVapi(vapiPublicKey)

  const handleStart = () => {
    clearTranscript()
    start(question)
  }

  const handleStop = () => {
    stop()
  }

  const handleSubmit = () => {
    if (transcript) {
      onTranscriptComplete(transcript)
      clearTranscript()
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowQuestion?.(!showQuestion)}
            className="flex gap-2 items-center text-sm text-custom-dark font-medium hover:text-custom-dark/60 transition-colors bg-white rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {showQuestion ? <EyeOff /> : <Eye />} {showQuestion ? 'Hide Question' : 'Show Question'}
          </button>
        </div>
        {showQuestion && (
          <p className="text-xl leading-relaxed">{question}</p>
        )}
      </div>

      <div className="bg-custom-light p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex  gap-3">
          {!isCallActive ? (
            <button
              onClick={handleStart}
              disabled={isDisabled}
              className="flex gap-4 px-4 items-center w-40 h-12 bg-custom-dark text-white rounded-lg hover:bg-custom-dark/60 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Mic /> {transcript ? 'Re-record' : 'Start'}
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={isDisabled}
              className="flex gap-4 px-4 items-center w-40 h-12 bg-custom-dark text-white rounded-lg hover:bg-custom-dark/60 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <MicOff /> Stop
            </button>
          )}

          {transcript && !isCallActive && (
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className="flex gap-4 px-4 items-center w-50 h-12 bg-custom-dark text-white rounded-lg hover:bg-custom-dark/60 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send /> {isLastQuestion ? 'Submit Answer' : 'Submit & Next'}
            </button>
          )}
        </div>

        {isCallActive && assistantSpeaking && (
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AI interviewer is speaking...</span>
          </div>
        )}

        {isCallActive && isSpeaking && !assistantSpeaking && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening to you...</span>
          </div>
        )}

        {isCallActive && !isSpeaking && !assistantSpeaking && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium">Waiting for you to speak...</span>
          </div>
        )}

        {transcript && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 mb-2">Your Answer:</p>
            <p className="text-gray-900 whitespace-pre-wrap">{transcript}</p>
          </div>
        )}

        {!transcript && !isCallActive && (
          <p className="text-gray-500 text-sm">
            Click "Start" and the AI interviewer will ask the question. Then speak your answer out loud.
          </p>
        )}
      </div>
    </div>
  )
}
