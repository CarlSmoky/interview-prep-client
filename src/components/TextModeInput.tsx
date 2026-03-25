import { Send } from 'lucide-react'

interface TextModeInputProps {
  question: string
  answer: string
  onAnswerChange: (answer: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

const TextModeInput = ({
  question,
  answer,
  onAnswerChange,
  onSubmit,
  isSubmitting
}: TextModeInputProps) => {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs tracking-widest uppercase text-custom-light/40 mb-3">Interview Question</p>
        <p className="text-lg leading-relaxed font-heading">{question}</p>
      </div>

      <div>
        <label className="block mb-2 text-xs tracking-widest uppercase text-custom-light/40">Your Answer</label>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={isSubmitting}
          className="w-full h-52 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/20 disabled:opacity-50 placeholder:text-custom-light/20 transition-colors"
          placeholder="Type your answer here..."
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !answer.trim()}
        className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-full py-3 px-8 font-semibold hover:bg-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={16} />
            Submit Answer
          </>
        )}
      </button>
    </div>
  )
}

export default TextModeInput