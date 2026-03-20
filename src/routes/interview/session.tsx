import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { Mic, Keyboard, EyeOff, Eye } from 'lucide-react'
import { submitAnswer } from '../../lib/api/interview'
import { VapiVoiceInput } from '../../components/VapiVoiceInput'
import { getMockSubmitAnswerResponse, mockDelay } from '../../lib/mock/interviewMock'

export const Route = createFileRoute('/interview/session')({
  component: RouteComponent,
})

const TEST = import.meta.env.VITE_TEST_MODE === 'true' // Set via .env file

interface SessionData {
  sessionId: string
  firstQuestion: string
  totalQuestions: number
  interviewType?: string
  level?: string
  mode?: 'text' | 'voice'
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
  const location = useLocation()

  const [sessionData] = useState<SessionData | null>(() => {
    return (location.state as unknown as SessionData) || null
  })

  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answer, setAnswer] = useState('')
  const [question, setQuestion] = useState(sessionData?.firstQuestion || '')
  const [showQuestion, setShowQuestion] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<QuestionResult[]>([])
  const [vapiKey, setVapiKey] = useState(() => {
    return import.meta.env.VITE_VAPI_PUBLIC_KEY || localStorage.getItem('vapiPublicKey') || ''
  })

  const mode = sessionData?.mode || 'text'

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

  const handleSubmitAnswer = async (answerText?: string) => {
    const finalAnswer = answerText || answer

    console.log('handleSubmitAnswer called with:', finalAnswer.substring(0, 50) + '...')

    if (!finalAnswer.trim()) {
      setError('Please provide an answer')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      let response

      if (TEST) {
        // MOCK MODE - for styling/development
        await mockDelay(1000)

        response = getMockSubmitAnswerResponse(currentQuestion - 1, totalQuestions)
      } else {
        // PRODUCTION MODE - real API calls
        console.log('Submitting answer to backend...')
        response = await submitAnswer({
          sessionId,
          answer: finalAnswer,
        })
      }

      console.log('Backend response:', response)
      console.log('Next question:', response.nextQuestion)
      console.log('Done:', response.done)

      // Store the result for this question - use the CURRENT question before updating
      const answeredQuestion = question
      const newResult: QuestionResult = {
        question: answeredQuestion,  // Store the question that was just answered
        answer: finalAnswer,
        evaluation: response.evaluation
      }

      const updatedResults = [...results, newResult]
      setResults(updatedResults)
      console.log('Stored results count:', updatedResults.length, 'Latest score:', response.evaluation.overallScore)
      console.log('Full stored results:', updatedResults)

      // Move to next question immediately without showing evaluation
      if (response.done || !response.nextQuestion) {
        // Interview complete - navigate to results page
        console.log('Interview complete, navigating to results')
        navigate({
          to: '/interview/results',
          state: {
            sessionId,
            results: updatedResults,
            interviewType: sessionData.interviewType,
            level: sessionData.level,
            totalQuestions: sessionData.totalQuestions
          } as never,
        })
      } else {
        // Move to next question
        console.log('Moving to next question:', response.nextQuestion.question)
        setQuestion(response.nextQuestion.question)
        setCurrentQuestion(prev => prev + 1)
        setAnswer('')
        setShowQuestion(false)
      }
      setIsSubmitting(false)
    } catch (err) {
      console.error('Submit error:', err)
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
          <div className="w-full bg-custom-light/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mode Indicator */}
        <div className="mb-4 text-sm text-gray-400 text-center flex items-center justify-center gap-1">
          Mode: {mode === 'voice' ? <><Mic className="inline-block w-4 h-4" /> Voice</> : <><Keyboard className="inline-block w-4 h-4" /> Text</>}
        </div>

        {/* Voice Mode */}
        {mode === 'voice' ? (
          <VapiVoiceInput
            question={question}
            showQuestion={showQuestion}
            setShowQuestion={setShowQuestion}
            onTranscriptComplete={(transcript) => handleSubmitAnswer(transcript)}
            isDisabled={isSubmitting}
            vapiPublicKey={vapiKey}
          />
        ) : (
          /* Text Mode */
          (<>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowQuestion(!showQuestion)}
                  className="flex gap-2 items-center text-sm text-gray-400 hover:text-custom-dark transition-colors bg-white rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {showQuestion ? <EyeOff /> : <Eye />} {showQuestion ? 'Hide Question' : 'Show Question'}
                </button>
              </div>
              {showQuestion && (
                <p className="text-xl leading-relaxed">{question}</p>
              )}

            </div>
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
            <button
              onClick={() => handleSubmitAnswer()}
              disabled={isSubmitting || !answer.trim()}
              className="w-full bg-white text-black rounded py-3 px-8 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </>)
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4 mt-4">{error}</div>
        )}
      </div>
    </div >
  )
}
