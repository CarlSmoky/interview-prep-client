import { CheckCircle } from 'lucide-react'

const benefits: string[] = [
  'Speak naturally - just like a real interview',
  'Real-time AI feedback on your answers',
  'Personalized questions based on your resume',
  'Download sample Q&A for offline prep',
]

const BenefitsList = () => (
  <ul className="flex flex-col sm:flex-row lg:flex-col flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 mb-10">
    {benefits.map((benefit, index) => (
      <li key={index} className="flex items-center gap-2 text-sm md:text-base text-custom-light/80">
        <CheckCircle size={16} className="text-custom-accent shrink-0" />
        {benefit}
      </li>
    ))}
  </ul>
)

export default BenefitsList