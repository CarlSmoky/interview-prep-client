import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { submitAnswer } from '../../lib/api/interview'
import { VoiceInput } from '../../components/VoiceInput'
import { SimpleSpeechInput } from '../../components/SimpleSpeechInput'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [useSimpleSpeech, setUseSimpleSpeech] = useState(false)
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
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mode Indicator */}
        <div className="mb-4 text-sm text-gray-400 text-center">
          Mode: {mode === 'voice' ? '🎤 Voice' : '⌨️ Text'}
        </div>

        {/* Voice Mode */}
        {mode === 'voice' ? (
          <>
            {/* Voice Provider Toggle */}
            <div className="mb-4 flex gap-2 justify-center">
              <button
                onClick={() => setUseSimpleSpeech(false)}
                className={`px-4 py-2 rounded text-sm ${!useSimpleSpeech
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Vapi (Professional)
              </button>
              <button
                onClick={() => setUseSimpleSpeech(true)}
                className={`px-4 py-2 rounded text-sm ${useSimpleSpeech
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Browser Speech (Free)
              </button>
            </div>

            {useSimpleSpeech ? (
              <SimpleSpeechInput
                question={question}
                onTranscriptComplete={(transcript) => handleSubmitAnswer(transcript)}
                isDisabled={isSubmitting}
              />
            ) : !vapiKey ? (
              <div className="mb-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded">
                <p className="text-sm text-yellow-400 mb-2">Vapi API Key Required</p>
                <input
                  type="text"
                  value={vapiKey}
                  onChange={(e) => {
                    setVapiKey(e.target.value)
                    localStorage.setItem('vapiPublicKey', e.target.value)
                  }}
                  placeholder="Enter your Vapi Public Key"
                  className="w-full bg-transparent border border-yellow-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Get your key from <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline">vapi.ai</a>
                </p>
              </div>
            ) : (
              <VoiceInput
                question={question}
                onTranscriptComplete={(transcript) => handleSubmitAnswer(transcript)}
                isDisabled={isSubmitting}
                vapiPublicKey={vapiKey}
              />
            )}
          </>
        ) : (
          /* Text Mode */
          <>
            <div className="mb-6">
              <p className="text-xl leading-relaxed">{question}</p>
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
          </>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4 mt-4">{error}</div>
        )}
      </div>
    </div>
  )
}
