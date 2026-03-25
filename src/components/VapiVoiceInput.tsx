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
    <div className="space-y-5">
      <div className="rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowQuestion?.(!showQuestion)}
            className="flex gap-2 items-center text-xs tracking-widest uppercase text-custom-light/50 hover:text-white transition-colors focus:outline-none"
          >
            {showQuestion ? <EyeOff size={14} /> : <Eye size={14} />} {showQuestion ? 'Hide Question' : 'Show Question'}
          </button>
        </div>
        {showQuestion && (
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-lg leading-relaxed font-heading">{question}</p>
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex gap-3">
          {!isCallActive ? (
            <button
              onClick={handleStart}
              disabled={isDisabled}
              className="flex gap-2 px-5 items-center h-11 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Mic size={16} /> {transcript ? 'Re-record' : 'Start'}
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={isDisabled}
              className="flex gap-2 px-5 items-center h-11 bg-custom-red text-white rounded-full font-semibold text-sm hover:bg-custom-red/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <MicOff size={16} /> Stop
            </button>
          )}

          {transcript && !isCallActive && (
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className="flex gap-2 px-5 items-center h-11 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} /> {isLastQuestion ? 'Submit Answer' : 'Next'}
            </button>
          )}
        </div>

        {isCallActive && assistantSpeaking && (
          <div className="flex items-center gap-2 text-custom-secondary-accent">
            <div className="w-2.5 h-2.5 bg-custom-secondary-accent rounded-full animate-pulse"></div>
            <span className="text-sm">AI interviewer is speaking...</span>
          </div>
        )}

        {isCallActive && isSpeaking && !assistantSpeaking && (
          <div className="flex items-center gap-2 text-white">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm">Listening to you...</span>
          </div>
        )}

        {isCallActive && !isSpeaking && !assistantSpeaking && (
          <div className="flex items-center gap-2 text-custom-light/40">
            <div className="w-2.5 h-2.5 bg-custom-light/30 rounded-full"></div>
            <span className="text-sm">Waiting for you to speak...</span>
          </div>
        )}

        {transcript && (
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
            <p className="text-xs tracking-widest uppercase text-custom-light/40 mb-2">Your Answer</p>
            <p className="text-custom-light/80 whitespace-pre-wrap text-sm leading-relaxed">{transcript}</p>
          </div>
        )}

        {!transcript && !isCallActive && (
          <p className="text-custom-light/30 text-sm">
            Click "Start" and the AI interviewer will ask the question. Then speak your answer out loud.
          </p>
        )}
      </div>
    </div>
  )
}
