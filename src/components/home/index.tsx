import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <HeroSection />
      <HowItWorksSection />
    </div>
  )
}

export default Home