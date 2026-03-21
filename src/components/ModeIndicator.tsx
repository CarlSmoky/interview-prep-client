import { Mic, Keyboard } from 'lucide-react'

interface ModeIndicatorProps {
  mode: 'text' | 'voice'
}

const ModeIndicator = ({ mode }: ModeIndicatorProps) => {
  return (
    <div className="mb-4 text-sm text-gray-400 text-center flex items-center justify-center gap-1">
      Mode: {mode === 'voice' ? (
        <>
          <Mic className="inline-block w-4 h-4" /> Voice
        </>
      ) : (
        <>
          <Keyboard className="inline-block w-4 h-4" /> Text
        </>
      )}
    </div>
  )
}

export default ModeIndicator