import { useVapi } from '../hooks/useVapi'

interface VapiVoiceInputProps {
  question: string
  onTranscriptComplete: (transcript: string) => void
  isDisabled?: boolean
  vapiPublicKey: string
}

export function VapiVoiceInput({
  question,
  onTranscriptComplete,
  isDisabled = false,
  vapiPublicKey
}: VapiVoiceInputProps) {
  const { start, stop, isCallActive, transcript, isSpeaking, assistantSpeaking, clearTranscript } = useVapi(vapiPublicKey)

  const handleStart = () => {
    console.log('Start button clicked, question:', question);
    console.log('Vapi public key:', vapiPublicKey);
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold text-gray-700 mb-2">Question:</p>
        <p className="text-gray-900">{question}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-3">
          {!isCallActive ? (
            <button
              onClick={handleStart}
              disabled={isDisabled}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              🎤 Start Question
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={isDisabled}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ⏹️ Stop Question
            </button>
          )}

          {transcript && !isCallActive && (
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ✓ Submit Answer
            </button>
          )}
        </div>

        {isCallActive && assistantSpeaking && (
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Vapi is speaking...</span>
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
            Click "Start Recording" and Vapi will ask you the question - then speak your answer
          </p>
        )}
      </div>
    </div>
  )
}
