import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { startInterview, type Level, type InterviewType } from '../../lib/api/interview'
import { getMockStartInterviewResponse, mockDelay } from '../../lib/mock/interviewMock'
import FormTextarea from '../../components/FormTextarea'
import FormSelect from '../../components/FormSelect'
import FormNumberInput from '../../components/FormNumberInput'
import FormButton from '../../components/FormButton'

export const Route = createFileRoute('/interview/')({
  component: RouteComponent,
})

const TEST = import.meta.env.VITE_TEST_MODE === 'true' // Set via .env file
const LEVEL_OPTIONS = [
  { value: 'Junior', label: 'Junior' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Senior', label: 'Senior' }
]

const INTERVIEW_TYPE_OPTIONS = [
  { value: 'mix', label: 'Mix (Technical & Behavioral)' },
  { value: 'technical', label: 'Technical Only' },
  { value: 'behavioral', label: 'Behavioral Only' }
]

const MODE_OPTIONS = [
  { value: 'text', label: 'Text Input' },
  { value: 'voice', label: 'Voice Input' }
]

function RouteComponent() {
  const navigate = useNavigate()
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [interviewType, setInterviewType] = useState('mix')
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [questions, setQuestions] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigateToSession = (response: any) => {
    navigate({
      to: '/interview/session',
      state: response as never,
    })
  }

  const getMockResponse = async () => {
    await mockDelay(500)
    return getMockStartInterviewResponse(questions, interviewType, level, mode)
  }

  const getProductionResponse = async () => {
    const response = await startInterview({
      resume,
      jobDescription,
      level: level.toLowerCase() as Level,
      questionCount: questions,
      interviewType: interviewType as InterviewType,
    })

    return {
      sessionId: response.sessionId,
      firstQuestion: response.firstQuestion.question,
      totalQuestions: response.questionCount.total,
      analysis: response.analysis,
      interviewType: interviewType,
      level: level,
      mode: mode,
    }
  }

  const handleStartInterview = async () => {
    setIsLoading(true)
    setError('')

    try {
      let response

      if (TEST) {
        // MOCK MODE - for styling/development
        response = await getMockResponse()
      } else {
        try {
          response = await getProductionResponse()
        } catch (apiError) {
          console.warn('API failed, falling back to mock mode:', apiError)
          response = await getMockResponse()
        }
      }

      navigateToSession(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleStartInterview()
        }}
        className="w-full p-6 text-white"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Interview</h1>
          <p className="text-custom-light">Practice with AI</p>
        </div>

        <div className="space-y-4">

          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <FormTextarea
              id="resume"
              label="Resume"
              value={resume}
              onChange={setResume}
              placeholder="Paste your resume here..."
            />
            <FormTextarea
              id="jobDescription"
              label="Job Description"
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the job description here..."
            />
          </div>

          <FormSelect
            id="level"
            label="Level"
            value={level}
            onChange={setLevel}
            options={LEVEL_OPTIONS}
          />

          <FormSelect
            id="interviewType"
            label="Interview Type"
            value={interviewType}
            onChange={setInterviewType}
            options={INTERVIEW_TYPE_OPTIONS}
          />

          <FormSelect
            id="mode"
            label="Interview Mode"
            value={mode}
            onChange={(val) => setMode(val as 'text' | 'voice')}
            options={MODE_OPTIONS}
          />

          <FormNumberInput
            id="questions"
            label="Questions"
            value={questions}
            onChange={setQuestions}
            min={1}
            max={10}
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <FormButton
            text="Start Interview"
            loadingText="Starting..."
            isLoading={isLoading}
            type="submit"
          />
        </div>
      </form>
    </div>
  )
}
