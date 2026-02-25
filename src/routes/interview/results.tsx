import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react'

export const Route = createFileRoute('/interview/results')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  // Mock results - in real app, this would come from state/API
  const results = {
    totalQuestions: 6,
    correctAnswers: 4,
    score: 67,
    feedback: [
      {
        id: 1,
        question: "Explain how React reconciliation works.",
        userAnswer: "React reconciliation is the process...",
        isCorrect: true,
        feedback: "Good explanation of the virtual DOM diffing algorithm."
      },
      {
        id: 2,
        question: "What are React hooks?",
        userAnswer: "Hooks are functions that...",
        isCorrect: true,
        feedback: "Clear and concise answer."
      },
      {
        id: 3,
        question: "Explain the difference between useMemo and useCallback.",
        userAnswer: "useMemo returns a value...",
        isCorrect: false,
        feedback: "Your answer was partially correct but missed key details about dependency arrays."
      },
      {
        id: 4,
        question: "What is prop drilling and how can you avoid it?",
        userAnswer: "Prop drilling is when you pass props...",
        isCorrect: true,
        feedback: "Excellent answer covering Context API and state management solutions."
      },
      {
        id: 5,
        question: "Explain React's useEffect hook.",
        userAnswer: "useEffect is used for side effects...",
        isCorrect: false,
        feedback: "You should mention the cleanup function and dependency array behavior."
      },
      {
        id: 6,
        question: "What is the virtual DOM?",
        userAnswer: "The virtual DOM is a lightweight copy...",
        isCorrect: true,
        feedback: "Well explained with good understanding of the concept."
      }
    ]
  }

  const handleRetry = () => {
    navigate({ to: '/interview' })
  }

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen p-6 text-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border border-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-gray-400 mb-4">Here are your results</p>

          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{results.score}%</div>
              <div className="text-sm text-gray-400">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">{results.correctAnswers}</div>
              <div className="text-sm text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{results.totalQuestions}</div>
              <div className="text-sm text-gray-400">Total Questions</div>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Question Breakdown</h2>
          {results.feedback.map((item) => (
            <div key={item.id} className="border border-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {item.isCorrect ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <XCircle className="text-red-400" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Question {item.id}</h3>
                  <p className="text-gray-300 mb-3">{item.question}</p>

                  <div className="bg-gray-800 bg-opacity-50 rounded p-3 mb-2">
                    <p className="text-sm text-gray-400 mb-1">Your Answer:</p>
                    <p className="text-sm">{item.userAnswer}</p>
                  </div>

                  <div className={`p-3 rounded ${item.isCorrect ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'}`}>
                    <p className="text-sm font-medium mb-1">Feedback:</p>
                    <p className="text-sm">{item.feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 bg-white text-black rounded py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={20} />
            Try Another Interview
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 border border-white text-white rounded py-3 px-6 font-medium hover:bg-white hover:text-black transition-colors"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
