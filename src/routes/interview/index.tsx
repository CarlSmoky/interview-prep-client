import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { startInterview, type Level } from '../../lib/api/interview'

export const Route = createFileRoute('/interview/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [level, setLevel] = useState('Intermediate')
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
      })

      sessionStorage.setItem('interviewSession', JSON.stringify({
        sessionId: response.sessionId,
        firstQuestion: response.firstQuestion.question,
        totalQuestions: response.questionCount.total,
        analysis: response.analysis,
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
        className="w-full max-w-md border border-white rounded-lg p-6 text-white"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Interview</h1>
          <p className="text-gray-400">Practice with AI</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="resume" className="block mb-2 text-sm">Resume</label>
            <textarea
              id="resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="w-full h-24 bg-transparent border border-white rounded px-3 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Paste your resume here..."
            />
          </div>



          <div>
            <label htmlFor="jobDescription" className="block mb-2 text-sm">Job Description</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-24 bg-transparent border border-white rounded px-3 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Paste the job description here..."
            />
          </div>

          <div>
            <label htmlFor="level" className="block mb-2 text-sm">Level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-gray-900 text-white border border-white rounded px-3 py-2 cursor-pointer"
            >
              <option value="Junior">Junior</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
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
              className="w-full bg-transparent border border-white rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black rounded py-2 px-4 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </form>
    </div>
  )
}
