export interface QuestionResult {
  question: string;
  answer: string;
  evaluation: {
    technicalAccuracy: number;
    depth: number;
    clarity: number;
    seniorityAlignment?: number;
    overallScore: number;
    feedback: string;
    improvementSuggestions?: string[];
    sampleAnswer?: string;
  };
}

export interface SessionData {
  sessionId: string;
  firstQuestion: string;
  totalQuestions: number;
  interviewType?: string;
  level?: string;
  mode?: "text" | "voice";
  resume?: string;
  jobDescription?: string;
  companyName?: string;
  jobTitle?: string;
  preGeneratedQuestions?: string[];
  analysis?: {
    matchScore: number;
    strengths: string[];
    missingSkills: string[];
    improvementSuggestions: string[];
  };
}

export interface InterviewMetadata {
  interviewType?: string;
  level?: string;
  totalQuestions?: number;
  resume?: string;
  jobDescription?: string;
  companyName?: string;
  jobTitle?: string;
}
