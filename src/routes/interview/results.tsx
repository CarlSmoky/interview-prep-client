import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { finishInterview, type FinalReport } from '../../lib/api/interview'
import ErrorBanner from '../../components/ErrorBanner'
import QuestionResults from '../../components/QuestionResults'
import ResultsActions from '../../components/ResultsActions'
import AIRecommendations from '../../components/AIRecommendations'
import ResultsHeader from '../../components/ResultsHeader'

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
        <ResultsHeader
          overallScore={overallScore}
          strengths={report?.strengths}
          weaknesses={report?.weaknesses}
          interviewType={metadata?.interviewType}
          level={metadata?.level}
          questionsCount={storedResults.length}
        />

        {report && <AIRecommendations recommendations={report.recommendations} />}

        {error && <ErrorBanner message={error} />}

        <QuestionResults results={storedResults} />

        <ResultsActions
          onRetryInterview={() => navigate({ to: '/interview' })}
          onGoHome={() => navigate({ to: '/' })}
        />
      </div>
    </div>
  )
}
