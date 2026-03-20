import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Home, RotateCcw } from 'lucide-react'
import { finishInterview, type FinalReport } from '../../lib/api/interview'

export const Route = createFileRoute('/interview/results')({
  component: RouteComponent,
})

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

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [report, setReport] = useState<FinalReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [storedResults, setStoredResults] = useState<QuestionResult[]>([])
  const [visibleSampleAnswers, setVisibleSampleAnswers] = useState<Record<number, boolean>>({})
  const [metadata, setMetadata] = useState<{
    interviewType?: string
    level?: string
    totalQuestions?: number
  }>({})

  useEffect(() => {
    const fetchResults = async () => {
      // Get data from navigation state
      const stateData = location.state as {
        sessionId?: string
        results?: QuestionResult[]
        interviewType?: string
        level?: string
        totalQuestions?: number
      } | undefined

      const results = stateData?.results || []
      const sessionId = stateData?.sessionId

      console.log('Results from navigation state:', results)
      console.log('Number of results:', results.length)

      setStoredResults(results)
      setMetadata({
        interviewType: stateData?.interviewType,
        level: stateData?.level,
        totalQuestions: stateData?.totalQuestions
      })

      if (!sessionId && (!results || results.length === 0)) {
        console.warn('No session ID or results found, redirecting to interview setup')
        navigate({ to: '/interview' })
        return
      }

      // Try to get final report from backend (optional)
      if (sessionId) {
        try {
          console.log('Fetching interview results for session:', sessionId)
          const response = await finishInterview({ sessionId })
          console.log('Received final report:', response)
          setReport(response.finalReport)
        } catch (err) {
          console.error('Error finishing interview:', err)
          setError(err instanceof Error ? err.message : 'Failed to load AI-generated report')
          // Don't fail if we have stored results
        }
      }

      setIsLoading(false)
    }

    fetchResults()
  }, [navigate])

  const toggleSampleAnswerVisibility = (index: number) => {
    setVisibleSampleAnswers(prev => ({ ...prev, [index]: !prev[index] }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading results...</div>
      </div>
    )
  }

  // If we have no stored results and no report, show error
  if (!storedResults.length && !report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="max-w-2xl w-full border border-red-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-400">No Results Found</h2>
          <p className="text-gray-300 mb-6">
            We couldn't find any interview results to display.
          </p>
          <button
            onClick={() => {
              navigate({ to: '/interview' })
            }}
            className="mt-6 bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-200"
          >
            Start New Interview
          </button>
        </div>
      </div>
    )
  }

  // Calculate overall score from stored results if we don't have a report
  let overallScore = 0

  if (storedResults.length > 0) {
    // Calculate from stored results
    const totalScore = storedResults.reduce((sum, r) => {
      const score = Number(r.evaluation?.overallScore) || 0
      return sum + score
    }, 0)
    overallScore = Math.round(totalScore / storedResults.length)
    console.log('Calculated score from stored results:', overallScore, 'from', storedResults.length, 'questions')
  } else if (report?.overallScore) {
    // Use AI report score
    overallScore = report.overallScore
    console.log('Using AI report score:', overallScore)
  }

  return (
    <div className="min-h-screen p-6 text-white overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border border-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">Over all score</h1>


          {/* Score Summary */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2">{overallScore}%</div>
          </div>
          <div className="flex gap-4 text-sm text-gray-400 mb-4">
            {metadata.interviewType && (
              <span className="capitalize">Type: {metadata.interviewType}</span>
            )}
            {metadata.level && (
              <span>Level: {metadata.level}</span>
            )}
            {storedResults.length > 0 && (
              <span>{storedResults.length} Questions</span>
            )}
          </div>

          {/* AI Report Strengths & Weaknesses (if available) */}
          {report && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {report.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">✓ Strengths</h3>
                  <ul className="space-y-1">
                    {report.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-300">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {report.weaknesses.length > 0 && (
                <div>
                  <h3 className="font-semibold text-custom-red mb-2">✗ Areas for Improvement</h3>
                  <ul className="space-y-1">
                    {report.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-300">• {weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Recommendations (if available) */}
        {report && report.recommendations.length > 0 && (
          <div className="border border-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📋 Recommendations</h2>
            <ul className="space-y-2">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-300">
                  {index + 1}. {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error message if AI report failed */}
        {error && (
          <div className="">
            <h3 className="text-custom-red mb-2">AI Report Unavailable</h3>
          </div>
        )}

        {/* Detailed Question Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Detailed Feedback</h2>
          {storedResults.map((result, index) => (
            <div key={index} className="border border-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">Question {index + 1}</h3>
                <span className={`font-bold text-xl text-white`}>
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
                <p className="text-sm text-gray-400 mb-2">Feedback:</p>
                <p className="text-gray-300">{result.evaluation.feedback}</p>

                {result.evaluation.improvementSuggestions && result.evaluation.improvementSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-2">Improvement Suggestions:</p>
                    <ul className="space-y-1">
                      {result.evaluation.improvementSuggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-gray-300">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {result.evaluation.sampleAnswer && (
                <div className="my-4 p-3bg-opacity-20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-custom-secondary-accent font-semibold">Sample Answer</p>
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

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => {
              navigate({ to: '/interview' })
            }}
            className="flex items-center gap-2 bg-white text-black rounded py-3 px-6 font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={20} />
            Try Another Interview
          </button>
          <button
            onClick={() => {
              navigate({ to: '/' })
            }}
            className="flex items-center gap-2 border border-white text-white rounded py-3 px-6 font-medium hover:bg-white hover:text-black transition-colors"
          >
            <Home size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
