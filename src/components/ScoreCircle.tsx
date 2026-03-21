interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

const ScoreCircle = ({
  score,
  size = 160,
  strokeWidth = 8,
  label = ""
}: ScoreCircleProps) => {
  const radius = (size / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Circular Progress */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
            className={`transition-all duration-1000 ${score >= 70 ? 'text-green-400' :
              score >= 50 ? 'text-yellow-400' :
                'text-red-400'
              }`}
            strokeLinecap="round"
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{score}%</span>
        </div>
      </div>
      {label && <p className="text-sm text-gray-400 mt-2">{label}</p>}
    </div>
  )
}

export default ScoreCircle