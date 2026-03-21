interface ProgressHeaderProps {
  currentQuestion: number
  totalQuestions: number
}

const ProgressHeader = ({ currentQuestion, totalQuestions }: ProgressHeaderProps) => {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">
        Question {currentQuestion} of {totalQuestions}
      </h2>
      <div className="w-full bg-custom-light/20 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressHeader