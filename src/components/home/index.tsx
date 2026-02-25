import { Bot } from 'lucide-react';
import { dummyInterviews } from '../../data/mockInterviews';


const Home = () => {
  return (
    <div className="text-white">
      <section className="w-[1280px] mx-auto">
        <div className="flex border border-white rounded-lg w-100 h-40">
          <div className="flex justify-center items-center w-40">
            <Bot size={48} className="" />
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
            <p>something something</p>
            <a href="/interview" className="mt-4 px-4 py-2 bg-white text-black rounded-lg">Get Started</a>
          </div>
        </div>
      </section>
      <section className="w-[1280px] mx-auto">
        <h2>Take an Interview</h2>
        <div>
          {dummyInterviews.length === 0 ? (
            <p>There are no interviews available</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">

            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home