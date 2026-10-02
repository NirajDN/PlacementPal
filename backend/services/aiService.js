/**
 * PlacementPal - AI Orchestration Service
 * Manages prompt construction, AI model invocations, JSON validation, and offline fallbacks.
 */

import { callGemmaModel } from './gemmaProvider.js';
import { INTERVIEWER_SYSTEM_PROMPT, buildQuestionPrompt, buildFollowUpPrompt } from '../prompts/interviewer.js';
import { EVALUATOR_SYSTEM_PROMPT, buildEvaluationPrompt, buildSummaryPrompt } from '../prompts/evaluator.js';
import { QUESTION_BANK } from '../data/questionBank.js';

export async function generateQuestion(category, difficulty, index, total, seedTopic = null) {
  const userPrompt = buildQuestionPrompt(category, difficulty, index, total, seedTopic);

  try {
    const aiResponse = await callGemmaModel({
      systemPrompt: INTERVIEWER_SYSTEM_PROMPT,
      userPrompt,
      jsonMode: false
    });

    if (aiResponse && aiResponse.trim().length > 10) {
      return parseQuestionText(aiResponse);
    }
  } catch (err) {
    console.warn("[aiService] Question generation error, resorting to question bank fallback:", err.message);
  }

  // Fallback to rich curated question bank if model returned empty or errored
  return getFallbackQuestion(category, difficulty, index);
}

export async function evaluateAnswer(category, difficulty, questionText, userAnswer) {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 1,
      correctness: "Skipped",
      strengths: ["Acknowledged question structure"],
      missingPoints: ["No answer provided by candidate"],
      improvement: "Attempting to outline a basic approach or pseudo-code is always better than skipping during placement interviews.",
      idealAnswer: getFallbackIdealAnswer(category, questionText)
    };
  }

  const userPrompt = buildEvaluationPrompt(category, difficulty, questionText, userAnswer);

  try {
    const rawAiOutput = await callGemmaModel({
      systemPrompt: EVALUATOR_SYSTEM_PROMPT,
      userPrompt,
      jsonMode: true
    });

    if (rawAiOutput) {
      const parsedJson = cleanAndParseJson(rawAiOutput);
      if (parsedJson && parsedJson.score !== undefined) {
        return sanitizeEvaluationResponse(parsedJson, category, questionText);
      }
    }
  } catch (err) {
    console.warn("[aiService] Evaluation error, utilizing Smart Fallback Evaluator:", err.message);
  }

  // Fallback Smart Evaluator
  return generateFallbackEvaluation(category, questionText, userAnswer);
}

