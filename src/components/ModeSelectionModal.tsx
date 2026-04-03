import { Mic, Keyboard, X } from 'lucide-react'

interface ModeSelectionModalProps {
  onSelectMode: (mode: 'text' | 'voice') => void
  onClose: () => void
}

const ModeSelectionModal = ({ onSelectMode, onClose }: ModeSelectionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-custom-dark border border-white/10 rounded-2xl p-8 max-w-md w-full text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-heading font-bold mb-2">Choose Your Mode</h2>
        <p className="text-sm text-custom-light/60 mb-6">
          How would you like to answer interview questions?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSelectMode('voice')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 transition-colors"
          >
            <Mic size={32} className="text-white" />
            <span className="font-semibold">Voice</span>
            <span className="text-xs text-custom-light/50 text-center">Speak your answers naturally</span>
          </button>
          <button
            onClick={() => onSelectMode('text')}
            className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 transition-colors"
          >
            <Keyboard size={32} className="text-white" />
            <span className="font-semibold">Text</span>
            <span className="text-xs text-custom-light/50 text-center">Type your answers instead</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModeSelectionModal
