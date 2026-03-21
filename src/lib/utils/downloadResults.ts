import jsPDF from "jspdf";
import type { QuestionResult, InterviewMetadata } from "../../type/interview";

interface DownloadData {
  overallScore: number;
  metadata: InterviewMetadata;
  results: QuestionResult[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

export const downloadAsCSV = (data: DownloadData) => {
  const { overallScore, metadata, results } = data;

  // CSV Headers
  let csv =
    "Question Number,Question,Your Answer,Sample Answer,Technical Accuracy,Depth,Clarity,Seniority Alignment,Overall Score,Feedback\n";

  // Add each question result
  results.forEach((result, index) => {
    const row = [
      index + 1,
      `"${result.question.replace(/"/g, '""')}"`,
      `"${result.answer.replace(/"/g, '""')}"`,
      `"${result.evaluation.sampleAnswer?.replace(/"/g, '""') || "N/A"}"`,
      result.evaluation.technicalAccuracy,
      result.evaluation.depth,
      result.evaluation.clarity,
      result.evaluation.seniorityAlignment || "N/A",
      result.evaluation.overallScore,
      `"${result.evaluation.feedback.replace(/"/g, '""')}"`,
    ];
    csv += row.join(",") + "\n";
  });

  // Add summary section
  csv += `\nSummary\n`;
  csv += `Overall Score,${overallScore}%\n`;
  csv += `Level,${metadata.level || "N/A"}\n`;
  csv += `Interview Type,${metadata.interviewType || "N/A"}\n`;
  csv += `Total Questions,${results.length}\n`;
  if (metadata.companyName) {
    csv += `Company,${metadata.companyName}\n`;
  }
  if (metadata.jobTitle) {
    csv += `Job Title,${metadata.jobTitle}\n`;
  }

  // Add resume and job description if available
  if (metadata.resume) {
    csv += `\nResume\n`;
    csv += `"${metadata.resume.replace(/"/g, '""')}"\n`;
  }

  if (metadata.jobDescription) {
    csv += `\nJob Description\n`;
    csv += `"${metadata.jobDescription.replace(/"/g, '""')}"\n`;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `interview-results-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsPDF = (data: DownloadData) => {
  const {
    overallScore,
    metadata,
    results,
    strengths,
    weaknesses,
    recommendations,
  } = data;
  const doc = new jsPDF();

  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Interview Results", margin, yPosition);
  yPosition += 15;

  // Metadata
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Overall Score: ${overallScore}%`, margin, yPosition);
  yPosition += 7;
  doc.text(`Level: ${metadata.level || "N/A"}`, margin, yPosition);
  yPosition += 7;
  doc.text(
    `Interview Type: ${metadata.interviewType || "N/A"}`,
    margin,
    yPosition,
  );
  yPosition += 7;
  doc.text(`Total Questions: ${results.length}`, margin, yPosition);
  yPosition += 7;
  if (metadata.companyName) {
    doc.text(`Company: ${metadata.companyName}`, margin, yPosition);
    yPosition += 7;
  }
  if (metadata.jobTitle) {
    doc.text(`Job Title: ${metadata.jobTitle}`, margin, yPosition);
    yPosition += 7;
  }
  yPosition += 5;

  // Resume
  if (metadata.resume) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resume:", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const resumeLines = doc.splitTextToSize(metadata.resume, maxWidth);
    resumeLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 8;
  }

  // Job Description
  if (metadata.jobDescription) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Job Description:", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const jobLines = doc.splitTextToSize(metadata.jobDescription, maxWidth);
    jobLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 8;
  }

