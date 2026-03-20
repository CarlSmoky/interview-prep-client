const API_BASE_URL = "http://localhost:3000";

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

export async function startInterview(
  data: StartInterviewRequest,
): Promise<StartInterviewResponse> {
  const response = await fetch(`${API_BASE_URL}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || result.details || "Failed to start interview",
    );
  }

  return result;
}

export async function submitAnswer(
  data: SubmitAnswerRequest,
): Promise<SubmitAnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/interview/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to submit answer" }));
    throw new Error(error.error || "Failed to submit answer");
  }

  return response.json();
}

export async function finishInterview(
  data: FinishInterviewRequest,
): Promise<FinishInterviewResponse> {
  const response = await fetch(`${API_BASE_URL}/interview/finish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to finish interview" }));
    throw new Error(error.error || "Failed to finish interview");
  }

  return response.json();
}
