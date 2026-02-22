type Interview = {
  id: string;
  userId: string;
  role: string;
  type: "Technical" | "Behavioral";
  techstack: string[];
  level: "Junior" | "Mid" | "Senior";
  questions: string[];
  finalized: boolean;
  createdAt: string;
};

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: [
      "What is React?",
      "What is the virtual DOM?",
      "What is the difference between props and state?",
      "Explain useEffect and its dependency array.",
    ],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Technical",
    techstack: ["Node.js", "Express", "PostgreSQL", "Prisma"],
    level: "Mid",
    questions: [
      "Explain RESTful API design principles.",
      "What is middleware in Express?",
      "How does database indexing improve performance?",
      "What is ACID in databases?",
    ],
    finalized: true,
    createdAt: "2024-04-10T14:30:00Z",
  },
  {
    id: "3",
    userId: "user2",
    role: "Frontend Developer",
    type: "Behavioral",
    techstack: ["React", "TypeScript"],
    level: "Junior",
    questions: [
      "Tell me about a time you faced a tight deadline.",
      "How do you handle feedback on your code?",
      "Describe a challenging bug you fixed.",
    ],
    finalized: false,
    createdAt: "2024-05-02T09:15:00Z",
  },
  {
    id: "4",
    userId: "user3",
    role: "Senior Frontend Engineer",
    type: "Technical",
    techstack: ["React", "TypeScript", "GraphQL", "Redux"],
    level: "Senior",
    questions: [
      "How does React reconciliation work?",
      "When would you use Redux over Context API?",
      "Explain performance optimization techniques in React.",
      "How do you structure large-scale frontend applications?",
    ],
    finalized: true,
    createdAt: "2024-06-01T16:45:00Z",
  },
];
