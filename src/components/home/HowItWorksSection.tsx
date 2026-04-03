import { FileText, Mic, ThumbsUp } from 'lucide-react'
import StepCard from '../Stepcard'

interface Step {
  title: string
  description: string
  icon: JSX.Element
  number: number
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Upload Resume & Job Description',
    description: 'Provide your resume and the job description to tailor the interview experience to your background and the role you are targeting.',
    icon: <FileText size={28} />,
  },
  {
    number: 2,
    title: 'Practice with AI Interviewer',
    description: 'Engage in a realistic mock interview with an AI interviewer that asks questions based on your resume and the job description.',
    icon: <Mic size={28} />,
  },
  {
    number: 3,
    title: 'Receive Detailed Feedback',
    description: 'Get comprehensive feedback on your performance, including strengths, areas for improvement, and actionable suggestions to ace your real interview.',
    icon: <ThumbsUp size={28} />,
  },
]

const HowItWorksSection = () => (
  <section id="how-it-works" className="text-white w-full max-w-6xl mx-auto px-6 py-20">
    <p className="text-center text-white font-body text-sm tracking-widest uppercase mb-3">
      Simple 3-Step Process
    </p>
    <h2 className="text-center text-3xl md:text-4xl font-heading font-bold mb-12">
      Let's Get You Ready
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {steps.map((step) => (
        <StepCard key={step.number} step={step} />
      ))}
    </div>
  </section>
)

export default HowItWorksSection