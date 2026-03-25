import { Mic, Keyboard } from 'lucide-react'

interface ModeIndicatorProps {
  mode: 'text' | 'voice'
}

const ModeIndicator = ({ mode }: ModeIndicatorProps) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-custom-light/50">
        {mode === 'voice' ? (
          <>
            <Mic className="w-3.5 h-3.5 text-white" /> Voice Mode
          </>
        ) : (
          <>
            <Keyboard className="w-3.5 h-3.5 text-white" /> Text Mode
          </>
        )}
      </div>
    </div>
  )
}

export default ModeIndicator