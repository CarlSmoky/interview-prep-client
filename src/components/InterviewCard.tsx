import React from 'react'
import { getTechLogos } from '../lib/utils/getTechLogos';

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  level,
  questions,
}) => {
  const techLogos = getTechLogos(techstack);
  return (
    <li className="border border-white rounded-lg w-100">
      <p>{role} Interview</p>
      <p>{level}</p>
      <p>{type}</p>
      <div className="flex gap-2 mt-2">
        {techLogos.map(({ tech, url }) => (
          <img
            key={tech}
            src={url}
            alt={tech}
            title={tech}
            className="w-6 h-6"
          />
        ))}
      </div>
    </li>
  )
}

export default InterviewCard