export async function generateFollowUp(category, questionText, userAnswer, evaluation) {
  if (evaluation.correctness === "Skipped") {
    return "Since you skipped this question, would you like to review the core concept or try a simplified problem in this topic?";
  }

  const userPrompt = buildFollowUpPrompt(category, questionText, userAnswer, evaluation);

  try {
    const aiResponse = await callGemmaModel({
      systemPrompt: INTERVIEWER_SYSTEM_PROMPT,
      userPrompt,
      jsonMode: false
    });

    if (aiResponse && aiResponse.trim().length > 10) {
      return aiResponse.replace(/### Follow-up/i, '').trim();
    }
  } catch (err) {
    console.warn("[aiService] Follow-up generation error, using fallback follow-up:", err.message);
  }

  return getFallbackFollowUp(category, questionText, userAnswer, evaluation);
}

export async function generateSessionSummary(category, difficulty, history) {
  const userPrompt = buildSummaryPrompt(category, difficulty, history);

  try {
    const rawAiOutput = await callGemmaModel({
      systemPrompt: EVALUATOR_SYSTEM_PROMPT,
      userPrompt,
      jsonMode: true
    });

    if (rawAiOutput) {
      const parsedJson = cleanAndParseJson(rawAiOutput);
      if (parsedJson && parsedJson.overallScore !== undefined) {
        return parsedJson;
      }
    }
  } catch (err) {
    console.warn("[aiService] Summary generation error, using calculated fallback summary:", err.message);
  }

  return generateFallbackSummary(category, difficulty, history);
}

/* ---------------- Helper & Fallback Functions ---------------- */

function parseQuestionText(rawText) {
  return rawText.trim();
}

function cleanAndParseJson(text) {
  try {
    // Strip markdown code block wrappers if present (```json ... ```)
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("[aiService] Failed to parse JSON from AI response:", text);
    return null;
  }
}

function sanitizeEvaluationResponse(evalObj, category, questionText) {
  return {
    score: Math.min(10, Math.max(1, Number(evalObj.score) || 6)),
    correctness: evalObj.correctness || "Mostly Correct",
    strengths: Array.isArray(evalObj.strengths) && evalObj.strengths.length > 0 ? evalObj.strengths : ["Good attempt at explaining core concepts"],
    missingPoints: Array.isArray(evalObj.missingPoints) ? evalObj.missingPoints : ["Edge case analysis"],
    improvement: evalObj.improvement || "Elaborate more on time/space complexity trade-offs.",
    idealAnswer: evalObj.idealAnswer || getFallbackIdealAnswer(category, questionText)
  };
}

function getFallbackQuestion(category, difficulty, index) {
  const catKey = category.toLowerCase().includes('dsa') ? 'dsa' : category.toLowerCase().includes('java') ? 'javascript' : 'hr';
  const diffQuestions = QUESTION_BANK[catKey]?.[difficulty] || QUESTION_BANK[catKey]?.['Medium'] || QUESTION_BANK['dsa']['Easy'];
  
  const questionItem = diffQuestions[(index - 1) % diffQuestions.length];
  return `### Topic: ${questionItem.topic}\n${questionItem.question}\n\n*Hint:* ${questionItem.hint}`;
}

function getFallbackIdealAnswer(category, questionText) {
  if (category.toLowerCase().includes('dsa')) {
    return "A standard optimal approach involves utilizing a Hash Table or Two Pointers to achieve linear O(N) time complexity and O(1) or O(N) auxiliary space. Make sure to discuss null/empty input checks and boundary limits.";
  } else if (category.toLowerCase().includes('java')) {
    return "Explain the underlying engine mechanisms: Call Stack execution, Lexical Scope binding, Microtask queue ordering for Promises, and block scoping behavior for let/const versus function scope for var.";
  } else {
    return "Structure your response using the STAR technique (Situation, Task, Action, Result). State the objective, describe your individual contribution clearly, and highlight quantifiable results.";
  }
}

function generateFallbackEvaluation(category, questionText, userAnswer) {
  const textLen = userAnswer.trim().length;
  const wordCount = userAnswer.trim().split(/\s+/).length;

  let score = 5;
  let correctness = "Partially Correct";
  const strengths = [];
  const missingPoints = [];

  if (wordCount > 40) {
    score += 2;
    strengths.push("Detailed explanation provided with clear thought flow");
  } else if (wordCount > 15) {
    score += 1;
    strengths.push("Identified main technical concept accurately");
  } else {
    missingPoints.push("Answer was quite concise; elaborate with step-by-step logic");
  }

  const lowerAns = userAnswer.toLowerCase();
  if (lowerAns.includes("complexity") || lowerAns.includes("o(") || lowerAns.includes("time") || lowerAns.includes("space")) {
    score += 1;
    strengths.push("Explicitly mentioned time or space complexity");
  } else if (category.toLowerCase().includes("dsa")) {
    missingPoints.push("Did not analyze Time Complexity (Big O) or Space Complexity");
  }

  if (lowerAns.includes("edge") || lowerAns.includes("null") || lowerAns.includes("empty") || lowerAns.includes("boundary")) {
    strengths.push("Considered boundary limits or edge cases");
  } else {
    missingPoints.push("Consider adding edge-case handling (empty inputs, negative numbers, null values)");
  }

  score = Math.min(10, Math.max(2, score));
  if (score >= 8) correctness = "Strong Answer";
  else if (score >= 6) correctness = "Mostly Correct";

  return {
    score,
    correctness,
    strengths: strengths.length ? strengths : ["Clear communication style"],
    missingPoints: missingPoints.length ? missingPoints : ["Mention alternative algorithmic trade-offs"],
    improvement: `To make this answer placement-ready, explain your approach step-by-step before writing code, state the Big-O time and space complexity, and discuss edge cases.`,
    idealAnswer: getFallbackIdealAnswer(category, questionText)
  };
}

function getFallbackFollowUp(category, questionText, userAnswer, evaluation) {
  if (category.toLowerCase().includes('dsa')) {
    return "Follow-up: What would be the Time and Space Complexity of your proposed solution? How would your solution handle an extremely large dataset or empty array as an edge case?";
  } else if (category.toLowerCase().includes('java')) {
    return "Follow-up: How does your answer behave under asynchronous conditions or in strict mode? Can you describe an edge case where this approach might fail?";
  } else {
    return "Follow-up: Looking back at that situation, what is one thing you would do differently today with your current experience?";
  }
}

function generateFallbackSummary(category, difficulty, history) {
  const validHistory = history.filter(h => h.evaluation);
  const totalScore = validHistory.reduce((acc, h) => acc + (h.evaluation.score || 0), 0);
  const attemptedCount = history.filter(h => h.userAnswer && h.userAnswer.trim().length > 0).length;
  const skippedCount = history.length - attemptedCount;

  const avgScorePct = history.length > 0 ? Math.round((totalScore / (history.length * 10)) * 100) : 0;

  let badge = "Placement Ready";
  if (avgScorePct < 50) badge = "Needs Focused Practice";
  else if (avgScorePct < 75) badge = "Developing Candidate";
  else if (avgScorePct < 90) badge = "Strong Candidate";

  return {
    overallScore: avgScorePct,
    performanceBadge: badge,
    strengths: [
      `Solid problem solving approach in ${category} (${difficulty} level)`,
      "Clear explanation of primary technical concepts",
      "Good communication of problem-solving steps"
    ],
    areasToImprove: [
      "Explicit Big-O time and space complexity analysis",
      "Comprehensive edge case handling (empty/null inputs)",
      "Proactively discussing alternative trade-offs during interviews"
    ],
    recommendedPractice: [
      category.toLowerCase().includes('dsa') ? "Sliding Window & Two Pointers" : category.toLowerCase().includes('java') ? "Event Loop & Promises microtasks" : "STAR framework storytelling",
      "Time & Space Complexity estimation",
      "Boundary & Edge Case validation",
      "Live mock interview pacing"
    ],
    overallFeedback: `You completed ${history.length} questions in ${category} (${difficulty}). You attempted ${attemptedCount} question(s) and skipped ${skippedCount}. Keep practicing to refine complexity discussions and edge case validation!`
  };
}
