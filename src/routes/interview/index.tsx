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
import { FileText, Briefcase, Settings } from 'lucide-react'
import ModeSelectionModal from '../../components/ModeSelectionModal'

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

function RouteComponent() {
  const navigate = useNavigate()
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [interviewType, setInterviewType] = useState('mix')
  const [questions, setQuestions] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [error, setError] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)
  const [showModeModal, setShowModeModal] = useState(false)

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

  const getMockResponse = async (mode: 'text' | 'voice') => {
    await mockDelay(500)
    return {
      ...getMockStartInterviewResponse(questions, interviewType, level, mode),
      resume,
      jobDescription,
      companyName,
      jobTitle,
    }
  }

  const getProductionResponse = async (mode: 'text' | 'voice') => {
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

  const handleStartInterview = () => {
    // Validate form
    const valid = resume.trim() !== '' && jobDescription.trim() !== '' && questions >= 1 && questions <= 10
    setIsFormValid(valid)

    if (!valid) {
      return
    }

    setShowModeModal(true)
  }

  const startWithMode = async (mode: 'text' | 'voice') => {
    setShowModeModal(false)
    setIsLoading(true)
    setError('')

    try {
      let response

      if (TEST) {
        response = await getMockResponse(mode)
      } else {
        try {
          response = await getProductionResponse(mode)
        } catch (apiError) {
          console.warn('API failed, falling back to mock mode:', apiError)
          response = await getMockResponse(mode)
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
      window.scrollTo({ top: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions')
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleStartInterview()
        }}
        className="w-full max-w-4xl text-white"
      >
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 bg-gradient-to-r from-white to-custom-accent bg-clip-text text-transparent">
            Ace Your Next Interview
          </h1>
          <p className="text-lg text-custom-light/70 font-body max-w-2xl">
            Get personalized interview questions tailored to your resume and job description.
            Practice with our AI interviewer or review sample answers to prepare effectively.
          </p>
        </div>

        <div className="space-y-6">

          {/* Section 1: Documents */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <FileText size={20} className="text-white" />
              Your Documents
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full">
                <FormTextarea
                  id="resume"
                  label="Resume *"
                  value={resume}
                  onChange={setResume}
                  placeholder="Paste your resume here or upload a file..."
                />
                <label className="cursor-pointer text-sm text-white underline underline-offset-4 hover:text-white/50">
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
                id="jobDescription"
                label="Job Description *"
                value={jobDescription}
                onChange={setJobDescription}
                placeholder="Paste the job description here..."
              />
            </div>
          </div>

          {/* Section 2: Role Details */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Briefcase size={20} className="text-white" />
              Role Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                id="companyName"
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Company name"
              />
              <FormInput
                id="jobTitle"
                label="Job Title"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="Job title"
              />
            </div>
            <FormSelect
              id="level"
              label="Level"
              value={level}
              onChange={setLevel}
              options={LEVEL_OPTIONS}
            />
          </div>

          {/* Section 3: Interview Settings */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Settings size={20} className="text-white" />
              Interview Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                id="interviewType"
                label="Interview Type"
                value={interviewType}
                onChange={setInterviewType}
                options={INTERVIEW_TYPE_OPTIONS}
              />
              <FormNumberInput
                id="questions"
                label="Number of Questions"
                value={questions}
                onChange={setQuestions}
                min={1}
                max={10}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {!isFormValid && (
            <div className="text-red-500 text-sm">
              Please provide Resume, Job Description.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

      {/* Mode Selection Modal */}
      {showModeModal && (
        <ModeSelectionModal
          onSelectMode={startWithMode}
          onClose={() => setShowModeModal(false)}
        />
      )}
    </div>
  )
}
