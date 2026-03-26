import { Link } from '@tanstack/react-router'
import { FileText, Mic, ThumbsUp, CheckCircle } from 'lucide-react';
import robotSvg from '../../assets/robot.svg';

interface Step {
  title: string
  description: string
  icon: JSX.Element
  number: number
}

const benefits: string[] = [
  'Speak naturally - just like a real interview',
  'Real-time AI feedback on your answers',
  'Personalized questions based on your resume',
  'Download sample Q&A for offline prep',
];

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

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center w-full px-4 py-14">
        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-6">
          {/* Robot Illustration */}
          <div className="flex-1 flex items-center justify-center max-w-md lg:max-w-lg">
            <img src={robotSvg} alt="AI Interview Coach Robot" className="w-full h-auto drop-shadow-2xl" />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-white font-body text-sm md:text-base tracking-widest uppercase mb-4">
              AI-Powered Interview Preparation
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Your Personal AI{' '}
              <span className="bg-gradient-to-r from-custom-accent to-custom-secondary-accent bg-clip-text text-transparent">
                Interview Coach
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 text-custom-light/70 font-body font-light mb-10">
              Prepare for any interview with personalized practice sessions and expert feedback tailored to your experience.
            </p>

            <ul className="flex flex-col sm:flex-row lg:flex-col flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm md:text-base text-custom-light/80">
                  <CheckCircle size={16} className="text-custom-accent shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/interview"
                className="h-14 w-64 bg-white text-black rounded-full flex items-center justify-center font-semibold text-lg hover:bg-white/80 transition-colors"
              >
                Get Started
              </Link>
              <a
                href="#how-it-works"
                className="h-14 w-64 border border-white/20 text-white rounded-full flex items-center justify-center font-medium hover:bg-white/5 transition-colors"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="text-white w-full max-w-6xl mx-auto px-6 py-20">
        <p className="text-center text-white font-body text-sm tracking-widest uppercase mb-3">
          Simple 3-Step Process
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-heading font-bold mb-12">
          Let's Get You Ready
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-8 rounded-xl bg-white/5 border border-white/10 hover:border-custom-accent/30 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-custom-accent/10 border border-custom-accent/30 flex items-center justify-center text-white group-hover:bg-custom-accent/20 transition-colors">
                  {step.icon}
                </div>
                <span className="text-xs font-body tracking-widest uppercase text-custom-light/40">
                  Step {step.number}
                </span>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
              <p className="text-base text-custom-light/60 font-body font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home