import { Home, RotateCcw } from 'lucide-react'

interface ResultsActionsProps {
  onRetryInterview: () => void
  onGoHome: () => void
}

const ResultsActions = ({ onRetryInterview, onGoHome }: ResultsActionsProps) => {
  return (
    <div className="flex gap-4 mt-8 justify-center">
      <button
        onClick={onRetryInterview}
        className="flex items-center gap-2 bg-white text-black rounded py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
      >
        <RotateCcw size={20} />
        Try Another Interview
      </button>
      <button
        onClick={onGoHome}
        className="flex items-center gap-2 border border-white text-white rounded py-3 px-6 font-medium hover:bg-white hover:text-black transition-colors"
      >
        <Home size={20} />
        Go Home
      </button>
    </div>
  )
}

export default ResultsActions