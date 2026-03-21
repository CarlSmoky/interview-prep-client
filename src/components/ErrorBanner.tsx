interface ErrorBannerProps {
  title?: string
  message?: string
}

const ErrorBanner = ({
  title = "AI Report Unavailable",
}: ErrorBannerProps) => {
  return (
    <div className=" rounded-lg p-4 mb-6">
      <p className="text-custom-red font-semibold mb-2">{title}</p>
    </div>
  )
}

export default ErrorBanner