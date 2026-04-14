import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { finishInterview, type FinalReport } from '../../lib/api/interview'
import ErrorBanner from '../../components/ErrorBanner'
import QuestionResults from '../../components/QuestionResults'
import ResultsActions from '../../components/ResultsActions'
import AIRecommendations from '../../components/AIRecommendations'
import ResultsHeader from '../../components/ResultsHeader'
import NoResultsFound from '../../components/NoResultsFound'
import { calculateOverallScore } from '../../lib/utils/calculateOverallScore'
import { downloadAsCSV, downloadAsText, downloadAsPDF } from '../../lib/utils/downloadResults'
import LoadingResults from '../../components/LoadingResults'
import type { InterviewMetadata, QuestionResult } from '../../type/interview'
import { requireAuth } from '../../lib/auth/config'

export const Route = createFileRoute('/interview/results')({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [report, setReport] = useState<FinalReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [storedResults, setStoredResults] = useState<QuestionResult[]>([])
  const [metadata, setMetadata] = useState<InterviewMetadata>({})

  const parseStateData = () => {
    const stateData = location.state as {
      sessionId?: string
      results?: QuestionResult[]
      interviewType?: string
      level?: string
      totalQuestions?: number
      resume?: string
      jobDescription?: string
      companyName?: string
      jobTitle?: string
    } | undefined

    return {
      results: stateData?.results || [],
      sessionId: stateData?.sessionId,
      metadata: {
        interviewType: stateData?.interviewType,
        level: stateData?.level,
        totalQuestions: stateData?.totalQuestions,
        resume: stateData?.resume,
        jobDescription: stateData?.jobDescription,
        companyName: stateData?.companyName,
        jobTitle: stateData?.jobTitle,
      }
    }
  }

  const fetchFinalReport = async (sessionId: string) => {
    try {
      const response = await finishInterview({ sessionId })
      return response.finalReport
    } catch (err) {
      console.error('Error finishing interview:', err)
      setError('Could not load AI report. Your results are still available below.')
      return null
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchResults = async () => {
      const { results, sessionId, metadata } = parseStateData()

      setStoredResults(results)
      setMetadata(metadata)

      if (!sessionId && (!results || results.length === 0)) {
        console.warn('No session ID or results found, redirecting to interview setup')
        navigate({ to: '/interview' })
        return
      }

      if (sessionId) {
        const finalReport = await fetchFinalReport(sessionId)
        if (finalReport) setReport(finalReport)
      }

      setIsLoading(false)
    }

    fetchResults()
  }, [navigate, location.state])


  if (isLoading) {
    return <LoadingResults />
  }

  if (!storedResults.length && !report) {
    return <NoResultsFound onStartNewInterview={() => navigate({ to: '/interview' })} />
  }

  const overallScore = calculateOverallScore(storedResults, report)

  const handleDownload = (format: 'csv' | 'text' | 'pdf') => {
    const downloadData = {
      overallScore,
      metadata,
      results: storedResults,
      strengths: report?.strengths,
      weaknesses: report?.weaknesses,
      recommendations: report?.recommendations,
    }

    if (format === 'csv') {
      downloadAsCSV(downloadData)
    } else if (format === 'pdf') {
      downloadAsPDF(downloadData)
    } else {
      downloadAsText(downloadData)
    }
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
          onGoHome={() => {
            window.location.href = '/'
          }}
          onDownload={handleDownload}
        />
      </div>
    </div>
  )
}
