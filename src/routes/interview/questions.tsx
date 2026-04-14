import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Download, ArrowLeft, CheckCircle, AlertTriangle, Target, BookOpen, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { generateQuestions, startInterview, type QuestionWithAnswer, type Analysis, type Level, type InterviewType } from '../../lib/api/interview'
import { getMockStartInterviewResponse, mockDelay } from '../../lib/mock/interviewMock'
import ModeSelectionModal from '../../components/ModeSelectionModal'
import jsPDF from 'jspdf'
import { requireAuth } from '../../lib/auth/config'

export const Route = createFileRoute('/interview/questions')({
  beforeLoad: () => requireAuth(),
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
  const [data, setData] = useState<QuestionsState | null>(() => {
    return (location.state as unknown as QuestionsState) || null
  })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showAllAnswers, setShowAllAnswers] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showModeModal, setShowModeModal] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const TEST = import.meta.env.VITE_TEST_MODE === 'true'

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

  const toggleAllAnswers = () => {
    if (showAllAnswers) {
      setShowAllAnswers(false)
      setExpandedIndex(null)
    } else {
      setShowAllAnswers(true)
      setExpandedIndex(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-custom-red'
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-custom-red'
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    let yPosition = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - margin * 2

    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Interview Preparation Guide', margin, yPosition)
    yPosition += 15

    // Metadata
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition)
    yPosition += 7
    if (companyName) {
      doc.text(`Company: ${companyName}`, margin, yPosition)
      yPosition += 7
    }
    if (jobTitle) {
      doc.text(`Position: ${jobTitle}`, margin, yPosition)
      yPosition += 7
    }
    doc.text(`Level: ${level}`, margin, yPosition)
    yPosition += 7
    doc.text(`Interview Type: ${interviewType}`, margin, yPosition)
    yPosition += 7
    doc.text(`Total Questions: ${questions.length}`, margin, yPosition)
    yPosition += 12

    // Analysis section
    if (analysis) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Resume Analysis', margin, yPosition)
      yPosition += 8
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Match Score: ${analysis.matchScore}%`, margin, yPosition)
      yPosition += 10

      if (analysis.strengths?.length > 0) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Strengths:', margin, yPosition)
        yPosition += 7
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        analysis.strengths.forEach((s) => {
          const lines = doc.splitTextToSize(`• ${s}`, maxWidth - 5)
          lines.forEach((line: string) => {
            if (yPosition > 270) { doc.addPage(); yPosition = 20 }
            doc.text(line, margin + 5, yPosition)
            yPosition += 6
          })
        })
        yPosition += 4
      }

      if (analysis.missingSkills?.length > 0) {
        if (yPosition > 250) { doc.addPage(); yPosition = 20 }
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Areas to Prepare:', margin, yPosition)
        yPosition += 7
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        analysis.missingSkills.forEach((s) => {
          const lines = doc.splitTextToSize(`• ${s}`, maxWidth - 5)
          lines.forEach((line: string) => {
            if (yPosition > 270) { doc.addPage(); yPosition = 20 }
            doc.text(line, margin + 5, yPosition)
            yPosition += 6
          })
        })
        yPosition += 4
      }

      yPosition += 6
    }

    // Questions & Answers
    if (yPosition > 240) { doc.addPage(); yPosition = 20 }
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Interview Questions & Sample Answers', margin, yPosition)
    yPosition += 12

    questions.forEach((q, index) => {
      if (yPosition > 240) { doc.addPage(); yPosition = 20 }

      // Question
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Question ${index + 1}:`, margin, yPosition)
      yPosition += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const questionLines = doc.splitTextToSize(q.question, maxWidth)
      questionLines.forEach((line: string) => {
        if (yPosition > 270) { doc.addPage(); yPosition = 20 }
        doc.text(line, margin, yPosition)
        yPosition += 6
      })
      yPosition += 3

      // Type & Focus Area
      doc.setFontSize(9)
      doc.text(`Type: ${q.type}  |  Focus Area: ${q.focusArea}`, margin, yPosition)
      yPosition += 8

      // Sample Answer
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Sample Answer:', margin, yPosition)
      yPosition += 6
      doc.setFont('helvetica', 'normal')
      const answerLines = doc.splitTextToSize(q.sampleAnswer, maxWidth)
      answerLines.forEach((line: string) => {
        if (yPosition > 270) { doc.addPage(); yPosition = 20 }
        doc.text(line, margin, yPosition)
        yPosition += 6
      })
      yPosition += 10
    })

    const namePart = [companyName, jobTitle].filter(Boolean).join('-') || 'guide'
    doc.save(`interview-prep-${namePart}-${Date.now()}.pdf`)
  }

  const isExpanded = (index: number) => showAllAnswers || expandedIndex === index

  const startWithMode = async (mode: 'text' | 'voice') => {
    if (!data) return
    setShowModeModal(false)
    setIsStarting(true)
    try {
      const preGenQuestions = data.questions.map(q => q.question)
      let sessionResponse

      if (TEST) {
        await mockDelay(500)
        sessionResponse = getMockStartInterviewResponse(data.questions.length, data.interviewType, data.level, mode)
      } else {
        try {
          const apiResponse = await startInterview({
            resume: data.resume,
            jobDescription: data.jobDescription,
            level: data.level.toLowerCase() as Level,
            questionCount: data.questions.length,
            interviewType: data.interviewType as InterviewType,
          })
          sessionResponse = {
            sessionId: apiResponse.sessionId,
            totalQuestions: apiResponse.questionCount.total,
            analysis: apiResponse.analysis,
            interviewType: data.interviewType,
            level: data.level,
            mode,
          }
        } catch (apiError) {
          console.warn('API failed, falling back to mock mode:', apiError)
          await mockDelay(500)
          sessionResponse = getMockStartInterviewResponse(data.questions.length, data.interviewType, data.level, mode)
        }
      }

      navigate({
        to: '/interview/session',
        state: {
          ...sessionResponse,
          firstQuestion: preGenQuestions[0],
          totalQuestions: preGenQuestions.length,
          preGeneratedQuestions: preGenQuestions,
          resume: data.resume,
          jobDescription: data.jobDescription,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
        } as never,
      })
      window.scrollTo({ top: 0 })
    } catch (err) {
      console.error('Failed to start interview:', err)
    } finally {
      setIsStarting(false)
    }
  }

  const handleRegenerate = async () => {
    if (!data || isRegenerating) return
    setIsRegenerating(true)
    try {
      const response = await generateQuestions({
        resume: data.resume,
        jobDescription: data.jobDescription,
        level: data.level.toLowerCase() as Level,
        questionCount: data.questions.length,
        interviewType: data.interviewType as InterviewType,
      })
      setData({
        ...data,
        questions: response.questions,
        analysis: response.analysis,
      })
      setExpandedIndex(null)
      setShowAllAnswers(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Failed to regenerate questions:', err)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate({ to: '/interview' })}
            className="flex items-center gap-2 text-custom-light/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Setup</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-white font-body text-xs tracking-widest uppercase mb-2">
                Interview Preparation Guide
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                {companyName && jobTitle
                  ? <>
                    <span className="block">{jobTitle}</span>
                    <span className="block text-lg md:text-xl text-custom-light/40 font-light mt-1">at {companyName}</span>
                  </>
                  : 'Your Interview Questions'
                }
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white border border-white/10">
                  {level}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white border border-white/10">
                  {interviewType}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white border border-white/10">
                  {questions.length} Questions
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        {analysis && (
          <div className="mb-10 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Target size={20} className="text-white" />
              <h2 className="text-lg font-heading font-semibold">Resume Analysis</h2>
            </div>

            {/* Score */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-3">
                <span className="text-sm text-custom-light/60">Match Score</span>
                <span className={`text-3xl font-heading font-bold ${getScoreColor(analysis.matchScore)}`}>
                  {analysis.matchScore}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`${getScoreBarColor(analysis.matchScore)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${analysis.matchScore}%` }}
                />
              </div>
            </div>

            {/* Strengths & Gaps side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                  <h3 className="font-semibold mb-3 text-green-400 flex items-center gap-2 text-sm">
                    <CheckCircle size={16} />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-custom-light/70 flex items-start gap-2">
                        <span className="text-green-500/50 mt-0.5">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                  <h3 className="font-semibold mb-3 text-yellow-400 flex items-center gap-2 text-sm">
                    <AlertTriangle size={16} />
                    Areas to Prepare
                  </h3>
                  <ul className="space-y-2">
                    {analysis.missingSkills.map((skill, idx) => (
                      <li key={idx} className="text-sm text-custom-light/70 flex items-start gap-2">
                        <span className="text-yellow-500/50 mt-0.5">•</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-white" />
              <h2 className="text-lg font-heading font-semibold">Questions & Sample Answers</h2>
            </div>
            <button
              onClick={toggleAllAnswers}
              className="flex items-center gap-2 text-sm text-custom-light/50 hover:text-white transition-colors"
            >
              {showAllAnswers ? <EyeOff size={16} /> : <Eye size={16} />}
              {showAllAnswers ? 'Hide All' : 'Show All'}
            </button>
          </div>

          {questions.map((question, index) => (
            <div
              key={index}
              className={`rounded-xl border overflow-hidden transition-colors ${isExpanded(index)
                ? 'bg-white/5 border-white/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
            >
              <button
                onClick={() => {
                  if (showAllAnswers) return
                  toggleExpand(index)
                }}
                className={`w-full p-5 text-left flex justify-between items-start gap-4 transition-colors ${showAllAnswers ? 'cursor-default' : 'cursor-pointer'
                  }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <span className="shrink-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold leading-snug">{question.question}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-custom-light/60">
                        {question.type}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-custom-light/60">
                        {question.focusArea}
                      </span>
                    </div>
                  </div>
                </div>

                {!showAllAnswers && (
                  <div className="shrink-0 mt-1 text-custom-light/30">
                    {expandedIndex === index ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                )}
              </button>

              {isExpanded(index) && (
                <div className="px-5 pb-5">
                  <div className="ml-12 pl-4 border-l-2 border-white/20">
                    <p className="text-[11px] tracking-widest uppercase text-custom-light/40 mb-2">
                      Sample Answer
                    </p>
                    <p className="text-custom-light/80 whitespace-pre-line leading-relaxed text-sm">
                      {question.sampleAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating || isStarting}
            className="flex items-center justify-center gap-2 px-8 py-3 border border-white/10 text-white rounded-full hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'Generating...' : 'Regenerate Questions'}
          </button>
          <button
            onClick={() => setShowModeModal(true)}
            disabled={isStarting || isRegenerating}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-custom-dark rounded-full hover:bg-white/80 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? 'Starting...' : 'Start Interview'}
          </button>
          <button
            onClick={() => {
              navigate({ to: '/' })
              window.scrollTo({ top: 0 })
            }}
            className="flex items-center justify-center gap-2 px-8 py-3 border border-white/10 text-white rounded-full hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Home
          </button>
        </div>

        {/* Mode Selection Modal */}
        {showModeModal && (
          <ModeSelectionModal
            onSelectMode={startWithMode}
            onClose={() => setShowModeModal(false)}
          />
        )}
      </div>
    </div>
  )
}
