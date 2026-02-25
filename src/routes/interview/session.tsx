import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { submitAnswer } from '../../lib/api/interview'

export const Route = createFileRoute('/interview/session')({
  component: RouteComponent,
})

interface SessionData {
  sessionId: string
  firstQuestion: string
  totalQuestions: number
  analysis?: {
    matchScore: number
    strengths: string[]
    missingSkills: string[]
    improvementSuggestions: string[]
  }
}

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
  }
}

function RouteComponent() {
  const navigate = useNavigate()

  const [sessionData] = useState<SessionData | null>(() => {
    const storedData = sessionStorage.getItem('interviewSession')
    if (!storedData) return null

    const parsed = JSON.parse(storedData)
    // Handle both old format (object) and new format (string)
    if (parsed.firstQuestion && typeof parsed.firstQuestion === 'object') {
      parsed.firstQuestion = parsed.firstQuestion.question
    }
    return parsed
  })

  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState(sessionData?.firstQuestion || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<QuestionResult[]>(() => {
    const stored = sessionStorage.getItem('questionResults')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (!sessionData) {
      console.warn('No session data found, redirecting to interview setup')
      navigate({ to: '/interview' })
    }
  }, [sessionData, navigate])

  if (!sessionData) {
    return null
  }

  const { sessionId, totalQuestions } = sessionData
  const progress = (currentQuestion / totalQuestions) * 100

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await submitAnswer({
        sessionId,
        answer,
      })

      console.log('Received evaluation:', response.evaluation)

      // Store the result for this question
      const newResult: QuestionResult = {
        question,
        answer,
        evaluation: response.evaluation
      }
      const updatedResults = [...results, newResult]
      setResults(updatedResults)
      sessionStorage.setItem('questionResults', JSON.stringify(updatedResults))
      console.log('Stored results count:', updatedResults.length, 'Latest score:', response.evaluation.overallScore)

      // Move to next question immediately without showing evaluation
      if (response.done || !response.nextQuestion) {
        // Interview complete - navigate to results page
        sessionStorage.setItem('completedSessionId', sessionId)
        sessionStorage.removeItem('interviewSession')
        console.log('Interview complete, navigating to results')
        navigate({ to: '/interview/results' })
      } else {
        // Move to next question
        setQuestion(response.nextQuestion.question)
        setCurrentQuestion(prev => prev + 1)
        setAnswer('')
      }
      setIsSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl border border-white rounded-lg p-6">
        {/* Progress Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Question {currentQuestion} of {totalQuestions}
          </h2>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-xl leading-relaxed">{question}</p>
        </div>

        {/* Answer Textarea */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-64 bg-transparent border border-white rounded px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            placeholder="Type your answer here..."
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitAnswer}
        disabled={isSubmitting || !answer.trim()}
        className="mt-6 bg-white text-black rounded py-3 px-8 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  )
}
