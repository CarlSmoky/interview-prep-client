import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { startInterview, generateQuestions, type Level, type InterviewType } from '../../lib/api/interview'
import { getMockStartInterviewResponse, mockDelay } from '../../lib/mock/interviewMock'
import FormTextarea from '../../components/FormTextarea'
import FormSelect from '../../components/FormSelect'
import FormNumberInput from '../../components/FormNumberInput'
import FormButton from '../../components/FormButton'
import FormInput from '../../components/FormInput'
import { extractTextFromPDF, readTextFile } from '../../lib/utils/fileReader'

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
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [interviewType, setInterviewType] = useState('mix')
  const [mode, setMode] = useState<'text' | 'voice'>('voice')
  const [questions, setQuestions] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [error, setError] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      console.log('Reading file:', file.name)
      let text: string

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        text = await extractTextFromPDF(arrayBuffer)
      } else {
        text = await readTextFile(file)
      }

      setResume(text)
    } catch (error) {
      console.error('Error reading file:', error)
      setError('Failed to read file. Please try again or paste the content manually.')
    } finally {
      // Reset file input
      event.target.value = ''
    }
  }

  const navigateToSession = (response: any) => {
    navigate({
      to: '/interview/session',
      state: response as never,
    })
  }

  const getMockResponse = async () => {
    await mockDelay(500)
    return {
      ...getMockStartInterviewResponse(questions, interviewType, level, mode),
      resume,
      jobDescription,
      companyName,
      jobTitle,
    }
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
      resume,
      jobDescription,
      companyName,
      jobTitle,
    }
  }

  const handleStartInterview = async () => {
    // Validate form
    const valid = resume.trim() !== '' && jobDescription.trim() !== '' && questions >= 1 && questions <= 10
    setIsFormValid(valid)

    if (!valid) {
      return
    }

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

  const handleViewQuestions = async () => {
    // Validate form
    const valid = resume.trim() !== '' && jobDescription.trim() !== '' && questions >= 1 && questions <= 10
    setIsFormValid(valid)

    if (!valid) {
      return
    }

    setIsGeneratingQuestions(true)
    setError('')

    try {
      const response = await generateQuestions({
        resume,
        jobDescription,
        level: level.toLowerCase() as Level,
        questionCount: questions,
        interviewType: interviewType as InterviewType,
      })

      navigate({
        to: '/interview/questions',
        state: {
          questions: response.questions,
          analysis: response.analysis,
          resume,
          jobDescription,
          companyName,
          jobTitle,
          level,
          interviewType,
        } as never,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions')
    } finally {
      setIsGeneratingQuestions(false)
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
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="resume" className="block text-sm">Resume *</label>
                <label className="cursor-pointer text-sm text-white hover:underline">
                  Upload File
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleResumeFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <FormTextarea
                id="resume"
                label=""
                value={resume}
                onChange={setResume}
                placeholder="Paste your resume here or upload a file..."
              />
            </div>
            <FormTextarea
              id="jobDescription"
              label="Job Description *"
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <FormInput
              id="companyName"
              label="Company Name"
              value={companyName}
              onChange={setCompanyName}
              placeholder="Input company name"
            />
            <FormInput
              id="jobTitle"
              label="Job Title"
              value={jobTitle}
              onChange={setJobTitle}
              placeholder="Input job title"
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

          {!isFormValid && (
            <div className="text-red-500 text-sm">
              Please provide Resume, Job Description.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <FormButton
              text="View Sample Questions"
              loadingText="Generating..."
              isLoading={isGeneratingQuestions}
              type="button"
              onClick={handleViewQuestions}
            />
            <FormButton
              text="Start Interview"
              loadingText="Starting..."
              isLoading={isLoading}
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
