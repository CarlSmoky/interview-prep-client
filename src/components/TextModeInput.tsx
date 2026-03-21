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
    <>
      <div className="mb-6">
        <p className="text-xl leading-relaxed">{question}</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Your Answer</label>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={isSubmitting}
          className="w-full h-64 bg-transparent border border-white rounded px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          placeholder="Type your answer here..."
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !answer.trim()}
        className="w-full bg-white text-black rounded py-3 px-8 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </>
  )
}

export default TextModeInput