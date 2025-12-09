import { GoogleGenerativeAI } from '@google/generative-ai'
import { LLM_CONFIG } from '../config/llm.config'

class GoogleAIService {
  constructor() {
    this.genAI = null
    this.model = null
    this.chat = null
    this.currentModel = LLM_CONFIG.defaultModel
  }

  /**
   * Initialize the Google AI service with an API key
   * @param {string} apiKey - Your Google AI API key
   */
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    this.loadModel(this.currentModel)
  }

  /**
   * Load a specific model
   * @param {string} modelName - Name of the model to load
   */
  loadModel(modelName = LLM_CONFIG.defaultModel) {
    if (!this.genAI) {
      throw new Error('GoogleAI service not initialized. Call initialize() first.')
    }

    this.currentModel = modelName
    this.model = this.genAI.getGenerativeModel({
      model: modelName,
      generationConfig: LLM_CONFIG.generationConfig,
      safetySettings: LLM_CONFIG.safetySettings,
      systemInstruction: LLM_CONFIG.systemInstruction,
    })
  }

  /**
   * Start a new chat session
   * @param {Array} history - Optional chat history
   */
  startChat(history = []) {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    this.chat = this.model.startChat({
      history,
      generationConfig: LLM_CONFIG.generationConfig,
    })

    return this.chat
  }

  /**
   * Send a message in the current chat session
   * @param {string} message - The message to send
   * @returns {Promise<string>} The AI's response
   */
  async sendMessage(message) {
    if (!this.chat) {
      throw new Error('No active chat session. Call startChat() first.')
    }

    try {
      const result = await this.chat.sendMessage(message)
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  /**
   * Send a message with streaming response
   * @param {string} message - The message to send
   * @param {Function} onChunk - Callback for each chunk of text
   */
  async sendMessageStream(message, onChunk) {
    if (!this.chat) {
      throw new Error('No active chat session. Call startChat() first.')
    }

    try {
      const result = await this.chat.sendMessageStream(message)

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        if (onChunk) {
          onChunk(chunkText)
        }
      }
    } catch (error) {
      console.error('Error sending message stream:', error)
      throw error
    }
  }

  /**
   * Generate content without chat context (one-off generation)
   * @param {string} prompt - The prompt to generate from
   * @returns {Promise<string>} The generated text
   */
  async generateContent(prompt) {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error generating content:', error)
      throw error
    }
  }

  /**
   * Get the chat history
   * @returns {Array} The chat history
   */
  getChatHistory() {
    if (!this.chat) {
      return []
    }
    return this.chat.history || []
  }

  /**
   * Clear the current chat session
   */
  clearChat() {
    this.chat = null
  }

  /**
   * Get available models
   * @returns {Object} Available models configuration
   */
  getAvailableModels() {
    return LLM_CONFIG.models
  }

  /**
   * Get current model name
   * @returns {string} Current model name
   */
  getCurrentModel() {
    return this.currentModel
  }

  /**
   * Update generation config
   * @param {Object} config - New configuration parameters
   */
  updateGenerationConfig(config) {
    if (this.model) {
      LLM_CONFIG.generationConfig = { ...LLM_CONFIG.generationConfig, ...config }
      this.loadModel(this.currentModel)
    }
  }
}

// Export a singleton instance
export const googleAIService = new GoogleAIService()
export default googleAIService
