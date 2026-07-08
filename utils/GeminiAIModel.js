const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Flash model for quick interview generation
const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Pro model for deeper analysis (resume, evaluation)
const proModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const jsonGenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Chat session for interactive use
export const chatSession = flashModel.startChat({
  generationConfig,
});

/**
 * Generate content using Gemini Flash (fast, good for interviews)
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateContent(prompt) {
  const result = await flashModel.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate JSON content using Gemini Flash
 * @param {string} prompt
 * @returns {Promise<any>}
 */
export async function generateJSON(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: strip markdown code fences
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  }
}

/**
 * Generate content using Gemini Pro (better for analysis)
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateProContent(prompt) {
  const result = await proModel.generateContent(prompt);
  return result.response.text();
}
