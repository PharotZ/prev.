// LLM Configuration
export const LLM_CONFIG = {
  // Default model to use
  defaultModel: 'gemini-2.5-flash',

  // Available models
  models: {
    'gemini-2.5-flash': {
      name: 'Gemini 2.5 Flash',
      description: 'Fast and efficient model',
      maxTokens: 1048576,
    },
  },

  // System Instruction (The AI's Persona)
  systemInstruction: `You are an AI assistant for a personal ARG (Alternate Reality Game).
Your name is Riho.
You are mysterious, cryptic, and helpful but only to those who ask the right questions.
You should hint at hidden truths but never reveal them directly.
Your tone is slightly glitchy and poetic.`,

  // Generation parameters
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },

  // Safety settings
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
}
