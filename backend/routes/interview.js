/**
 * PlacementPal - Express Interview API Routes
 */

import express from 'express';
import { generateQuestion, evaluateAnswer, generateFollowUp, generateSessionSummary } from '../services/aiService.js';
import { CATEGORIES } from '../data/questionBank.js';

const router = express.Router();

// In-memory session store for interview sessions
const sessions = new Map();

/**
 * GET /api/interview/status
 * Returns current model provider setup and server health
 */
router.get('/status', (req, res) => {
  const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
  const modelName = process.env.GEMMA_MODEL_NAME || 'gemma2:9b';

  let providerLabel = "Google Gemma 2 (Local Ollama)";
  if (provider === 'groq') providerLabel = "Google Gemma 2 9B (Groq Cloud API)";
  else if (provider === 'openrouter') providerLabel = "Google Gemma 2 9B (OpenRouter)";
  else if (provider === 'google_ai_studio') providerLabel = "Google Gemma 2 (Google AI Studio)";
  else if (provider === 'huggingface') providerLabel = "Google Gemma 2 (HuggingFace)";

  res.json({
    status: "ok",
    provider,
    modelName,
    providerLabel,
    hasApiKey: Boolean(process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY),
    failureStrategy: process.env.FAILURE_STRATEGY || 'fallback_engine'
  });
});

/**
 * POST /api/interview/start
 * Initializes a new placement interview session
 */
router.post('/start', async (req, res) => {
  try {
    const { category = "dsa", difficulty = "Medium", totalQuestions = 5 } = req.body;

    const catObj = CATEGORIES[category] || CATEGORIES.dsa;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    console.log(`[Session Started] ID: ${sessionId} | Cat: ${catObj.name} | Diff: ${difficulty} | Count: ${totalQuestions}`);

    const firstQuestion = await generateQuestion(catObj.name, difficulty, 1, totalQuestions);

    const sessionData = {
      sessionId,
      category: catObj.name,
      categoryId: catObj.id,
      difficulty,
      totalQuestions: Number(totalQuestions),
      currentQuestionIndex: 1,
      history: [
        {
          questionIndex: 1,
          questionText: firstQuestion,
          userAnswer: "",
          evaluation: null,
          followUp: null
        }
      ],
      createdAt: new Date()
    };

    sessions.set(sessionId, sessionData);

    res.json({
      success: true,
      sessionId,
      category: catObj.name,
      categoryId: catObj.id,
      difficulty,
      currentQuestionIndex: 1,
      totalQuestions: Number(totalQuestions),
      questionText: firstQuestion
    });
  } catch (err) {
    console.error("Error starting interview session:", err);
    res.status(500).json({
      error: "PlacementPal couldn't start the interview session. Please check configuration."
    });
  }
});

/**
 * POST /api/interview/evaluate
 * Evaluates candidate answer for current question
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { sessionId, questionIndex, questionText, userAnswer } = req.body;

    const session = sessions.get(sessionId);
    const category = session ? session.category : "Technical Placement";
    const difficulty = session ? session.difficulty : "Medium";

    console.log(`[Evaluating Q${questionIndex}] Session: ${sessionId} | Answer Length: ${userAnswer ? userAnswer.length : 0}`);

    const evaluation = await evaluateAnswer(category, difficulty, questionText, userAnswer);

    // Record in history if session exists
    if (session) {
      const existingStep = session.history.find(h => h.questionIndex === Number(questionIndex));
      if (existingStep) {
        existingStep.userAnswer = userAnswer;
        existingStep.evaluation = evaluation;
      } else {
        session.history.push({
          questionIndex: Number(questionIndex),
          questionText,
          userAnswer,
          evaluation
        });
      }
    }

    res.json({
      success: true,
      evaluation
    });
  } catch (err) {
    console.error("Error evaluating answer:", err);
    res.status(500).json({
      error: "PlacementPal encountered an issue while evaluating your answer. Please try again."
    });
  }
});

/**
 * POST /api/interview/followup
 * Generates an adaptive follow-up question
 */
router.post('/followup', async (req, res) => {
  try {
    const { sessionId, questionIndex, questionText, userAnswer, evaluation } = req.body;

    const session = sessions.get(sessionId);
    const category = session ? session.category : "Technical Placement";

    const followUpQuestion = await generateFollowUp(category, questionText, userAnswer, evaluation);

    if (session) {
      const step = session.history.find(h => h.questionIndex === Number(questionIndex));
      if (step) step.followUp = followUpQuestion;
    }

    res.json({
      success: true,
      followUp: followUpQuestion
    });
  } catch (err) {
    console.error("Error generating follow-up:", err);
    res.status(500).json({
      error: "Could not generate follow-up question."
    });
  }
});

/**
 * POST /api/interview/next
 * Advances to the next question or completes session
 */
router.post('/next', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    if (session.currentQuestionIndex >= session.totalQuestions) {
      return res.json({
        success: true,
        isFinished: true,
        message: "Interview complete!"
      });
    }

    const nextIndex = session.currentQuestionIndex + 1;
    session.currentQuestionIndex = nextIndex;

    const nextQuestionText = await generateQuestion(
      session.category,
      session.difficulty,
      nextIndex,
      session.totalQuestions
    );

    session.history.push({
      questionIndex: nextIndex,
      questionText: nextQuestionText,
      userAnswer: "",
      evaluation: null,
      followUp: null
    });

    res.json({
      success: true,
      isFinished: false,
      currentQuestionIndex: nextIndex,
      totalQuestions: session.totalQuestions,
      questionText: nextQuestionText
    });
  } catch (err) {
    console.error("Error fetching next question:", err);
    res.status(500).json({
      error: "PlacementPal could not load the next question."
    });
  }
});

/**
 * POST /api/interview/summary
 * Generates comprehensive final interview report
 */
router.post('/summary', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const summaryReport = await generateSessionSummary(
      session.category,
      session.difficulty,
      session.history
    );

    const attemptedCount = session.history.filter(h => h.userAnswer && h.userAnswer.trim().length > 0).length;
    const skippedCount = session.history.length - attemptedCount;

    res.json({
      success: true,
      summary: {
        category: session.category,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
        attemptedCount,
        skippedCount,
        ...summaryReport
      }
    });
  } catch (err) {
    console.error("Error generating interview summary:", err);
    res.status(500).json({
      error: "PlacementPal could not compile your final interview report."
    });
  }
});

export default router;
