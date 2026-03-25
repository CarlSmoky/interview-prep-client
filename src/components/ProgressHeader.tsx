interface ProgressHeaderProps {
  currentQuestion: number
  totalQuestions: number
}

const ProgressHeader = ({ currentQuestion, totalQuestions }: ProgressHeaderProps) => {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-custom-light/40 mb-1">Question</p>
          <h2 className="text-2xl font-heading font-bold">
            {currentQuestion} <span className="text-custom-light/30 font-light text-lg">/ {totalQuestions}</span>
          </h2>
        </div>
        <span className="text-sm text-white font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div
          className="bg-white h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressHeader