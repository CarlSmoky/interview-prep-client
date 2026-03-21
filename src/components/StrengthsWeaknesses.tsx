interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

const StrengthsWeaknesses = ({ strengths, weaknesses }: StrengthsWeaknessesProps) => {
  if (strengths.length === 0 && weaknesses.length === 0) return null

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {strengths.length > 0 && (
        <div>
          <h3 className="font-semibold text-green-400 mb-2">✓ Strengths</h3>
          <ul className="space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-300">• {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {weaknesses.length > 0 && (
        <div>
          <h3 className="font-semibold text-custom-red mb-2">✗ Areas for Improvement</h3>
          <ul className="space-y-1">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm text-gray-300">• {weakness}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default StrengthsWeaknesses