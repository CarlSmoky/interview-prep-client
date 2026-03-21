interface QuestionEvaluation {
  overallScore: number;
}

interface QuestionResult {
  evaluation?: QuestionEvaluation;
}

interface Report {
  overallScore?: number;
}

export const calculateOverallScore = (
  results: QuestionResult[],
  report?: Report | null,
): number => {
  if (results.length > 0) {
    // Calculate from stored results
    const totalScore = results.reduce((sum, r) => {
      const score = Number(r.evaluation?.overallScore) || 0;
      return sum + score;
    }, 0);
    return Math.round(totalScore / results.length);
  } else if (report?.overallScore) {
    // Use AI report score
    return report.overallScore;
  }

  return 0;
};