  // Strengths
  if (strengths && strengths.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Strengths:", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    strengths.forEach((strength, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${strength}`, maxWidth - 5);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 6;
      });
    });
    yPosition += 6;
  }

  // Weaknesses
  if (weaknesses && weaknesses.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Areas for Improvement:", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    weaknesses.forEach((weakness, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${weakness}`, maxWidth - 5);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 6;
      });
    });
    yPosition += 6;
  }

  // Recommendations
  if (recommendations && recommendations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations:", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    recommendations.forEach((rec, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, maxWidth - 5);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 6;
      });
    });
    yPosition += 6;
  }

  // Questions breakdown
  doc.addPage();
  yPosition = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Question Breakdown", margin, yPosition);
  yPosition += 12;

  results.forEach((result, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Question number and text
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Question ${index + 1}:`, margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const questionLines = doc.splitTextToSize(result.question, maxWidth);
    questionLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 3;

    // Answer
    doc.setFont("helvetica", "bold");
    doc.text("Your Answer:", margin, yPosition);
    yPosition += 6;
    doc.setFont("helvetica", "normal");
    const answerLines = doc.splitTextToSize(result.answer, maxWidth);
    answerLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 3;

    // Scores
    doc.setFont("helvetica", "bold");
    doc.text("Scores:", margin, yPosition);
    yPosition += 6;
    doc.setFont("helvetica", "normal");
    doc.text(
      `Technical Accuracy: ${result.evaluation.technicalAccuracy}%`,
      margin + 5,
      yPosition,
    );
    yPosition += 6;
    doc.text(`Depth: ${result.evaluation.depth}%`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Clarity: ${result.evaluation.clarity}%`, margin + 5, yPosition);
    yPosition += 6;
    if (result.evaluation.seniorityAlignment) {
      doc.text(
        `Seniority Alignment: ${result.evaluation.seniorityAlignment}%`,
        margin + 5,
        yPosition,
      );
      yPosition += 6;
    }
    doc.text(
      `Overall: ${result.evaluation.overallScore}%`,
      margin + 5,
      yPosition,
    );
    yPosition += 9;

    // Feedback
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Feedback:", margin, yPosition);
    yPosition += 6;
    doc.setFont("helvetica", "normal");
    const feedbackLines = doc.splitTextToSize(
      result.evaluation.feedback,
      maxWidth,
    );
    feedbackLines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 3;

    // Sample Answer
    if (result.evaluation.sampleAnswer) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text("Sample Answer:", margin, yPosition);
      yPosition += 6;
      doc.setFont("helvetica", "normal");
      const sampleLines = doc.splitTextToSize(
        result.evaluation.sampleAnswer,
        maxWidth,
      );
      sampleLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }

    yPosition += 7;
  });

  doc.save(`interview-results-${new Date().toISOString().split("T")[0]}.pdf`);
};

export const downloadAsText = (data: DownloadData) => {
  const {
    overallScore,
    metadata,
    results,
    strengths,
    weaknesses,
    recommendations,
  } = data;

  let text = `INTERVIEW RESULTS\n`;
  text += `=================\n\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n`;
  text += `Overall Score: ${overallScore}%\n`;
  text += `Level: ${metadata.level || "N/A"}\n`;
  text += `Interview Type: ${metadata.interviewType || "N/A"}\n`;
  text += `Total Questions: ${results.length}\n`;
  if (metadata.companyName) {
    text += `Company: ${metadata.companyName}\n`;
  }
  if (metadata.jobTitle) {
    text += `Job Title: ${metadata.jobTitle}\n`;
  }
  text += `\n`;

  if (metadata.resume) {
    text += `RESUME:\n`;
    text += `-------\n`;
    text += `${metadata.resume}\n\n`;
  }

  if (metadata.jobDescription) {
    text += `JOB DESCRIPTION:\n`;
    text += `----------------\n`;
    text += `${metadata.jobDescription}\n\n`;
  }

  if (strengths && strengths.length > 0) {
    text += `STRENGTHS:\n`;
    text += `----------\n`;
    strengths.forEach((strength, i) => {
      text += `${i + 1}. ${strength}\n`;
    });
    text += `\n`;
  }

  if (weaknesses && weaknesses.length > 0) {
    text += `AREAS FOR IMPROVEMENT:\n`;
    text += `----------------------\n`;
    weaknesses.forEach((weakness, i) => {
      text += `${i + 1}. ${weakness}\n`;
    });
    text += `\n`;
  }

  if (recommendations && recommendations.length > 0) {
    text += `RECOMMENDATIONS:\n`;
    text += `----------------\n`;
    recommendations.forEach((rec, i) => {
      text += `${i + 1}. ${rec}\n`;
    });
    text += `\n`;
  }

  text += `DETAILED QUESTION BREAKDOWN:\n`;
  text += `============================\n\n`;

  results.forEach((result, index) => {
    text += `Question ${index + 1}: ${result.question}\n`;
    text += `${"-".repeat(80)}\n`;
    text += `Your Answer: ${result.answer}\n\n`;
    text += `Scores:\n`;
    text += `  Technical Accuracy: ${result.evaluation.technicalAccuracy}%\n`;
    text += `  Depth: ${result.evaluation.depth}%\n`;
    text += `  Clarity: ${result.evaluation.clarity}%\n`;
    if (result.evaluation.seniorityAlignment) {
      text += `  Seniority Alignment: ${result.evaluation.seniorityAlignment}%\n`;
    }
    text += `  Overall: ${result.evaluation.overallScore}%\n\n`;
    text += `Feedback: ${result.evaluation.feedback}\n\n`;

    if (
      result.evaluation.improvementSuggestions &&
      result.evaluation.improvementSuggestions.length > 0
    ) {
      text += `Improvement Suggestions:\n`;
      result.evaluation.improvementSuggestions.forEach((suggestion, i) => {
        text += `  ${i + 1}. ${suggestion}\n`;
      });
      text += `\n`;
    }

    if (result.evaluation.sampleAnswer) {
      text += `Sample Answer: ${result.evaluation.sampleAnswer}\n`;
    }
    text += `\n\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `interview-results-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
