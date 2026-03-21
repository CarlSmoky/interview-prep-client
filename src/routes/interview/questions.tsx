import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Download, ArrowLeft } from 'lucide-react'
import type { QuestionWithAnswer, Analysis } from '../../lib/api/interview'

export const Route = createFileRoute('/interview/questions')({
  component: RouteComponent,
})

interface QuestionsState {
  questions: QuestionWithAnswer[]
  analysis: Analysis
  resume: string
  jobDescription: string
  companyName: string
  jobTitle: string
  level: string
  interviewType: string
}

function RouteComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data] = useState<QuestionsState | null>(() => {
    return (location.state as unknown as QuestionsState) || null
  })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  useEffect(() => {
    if (!data) {
      console.warn('No questions data found, redirecting to interview setup')
      navigate({ to: '/interview' })
    }
  }, [data, navigate])

  if (!data) {
    return null
  }

  const { questions, analysis, companyName, jobTitle, level, interviewType } = data

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const handleDownload = () => {
    let content = `Interview Preparation Guide\n\n`

    if (companyName) {
      content += `Company: ${companyName}\n`
    }
    if (jobTitle) {
      content += `Position: ${jobTitle}\n`
    }
    content += `Level: ${level}\n`
    content += `Interview Type: ${interviewType}\n`
    content += `\n${'='.repeat(80)}\n\n`

    if (analysis) {
      content += `RESUME ANALYSIS\n\n`
      content += `Match Score: ${analysis.matchScore}%\n\n`

      if (analysis.strengths?.length > 0) {
        content += `Strengths:\n${analysis.strengths.map(s => `• ${s}`).join('\n')}\n\n`
      }

      if (analysis.missingSkills?.length > 0) {
        content += `Areas to Prepare:\n${analysis.missingSkills.map(s => `• ${s}`).join('\n')}\n\n`
      }

      content += `${'='.repeat(80)}\n\n`
    }

    content += `INTERVIEW QUESTIONS & SAMPLE ANSWERS\n\n`

    questions.forEach((q, index) => {
      content += `Question ${index + 1}: ${q.question}\n`
      content += `Type: ${q.type}\n`
      content += `Focus Area: ${q.focusArea}\n\n`
      content += `Sample Answer:\n${q.sampleAnswer}\n\n`
      content += `${'-'.repeat(80)}\n\n`
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-prep-${companyName || 'guide'}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate({ to: '/interview' })}
            className="flex items-center gap-2 text-white hover:text-gray-300 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Setup</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Interview Preparation Guide</h1>
              {companyName && jobTitle && (
                <p className="text-lg text-gray-300">
                  {jobTitle} at {companyName}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                {level} Level • {interviewType} Interview • {questions.length} Questions
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
              <span>Download Guide</span>
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        {analysis && (
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-xl font-bold mb-4">Resume Analysis</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Match Score</span>
                <span className="text-2xl font-bold">{analysis.matchScore}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
            </div>

            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-green-400">✓ Your Strengths</h3>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-300">• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.missingSkills && analysis.missingSkills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-yellow-400">⚠ Areas to Prepare</h3>
                <ul className="space-y-1">
                  {analysis.missingSkills.map((skill, idx) => (
                    <li key={idx} className="text-sm text-gray-300">• {skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Interview Questions & Sample Answers</h2>

          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-6 text-left flex justify-between items-start gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{question.question}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-white/10 rounded">
                          {question.type}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded">
                          {question.focusArea}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {expandedIndex === index ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
              </button>

              {expandedIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <div className="pl-11 border-l-2 border-white/20 ml-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Sample Answer:
                      </h4>
                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                        {question.sampleAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate({ to: '/interview' })}
            className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            Generate New Questions
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
