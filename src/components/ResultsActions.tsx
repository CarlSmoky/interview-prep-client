import { Home, RotateCcw, Download } from 'lucide-react'
import { useState } from 'react'

interface ResultsActionsProps {
  onRetryInterview: () => void
  onGoHome: () => void
  onDownload: (format: 'csv' | 'text' | 'pdf') => void
}

const ResultsActions = ({ onRetryInterview, onGoHome, onDownload }: ResultsActionsProps) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
      <button
        onClick={onRetryInterview}
        className="flex items-center justify-center w-full md:w-1/3 gap-2 bg-white text-black rounded py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
      >
        <RotateCcw size={20} />
        Try Another Interview
      </button>

      <div className="relative w-full md:w-1/3">
        <button
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="flex items-center justify-center gap-2 w-full bg-custom-secondary-accent text-black rounded py-3 px-6 font-medium hover:bg-custom-secondary-accent/80 transition-colors"
        >
          <Download size={20} />
          Download Results
        </button>

        {showDownloadMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white text-black rounded shadow-lg overflow-hidden z-10 min-w-max">
            <button
              onClick={() => {
                onDownload('pdf')
                setShowDownloadMenu(false)
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Download as PDF (.pdf)
            </button>
            <button
              onClick={() => {
                onDownload('csv')
                setShowDownloadMenu(false)
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Download as CSV (.csv)
            </button>
            <button
              onClick={() => {
                onDownload('text')
                setShowDownloadMenu(false)
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Download as Text (.txt)
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onGoHome}
        className="flex items-center justify-center w-full md:w-1/3 gap-2 border border-white text-white rounded py-3 px-6 font-medium hover:bg-white hover:text-black transition-colors"
      >
        <Home size={20} />
        Go Home
      </button>
    </div>
  )
}

export default ResultsActions