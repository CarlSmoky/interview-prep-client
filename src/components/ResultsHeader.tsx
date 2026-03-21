import ScoreCircle from './ScoreCircle'
import StrengthsWeaknesses from './StrengthsWeaknesses'

interface ResultsHeaderProps {
  overallScore: number
  strengths?: string[]
  weaknesses?: string[]
  interviewType?: string
  level?: string
  questionsCount?: number
}

const ResultsHeader = ({
  overallScore,
  strengths = [],
  weaknesses = [],
  interviewType,
  level,
  questionsCount
}: ResultsHeaderProps) => {
  return (
    <div className="border border-white rounded-lg p-6 mb-6">
      <h1 className="text-3xl font-heading font-bold mb-2">Overall Score</h1>

      <ScoreCircle score={overallScore} />

      {/* Interview Metadata */}
      <div className="flex gap-4 text-sm text-gray-400 mb-4 justify-center">
        {interviewType && (
          <span className="capitalize">Type: {interviewType}</span>
        )}
        {level && (
          <span>Level: {level}</span>
        )}
        {questionsCount && (
          <span>{questionsCount} Questions</span>
        )}
      </div>

      {/* AI Report Strengths & Weaknesses (if available) */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <StrengthsWeaknesses
          strengths={strengths}
          weaknesses={weaknesses}
        />
      )}
    </div>
  )
}

export default ResultsHeader