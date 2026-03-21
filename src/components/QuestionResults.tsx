import { useState } from 'react'

interface QuestionResult {
  question: string
  answer: string
  evaluation: {
    technicalAccuracy: number
    depth: number
    clarity: number
    seniorityAlignment?: number
    overallScore: number
    feedback: string
    improvementSuggestions?: string[]
    sampleAnswer?: string
  }
}

interface QuestionResultsProps {
  results: QuestionResult[]
}

const QuestionResults = ({ results }: QuestionResultsProps) => {
  const [visibleSampleAnswers, setVisibleSampleAnswers] = useState<Record<number, boolean>>({})

  const toggleSampleAnswerVisibility = (index: number) => {
    setVisibleSampleAnswers(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Detailed Feedback</h2>
      {results.map((result, index) => (
        <div key={index} className="border border-white rounded-lg p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg">Question {index + 1}</h3>
            <span className="font-bold text-xl text-white">
              {result.evaluation.overallScore}/100
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-300 italic">"{result.question}"</p>
          </div>

          <div className="mb-4 p-3 bg-custom-light bg-opacity-50 rounded">
            <p className="text-sm text-gray-400 mb-1">Your Answer:</p>
            <p className="text-custom-secondary-dark">{result.answer}</p>
          </div>

          <div className={`grid ${result.evaluation.seniorityAlignment !== undefined ? 'grid-cols-4' : 'grid-cols-3'} gap-3 mb-4`}>
            <div className="text-center">
              <div className="text-sm text-gray-400">Technical</div>
              <div className="font-semibold">{result.evaluation.technicalAccuracy}/100</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Depth</div>
              <div className="font-semibold">{result.evaluation.depth}/100</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Clarity</div>
              <div className="font-semibold">{result.evaluation.clarity}/100</div>
            </div>
            {result.evaluation.seniorityAlignment !== undefined && (
              <div className="text-center">
                <div className="text-sm text-gray-400">Seniority</div>
                <div className="font-semibold">{result.evaluation.seniorityAlignment}/100</div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-3">
            <p className="font-heading text-base text-white mb-2">Feedback:</p>
            <p className="text-gray-300">{result.evaluation.feedback}</p>

            {result.evaluation.improvementSuggestions && result.evaluation.improvementSuggestions.length > 0 && (
              <div className="mt-3">
                <p className="font-heading text-base text-white mb-2">Improvement Suggestions:</p>
                <ul className="space-y-1">
                  {result.evaluation.improvementSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-gray-300">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.evaluation.sampleAnswer && (
            <div className="my-4 bg-opacity-20">
              <div className="flex items-center justify-between mb-2">
                <p className="font-headig text-base text-white">Sample Answer</p>
                <button
                  onClick={() => toggleSampleAnswerVisibility(index)}
                  className="text-xs text-custom-secondary-accent hover:text-custom-secondary-accent/50 underline"
                >
                  {visibleSampleAnswers[index] ? 'Hide' : 'Show'}
                </button>
              </div>
              {visibleSampleAnswers[index] && (
                <p className="text-gray-200 text-sm leading-relaxed">{result.evaluation.sampleAnswer}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default QuestionResults