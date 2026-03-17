import { Bot } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <section className=" text-white">
        <div className="flex border border-white rounded-lg p-6 gap-6 max-w-3xl">
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
    </div>
  )
}

export default Home