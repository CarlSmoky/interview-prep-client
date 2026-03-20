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

export const mockSampleAnswers: Record<string, string> = {
  "Tell me about a challenging project you worked on and how you approached it.":
    "In my previous role, I led the migration of a legacy monolithic application to microservices architecture. The system had over 500,000 lines of code and served 2 million daily users. I started by conducting a thorough analysis of the existing system to identify service boundaries based on domain-driven design principles. We then incrementally extracted services, starting with the least coupled modules. I implemented a strangler fig pattern to gradually route traffic to new services while maintaining the old system. We used Docker and Kubernetes for containerization and orchestration, and implemented comprehensive monitoring using Prometheus and Grafana. The project took 8 months and resulted in a 40% improvement in system performance and significantly better developer productivity.",

  "What is the difference between Promise.all() and Promise.race()?":
    "Promise.all() and Promise.race() are both used for handling multiple promises, but they behave differently. Promise.all() takes an array of promises and returns a single promise that resolves when ALL promises in the array have resolved, or rejects if ANY promise rejects. The resolved value is an array containing results in the same order as input promises. This is useful when you need all operations to complete, like fetching multiple API endpoints. Promise.race(), on the other hand, returns a promise that resolves or rejects as soon as ANY of the promises resolves or rejects. It's useful for timeout scenarios or when you want the fastest response from multiple sources. For example, you might use Promise.race() to implement a timeout by racing an API call against a timer promise.",

  "Describe a time when you had to handle a difficult team conflict.":
    "I once worked on a team where two senior engineers had fundamentally different views on our architecture approach - one preferred a microservices approach while the other wanted to stick with a modular monolith. The disagreement was creating tension and blocking progress. I organized a structured technical discussion where each person presented their approach with specific pros, cons, and data. I facilitated the conversation to keep it objective and focused on business outcomes rather than personal preferences. We evaluated both options against our specific constraints: team size, deployment frequency needs, and system complexity. After the discussion, we discovered that a hybrid approach would work best - starting with a well-structured monolith but keeping modules loosely coupled to allow future extraction if needed. Both engineers felt heard and we documented the decision rationale. This experience taught me the importance of data-driven decision making and creating safe spaces for technical disagreement.",

  "How would you optimize a slow database query?":
    "I would approach query optimization systematically. First, I'd use EXPLAIN or EXPLAIN ANALYZE to understand the query execution plan and identify bottlenecks like full table scans or missing indexes. I'd check if proper indexes exist on columns used in WHERE, JOIN, and ORDER BY clauses. If the query is complex, I'd consider breaking it into smaller parts or using Common Table Expressions (CTEs) for better readability and potentially better execution plans. I'd also examine if we're selecting unnecessary columns - using SELECT * when only a few columns are needed. For large datasets, I'd consider pagination instead of loading everything at once. If the query involves JOINs with large tables, I might denormalize data strategically or use materialized views for frequently accessed aggregations. I'd also check database statistics are up to date and consider query caching for frequently repeated queries. Finally, I'd monitor query performance over time to catch degradation early.",

  "What are your career goals for the next 2-3 years?":
    "In the next 2-3 years, I aim to transition into a technical leadership role where I can combine my technical expertise with mentoring and architectural decision-making. I want to deepen my knowledge in distributed systems and cloud architecture, particularly around designing highly scalable and resilient systems. I'm interested in leading projects that have significant business impact and involve cross-functional collaboration. I also plan to contribute more to the engineering community through technical writing, speaking at conferences, or open-source contributions. Long-term, I see myself as a technical leader who can bridge the gap between business needs and technical implementation, helping teams build better products while growing as engineers. I'm particularly excited about opportunities to work on challenging technical problems while developing my leadership and communication skills.",

  "Explain the concept of closures in JavaScript.":
    "A closure is a function that has access to variables from its outer (enclosing) lexical scope, even after the outer function has finished executing. When a function is created in JavaScript, it captures references to variables in its surrounding scope, forming a closure. This happens because JavaScript uses lexical scoping. For example, if a function returns another function, the inner function maintains access to the outer function's variables. This is powerful for data privacy - you can create private variables that can only be accessed through specific functions. Closures are commonly used in callbacks, event handlers, and module patterns. A practical example: a counter function that returns increment and getCount methods - these methods form closures over a count variable, allowing you to create private state. However, closures can lead to memory leaks if not careful, as the referenced variables won't be garbage collected as long as the closure exists.",

  "How do you handle code reviews and feedback?":
    "I approach code reviews as a collaborative learning opportunity rather than criticism. When receiving feedback, I try to understand the reviewer's perspective and ask clarifying questions if needed. I don't take comments personally and appreciate when reviewers point out potential issues or better approaches. When giving reviews, I focus on being constructive and specific - instead of saying 'this is bad', I explain why and suggest alternatives. I balance between nitpicky style comments and substantive concerns about logic, performance, or maintainability. I also look for positives to highlight good practices. I ensure my feedback aligns with team standards and only push back on subjective preferences if there's a good reason. For controversial points, I prefer discussing synchronously rather than lengthy comment threads. I also try to respond to reviews promptly and follow up to ensure I've addressed all concerns. Overall, I see code reviews as essential for maintaining code quality, sharing knowledge, and building team cohesion.",

  "What is your experience with testing and test-driven development?":
    "I have extensive experience with various testing approaches including unit tests, integration tests, and end-to-end tests. I've practiced TDD on several projects and find it particularly valuable for complex business logic - writing tests first helps clarify requirements and leads to better-designed, more testable code. I typically use frameworks like Jest for JavaScript/TypeScript, pytest for Python, and JUnit for Java. For unit tests, I focus on testing behavior rather than implementation details, using mocking sparingly and preferring dependency injection. I aim for meaningful test coverage rather than just hitting a percentage target. For integration tests, I test how components work together, and I use tools like Testcontainers for testing with real databases. I also believe in testing pyramid - more unit tests, fewer integration tests, and minimal E2E tests. I've set up CI/CD pipelines where tests run automatically on each commit. While TDD isn't always the right approach, strong testing practices are essential for maintaining code quality and enabling confident refactoring.",
};

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
  const currentQuestion =
    mockQuestions[currentQuestionIndex % mockQuestions.length];

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
      sampleAnswer:
        mockSampleAnswers[currentQuestion] ||
        "A strong answer would demonstrate clear understanding of the topic with specific examples from your experience.",
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
