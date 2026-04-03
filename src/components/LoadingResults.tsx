import RobotLoader from "./RobotLoader"

const LoadingResults = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <RobotLoader message="Loading results..." />
    </div>
  )
}

export default LoadingResults