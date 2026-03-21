import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { submitAnswer } from '../../lib/api/interview'
import { VapiVoiceInput } from '../../components/VapiVoiceInput'
import { getMockSubmitAnswerResponse, mockDelay } from '../../lib/mock/interviewMock'
import TextModeInput from '../../components/TextModeInput'
import ProgressHeader from '../../components/ProgressHeader'
import ModeIndicator from '../../components/ModeIndicator'
import type { QuestionResult, SessionData } from '../../type/interview'

export const Route = createFileRoute('/interview/session')({
  component: RouteComponent,
})

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

  const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || localStorage.getItem('vapiPublicKey') || ''
  const mode = sessionData?.mode || 'text'
  const TEST = import.meta.env.VITE_TEST_MODE === 'true'

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

  const validateAnswer = (answer: string): boolean => {
    if (!answer.trim()) {
      setError('Please provide an answer')
      return false
    }
    return true
  }

  const submitAnswerToAPI = async (answer: string) => {
    if (TEST) {
      await mockDelay(1000)
      return getMockSubmitAnswerResponse(currentQuestion - 1, totalQuestions)
    } else {
      return await submitAnswer({ sessionId, answer })
    }
  }

  const storeQuestionResult = (answer: string, response: any): QuestionResult[] => {
    const newResult: QuestionResult = {
      question,
      answer,
      evaluation: response.evaluation
    }
    return [...results, newResult]
  }

  const navigateToResults = (updatedResults: QuestionResult[]) => {
    console.log('Interview complete, navigating to results')
    window.scrollTo(0, 0)
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
  }

  const moveToNextQuestion = (nextQuestion: string) => {
    console.log('Moving to next question:', nextQuestion)
    setQuestion(nextQuestion)
    setCurrentQuestion(prev => prev + 1)
    setAnswer('')
    setShowQuestion(false)
  }

  const handleNavigation = (response: any, updatedResults: QuestionResult[]) => {
    if (response.done || !response.nextQuestion) {
      navigateToResults(updatedResults)
    } else {
      moveToNextQuestion(response.nextQuestion.question)
    }
  }

  const handleSubmitAnswer = async (answerText?: string) => {
    const finalAnswer = answerText || answer

    if (!validateAnswer(finalAnswer)) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await submitAnswerToAPI(finalAnswer)

      console.log('Backend response:', response)
      console.log('Next question:', response.nextQuestion)
      console.log('Done:', response.done)

      const updatedResults = storeQuestionResult(finalAnswer, response)
      setResults(updatedResults)
      console.log('Stored results count:', updatedResults.length, 'Latest score:', response.evaluation.overallScore)

      handleNavigation(response, updatedResults)
      setIsSubmitting(false)
    } catch (err) {
      console.error('Submit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
      setIsSubmitting(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading session...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl border border-white rounded-lg p-6">
        <ProgressHeader
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />

        <ModeIndicator mode={mode} />

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
          <TextModeInput
            question={question}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={() => handleSubmitAnswer()}
            isSubmitting={isSubmitting}
          />
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4 mt-4">{error}</div>
        )}
      </div>
    </div >
  )
}
