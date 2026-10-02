/**
 * PlacementPal - Gemma AI Model Provider Adapter
 * Connects to Google Gemma via Ollama, Groq, OpenRouter, Google AI Studio, HuggingFace,
 * or fallback offline engine.
 */

import dotenv from 'dotenv';
dotenv.config();

export async function callGemmaModel({ systemPrompt, userPrompt, jsonMode = false }) {
  const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
  const modelName = process.env.GEMMA_MODEL_NAME || 'gemma2:9b';
  const failureStrategy = (process.env.FAILURE_STRATEGY || 'fallback_engine').toLowerCase();

  console.log(`[PlacementPal AI Service] Calling provider: ${provider} (Model: ${modelName})`);

  try {
    let rawResult = null;

    if (provider === 'groq' && process.env.GROQ_API_KEY) {
      rawResult = await callGroqAPI(systemPrompt, userPrompt, modelName, jsonMode);
    } else if (provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
      rawResult = await callOpenRouterAPI(systemPrompt, userPrompt, modelName, jsonMode);
    } else if (provider === 'google_ai_studio' && process.env.GEMINI_API_KEY) {
      rawResult = await callGoogleAIStudio(systemPrompt, userPrompt, modelName, jsonMode);
    } else if (provider === 'huggingface' && process.env.HUGGINGFACE_API_KEY) {
      rawResult = await callHuggingFaceAPI(systemPrompt, userPrompt, modelName);
    } else {
      // Default / Ollama Local
      rawResult = await callOllamaLocal(systemPrompt, userPrompt, modelName, jsonMode);
    }

    if (rawResult) {
      return rawResult;
    }
  } catch (err) {
    console.warn(`[PlacementPal AI Provider Error] ${provider} failed: ${err.message}`);
  }

  if (failureStrategy === 'fallback_engine') {
    console.log('[PlacementPal AI] Utilizing Smart Fallback Engine...');
    return null; // Will trigger fallback in aiService
  } else {
    throw new Error(`PlacementPal couldn't reach the AI interviewer (${provider}). Check your AI configuration.`);
  }
}

/**
 * Call local Ollama inference server running Gemma
 */
async function callOllamaLocal(systemPrompt, userPrompt, modelName, jsonMode) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const url = `${baseUrl}/api/generate`;

  const promptText = `${systemPrompt}\n\nUSER PROMPT:\n${userPrompt}`;

  const body = {
    model: modelName.includes(':') ? modelName : 'gemma2:9b',
    prompt: promptText,
    stream: false,
    format: jsonMode ? "json" : undefined
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Ollama status ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

/**
 * Call Groq API (Gemma 2 9B IT)
 */
async function callGroqAPI(systemPrompt, userPrompt, modelName, jsonMode) {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const body = {
    model: modelName || 'gemma2-9b-it',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    response_format: jsonMode ? { type: 'json_object' } : undefined
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content;
}

/**
 * Call OpenRouter API (google/gemma-2-9b-it)
 */
async function callOpenRouterAPI(systemPrompt, userPrompt, modelName, jsonMode) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const body = {
    model: modelName || 'google/gemma-2-9b-it',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://placementpal.local',
      'X-Title': 'PlacementPal'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content;
}

/**
 * Call Google AI Studio API for Gemma
 */
async function callGoogleAIStudio(systemPrompt, userPrompt, modelName) {
  const apiKey = process.env.GEMINI_API_KEY;
  const targetModel = modelName.includes('gemma') ? modelName : 'gemma-2-9b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: `${systemPrompt}\n\nCandidate Input:\n${userPrompt}` }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Google AI Studio error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates[0]?.content?.parts[0]?.text;
}

/**
 * Call HuggingFace Inference API
 */
async function callHuggingFaceAPI(systemPrompt, userPrompt, modelName) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const targetModel = modelName || 'google/gemma-2-9b-it';
  const url = `https://api-inference.huggingface.co/models/${targetModel}`;

  const body = {
    inputs: `<start_of_turn>system\n${systemPrompt}<end_of_turn>\n<start_of_turn>user\n${userPrompt}<end_of_turn>\n<start_of_turn>model\n`
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`HuggingFace API error ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
}
