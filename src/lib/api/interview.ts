import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export type Level = "junior" | "intermediate" | "senior";
export type InterviewType = "technical" | "behavioral" | "mix";

export interface StartInterviewRequest {
  resume: string;
  jobDescription: string;
  level: Level;
  questionCount: number;
  interviewType?: InterviewType;
}

export interface Question {
  question: string;
  focusArea: string;
  expectedTopics: string[];
  type: string;
}

export interface Analysis {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
}

export interface StartInterviewResponse {
  success: boolean;
  provider?: string;
  sessionId: string;
  analysis: Analysis;
  firstQuestion: Question;
  questionCount: {
    total: number;
    technical: number;
    behavioral: number;
    systemDesign: number;
  };
  error?: string;
  details?: string;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  answer: string;
}

export interface Evaluation {
  technicalAccuracy: number;
  depth: number;
  clarity: number;
  seniorityAlignment?: number;
  overallScore: number;
  feedback: string;
  improvementSuggestions?: string[];
  sampleAnswer?: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  evaluation: Evaluation;
  nextQuestion: Question | null;
  done: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

export interface FinishInterviewRequest {
  sessionId: string;
}

export interface DetailedScore {
  question: string;
  score: number;
}

export interface FinalReport {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailedScores: DetailedScore[];
}

export interface FinishInterviewResponse {
  finalReport: FinalReport;
}

const apiRequest = async (url: string, body: object): Promise<Response> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
};

export const startInterview = async (
  data: StartInterviewRequest,
): Promise<StartInterviewResponse> => {
  const response = await apiRequest(`${API_BASE_URL}/interview/start`, data);

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || result.details || "Failed to start interview",
    );
  }

  return result;
};

export const submitAnswer = async (
  data: SubmitAnswerRequest,
): Promise<SubmitAnswerResponse> => {
  const response = await apiRequest(`${API_BASE_URL}/interview/answer`, data);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to submit answer" }));
    throw new Error(error.error || "Failed to submit answer");
  }

  return response.json();
};

export const finishInterview = async (
  data: FinishInterviewRequest,
): Promise<FinishInterviewResponse> => {
  const response = await apiRequest(`${API_BASE_URL}/interview/finish`, data);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to finish interview" }));
    throw new Error(error.error || "Failed to finish interview");
  }

  return response.json();
};

export interface QuestionWithAnswer {
  question: string;
  focusArea: string;
  expectedTopics: string[];
  sampleAnswer: string;
  type: string;
}

export interface GenerateQuestionsRequest {
  resume: string;
  jobDescription: string;
  level: Level;
  questionCount: number;
  interviewType?: InterviewType;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  questions: QuestionWithAnswer[];
  analysis: Analysis;
  error?: string;
  details?: string;
}

export async function generateQuestions(
  data: GenerateQuestionsRequest,
): Promise<GenerateQuestionsResponse> {
  const response = await apiRequest(
    `${API_BASE_URL}/interview/generate-questions`,
    data,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || result.details || "Failed to generate questions",
    );
  }

  return result;
}
