/**
 * PlacementPal - Frontend API Client
 */

const API_BASE = '/api/interview';

export async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error("Status endpoint unavailable");
    return await res.json();
  } catch (err) {
    console.warn("API status error:", err.message);
    return {
      status: "fallback",
      providerLabel: "Google Gemma 2 (Offline Fallback)",
      provider: "fallback"
    };
  }
}

export async function startInterviewSession(category, difficulty, totalQuestions) {
  const res = await fetch(`${API_BASE}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, difficulty, totalQuestions })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "PlacementPal couldn't start the interview. Please try again.");
  }
  return await res.json();
}

export async function evaluateUserAnswer(sessionId, questionIndex, questionText, userAnswer) {
  const res = await fetch(`${API_BASE}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionIndex, questionText, userAnswer })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "PlacementPal couldn't evaluate your answer. Please try again.");
  }
  return await res.json();
}

export async function getFollowUpQuestion(sessionId, questionIndex, questionText, userAnswer, evaluation) {
  const res = await fetch(`${API_BASE}/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionIndex, questionText, userAnswer, evaluation })
  });

  if (!res.ok) {
    return { followUp: "What is an alternative edge case or time complexity optimization for this solution?" };
  }
  return await res.json();
}

export async function getNextQuestion(sessionId) {
  const res = await fetch(`${API_BASE}/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "PlacementPal couldn't load the next question.");
  }
  return await res.json();
}

export async function getInterviewSummary(sessionId) {
  const res = await fetch(`${API_BASE}/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "PlacementPal couldn't compile final performance results.");
  }
  return await res.json();
}
