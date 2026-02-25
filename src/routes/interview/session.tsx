import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/interview/session')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(2)
  const [totalQuestions] = useState(6)
  const [answer, setAnswer] = useState('')

  // Mock question - in real app, this would come from state/API
  const question = "Explain how React reconciliation works."

  const progress = (currentQuestion / totalQuestions) * 100

  const handleSubmitAnswer = () => {
    console.log('Answer submitted:', answer)
    // Handle answer submission logic here
    // Move to next question or finish interview
    setAnswer('')
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Interview complete - navigate to results
      navigate({ to: '/interview/results' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl border border-white rounded-lg p-6">
        {/* Progress Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Question {currentQuestion} of {totalQuestions}
          </h2>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-xl leading-relaxed">{question}</p>
        </div>

        {/* Answer Textarea */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-64 bg-transparent border border-white rounded px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Type your answer here..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitAnswer}
        className="mt-6 bg-white text-black rounded py-3 px-8 font-medium hover:bg-gray-200 transition-colors"
      >
        Submit Answer
      </button>
    </div>
  )
}
