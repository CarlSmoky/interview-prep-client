import type { SubmitAnswerResponse } from "../api/interview";

export const mockQuestions = [
  "Tell me about a challenging project you worked on and how you approached it.",
  "What is the difference between Promise.all() and Promise.race()?",
  "Describe a time when you had to handle a difficult team conflict.",
  "How would you optimize a slow database query?",
  "What are your career goals for the next 2-3 years?",
  "Explain the concept of closures in JavaScript.",
  "How do you handle code reviews and feedback?",
  "What is your experience with testing and test-driven development?",
];

export function getMockStartInterviewResponse(
  questionCount: number,
  interviewType: string,
  level: string,
  mode: "text" | "voice",
): {
  sessionId: string;
  firstQuestion: string;
  totalQuestions: number;
  analysis: {
    matchScore: number;
    strengths: string[];
    missingSkills: string[];
    improvementSuggestions: string[];
  };
  interviewType: string;
  level: string;
  mode: "text" | "voice";
} {
  return {
    sessionId: "mock-session-" + Date.now(),
    firstQuestion: mockQuestions[0],
    totalQuestions: questionCount,
    analysis: {
      matchScore: 85,
      strengths: [
        "Strong technical background",
        "Good communication skills",
        "Problem-solving abilities",
      ],
      missingSkills: ["AWS experience", "Kubernetes", "GraphQL"],
      improvementSuggestions: [
        "Learn cloud deployment",
        "Practice system design",
        "Study distributed systems",
      ],
    },
    interviewType,
    level,
    mode,
  };
}

export function getMockSubmitAnswerResponse(
  currentQuestionIndex: number,
  totalQuestions: number,
): SubmitAnswerResponse {
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return {
    success: true,
    evaluation: {
      technicalAccuracy: Math.floor(Math.random() * 20) + 80,
      depth: Math.floor(Math.random() * 20) + 75,
      clarity: Math.floor(Math.random() * 20) + 85,
      seniorityAlignment: Math.floor(Math.random() * 20) + 78,
      overallScore: Math.floor(Math.random() * 20) + 80,
      feedback:
        "Great answer! You demonstrated solid understanding of the concepts.",
      improvementSuggestions: [
        "Consider adding more examples",
        "Explain edge cases in more detail",
      ],
    },
    nextQuestion: !isLastQuestion
      ? {
          question:
            mockQuestions[(currentQuestionIndex + 1) % mockQuestions.length],
          focusArea: "Technical",
          expectedTopics: ["JavaScript", "Async"],
          type: "technical",
        }
      : null,
    done: isLastQuestion,
    progress: {
      current: currentQuestionIndex + 2,
      total: totalQuestions,
    },
  };
}

export async function mockDelay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
