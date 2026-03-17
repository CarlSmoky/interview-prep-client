import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { startInterview, type Level, type InterviewType } from '../../lib/api/interview'

export const Route = createFileRoute('/interview/')({
  component: RouteComponent,
})

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

  const handleStartInterview = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Clear any previous interview data
      sessionStorage.removeItem('questionResults')
      sessionStorage.removeItem('completedSessionId')

      const response = await startInterview({
        resume,
        jobDescription,
        level: level.toLowerCase() as Level,
        questionCount: questions,
        interviewType: interviewType as InterviewType,
      })

      sessionStorage.setItem('interviewSession', JSON.stringify({
        sessionId: response.sessionId,
        firstQuestion: response.firstQuestion.question,
        totalQuestions: response.questionCount.total,
        analysis: response.analysis,
        interviewType: interviewType,
        level: level,
        mode: mode,
      }))

      navigate({ to: '/interview/session' })
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
            <div className="w-full lg:w-1/2">
              <label htmlFor="resume" className="block mb-2 text-sm">Resume</label>
              <textarea
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full h-40 lg:h-100 bg-custom-light border border-white rounded px-3 py-2 text-custom-dark resize-y focus:outline-none focus:ring-2 focus:ring-custom-accent"
                placeholder="Paste your resume here..."
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label htmlFor="jobDescription" className="block mb-2 text-sm">Job Description</label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 lg:h-100 bg-custom-light border border-white rounded px-3 py-2 text-custom-dark resize-y focus:outline-none focus:ring-2 focus:ring-custom-accent"
                placeholder="Paste the job description here..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="level" className="block mb-2 text-sm">Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-custom-secondary-dark text-white border border-white rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-accent"
            >
              <option value="Junior">Junior</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="interviewType" className="block mb-2 text-sm">Interview Type</label>
            <select
              id="interviewType"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full bg-custom-secondary-dark text-white border border-white rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-accent"
            >
              <option value="mix">Mix (Technical & Behavioral)</option>
              <option value="technical">Technical Only</option>
              <option value="behavioral">Behavioral Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="mode" className="block mb-2 text-sm">Interview Mode</label>
            <select
              id="mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'text' | 'voice')}
              className="w-full bg-custom-secondary-dark text-white border border-white rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-accent"
            >
              <option value="text">Text Input</option>
              <option value="voice">Voice Input (Vapi.ai)</option>
            </select>
          </div>

          <div>
            <label htmlFor="questions" className="block mb-2 text-sm">Questions</label>
            <input
              id="questions"
              type="number"
              value={questions}
              onChange={(e) => setQuestions(parseInt(e.target.value) || 0)}
              min="1"
              max="20"
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-custom-accent"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-custom-secondary-accent text-black rounded py-2 px-4 font-medium hover:bg-custom-secondary-accent/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-custom-accent"
          >
            {isLoading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </form>
    </div>
  )
}
