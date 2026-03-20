import { FileText, Mic, ThumbsUp } from 'lucide-react';

const benefits = [
  'Speak naturally - just like a real interview',
  'Real-time AI feedback on your answers',
  'Personalized questions based on your resume',
];

const steps = [
  {
    title: 'Upload Resume & Job Description',
    description: 'Provide your resume and the job description to tailor the interview experience to your background and the role you are targeting.',
    icon: <FileText size={48} />,
  },
  {
    title: 'Practice with AI Interviewer',
    description: 'Engage in a realistic mock interview with an AI interviewer that asks questions based on your resume and the job description.',
    icon: <Mic size={48} />,
  },
  {
    title: 'Receive Detailed Feedback',
    description: 'Get comprehensive feedback on your performance, including strengths, areas for improvement, and actionable suggestions to ace your real interview.',
    icon: <ThumbsUp size={48} />,
  },
]

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <section className=" h-screen flex items-center justify-center">
        <div className="flex">
          <div className="flex flex-col justify-center items-center gap-4 text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-center font-heading font-medium">Your Personal AI Interview Coach</h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl text-center font-body font-thin">Prepare for any interview with personalized practice sessions and expert feedback tailored to your experience.</p>
            <ul className="mt-4 space-y-2 text-base lg:text-lg">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-white">•</span> {benefit}
                </li>
              ))}
            </ul>

            <a href="/interview" className="mt-4 h-16 w-64 bg-white text-black rounded-full flex items-center justify-center">Get Started</a>
          </div>


        </div>
      </section>
      <section className="text-white">
        <h2 className="text-center text-3xl font-heading font-medium">Let's Get You Ready</h2>
        <div className="flex flex-col lg:flex-row p-6 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col justify-center items-center gap-4 mb-6 border border-white rounded-lg p-6 w-full lg:w-1/3">
              <div className="flex justify-center items-center w-20 h-20  rounded-full ">
                <span className="text-white">{step.icon}</span>
              </div>
              <div className="flex flex-col justify-center  items-center gap-2 text-center">
                <h3 className="text-2xl font-heading font-semibold">{step.title}</h3>
                <p className="text-base max-w-3xl font-body font-light">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home