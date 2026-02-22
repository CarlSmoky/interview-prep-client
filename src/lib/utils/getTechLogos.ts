const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const mappings: Record<string, string> = {
  "next.js": "nextjs",
  "node.js": "nodejs",
  "express.js": "express",
  "tailwind css": "tailwindcss",
  "c#": "csharp",
  "c++": "cplusplus",
};

const normalizeTechName = (tech: string): string => {
  const lowerTech = tech.toLowerCase();

  // Check mappings first BEFORE removing .js
  if (mappings[lowerTech]) {
    return mappings[lowerTech];
  }

  // Fallback: clean up the name
  return lowerTech.replace(/\.js$/, "").replace(/\s+/g, "");
};

export const getTechLogos = (techArray: string[]) => {
  return techArray.map((tech) => {
    const normalized = normalizeTechName(tech);

    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });
};
