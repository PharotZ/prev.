import { ref, computed } from 'vue'
import { googleAIService } from '../services/googleAI'

export function useLLM() {
  const messages = ref([])
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const currentModel = ref(googleAIService.getCurrentModel())

  /**
   * Initialize the LLM service with API key from environment
   */
  const initialize = () => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY

      if (!apiKey) {
        throw new Error('API key not found in environment variables')
      }

      googleAIService.initialize(apiKey)
      googleAIService.startChat()
      isInitialized.value = true
      error.value = null
    } catch (err) {
      error.value = err.message
      isInitialized.value = false
      throw err
    }
  }

  /**
   * Send a message to the LLM
   * @param {string} message - User message
   * @returns {Promise<string>} AI response
   */
  const sendMessage = async (message) => {
    if (!isInitialized.value) {
      throw new Error('LLM not initialized. Call initialize() first.')
    }

    isLoading.value = true
    error.value = null

    try {
      // Add user message to history
      messages.value.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      })

      // Get AI response
      const response = await googleAIService.sendMessage(message)

      // Add AI response to history
      messages.value.push({
        role: 'model',
        content: response,
        timestamp: new Date(),
      })

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Send a message with streaming response
   * @param {string} message - User message
   * @param {Function} onChunk - Callback for each chunk
   */
  const sendMessageStream = async (message, onChunk) => {
    if (!isInitialized.value) {
      throw new Error('LLM not initialized. Call initialize() first.')
    }

    isLoading.value = true
    error.value = null

    try {
      // Add user message to history
      messages.value.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      })

      // Create placeholder for AI response
      const aiMessageIndex = messages.value.length
      messages.value.push({
        role: 'model',
        content: '',
        timestamp: new Date(),
      })

      // Stream response
      await googleAIService.sendMessageStream(message, (chunk) => {
        messages.value[aiMessageIndex].content += chunk
        if (onChunk) {
          onChunk(chunk)
        }
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Generate content without chat context
   * @param {string} prompt - Generation prompt
   * @returns {Promise<string>} Generated content
   */
  const generateContent = async (prompt) => {
    if (!isInitialized.value) {
      throw new Error('LLM not initialized. Call initialize() first.')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await googleAIService.generateContent(prompt)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Change the current model
   * @param {string} modelName - Name of the model to use
   */
  const changeModel = (modelName) => {
    try {
      googleAIService.loadModel(modelName)
      currentModel.value = modelName

      // Start new chat with new model
      googleAIService.startChat()

      error.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Update generation configuration
   * @param {Object} config - New configuration parameters
   */
  const updateConfig = (config) => {
    try {
      googleAIService.updateGenerationConfig(config)
      error.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Clear chat history
   */
  const clearChat = () => {
    messages.value = []
    googleAIService.clearChat()

    if (isInitialized.value) {
      googleAIService.startChat()
    }
  }

  /**
   * Reset the service
   */
  const reset = () => {
    messages.value = []
    isInitialized.value = false
    error.value = null
    googleAIService.clearChat()
  }

  // Get available models
  const availableModels = computed(() => googleAIService.getAvailableModels())

  // Auto-initialize on composable creation
  if (!isInitialized.value) {
    try {
      initialize()
    } catch (err) {
      console.error('Auto-initialization failed:', err)
    }
  }

  return {
    // State
    messages,
    isInitialized,
    isLoading,
    error,
    currentModel,
    availableModels,

    // Methods
    initialize,
    sendMessage,
    sendMessageStream,
    generateContent,
    changeModel,
    updateConfig,
    clearChat,
    reset,
  }
}
