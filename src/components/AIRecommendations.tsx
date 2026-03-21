interface AIRecommendationsProps {
  recommendations: string[]
}

const AIRecommendations = ({ recommendations }: AIRecommendationsProps) => {
  if (recommendations.length === 0) return null

  return (
    <div className="border border-white rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">📋 Recommendations</h2>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-gray-300">
            {index + 1}. {rec}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AIRecommendations