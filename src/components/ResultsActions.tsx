import { Home, RotateCcw, Download } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'

interface ResultsActionsProps {
  onRetryInterview: () => void
  onGoHome: () => void
  onDownload: (format: 'csv' | 'text' | 'pdf') => void
}

const ResultsActions = ({ onRetryInterview, onGoHome, onDownload }: ResultsActionsProps) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
      <Button onClick={onRetryInterview} variant="filled" className="flex items-center justify-center w-full md:w-1/3 gap-2 bg-white text-gray-600 rounded-full py-3 px-6 font-medium hover:bg-white/80 transition-colors">
        <RotateCcw size={20} />
        Try Another Interview
      </Button>

      <div className="relative w-full md:w-1/3">
        <Button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="flex items-center justify-center gap-2 w-full bg-white text-gray-600 rounded-full py-3 px-6 font-medium hover:bg-white/80 transition-colors">
          <Download size={20} />
          Download Results
        </Button>
        {showDownloadMenu && (
          <div className="absolute bottom-full mb-2 left-0 bg-white text-black rounded-xl shadow-lg overflow-hidden z-10 min-w-max">
            {(['pdf', 'csv', 'text'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => { onDownload(fmt); setShowDownloadMenu(false) }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Download as {fmt.toUpperCase()} (.{fmt})
              </button>
            ))}
          </div>
        )}
      </div>

      <Button onClick={onGoHome} variant="outline" className="flex items-center justify-center w-full md:w-1/3 gap-2 border border-white text-white rounded-full py-3 px-6 font-medium hover:bg-white/10 transition-colors">
        <Home size={20} />
        Go Home
      </Button>
    </div>
  )
}

export default ResultsActions