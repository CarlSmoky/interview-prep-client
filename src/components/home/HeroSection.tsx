import { Link } from '@tanstack/react-router'
import robotSvg from '../../assets/robot.svg'
import BenefitsList from './BenefitsList'

const HeroSection = () => (
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
          <span className="bg-linear-to-r from-custom-accent to-custom-secondary-accent bg-clip-text text-transparent">
            Interview Coach
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 text-custom-light/70 font-body font-light mb-10">
          Prepare for any interview with personalized practice sessions and expert feedback tailored to your experience.
        </p>

        <BenefitsList />

        {/* CTA Links */}
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
)

export default HeroSection