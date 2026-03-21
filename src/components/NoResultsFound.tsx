interface NoResultsFoundProps {
  onStartNewInterview: () => void
}

const NoResultsFound = ({ onStartNewInterview }: NoResultsFoundProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="max-w-2xl w-full border border-red-500 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-400">No Results Found</h2>
        <p className="text-gray-300 mb-6">
          We couldn't find any interview results to display.
        </p>
        <button
          onClick={onStartNewInterview}
          className="mt-6 bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200"
        >
          Start New Interview
        </button>
      </div>
    </div>
  )
}

export default NoResultsFound