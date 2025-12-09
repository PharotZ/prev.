<script setup>
import { ref, nextTick } from 'vue'
import { useLLM } from '../composables/useLLM'

const {
  messages,
  isLoading,
  error,
  sendMessageStream,
} = useLLM()

const userInput = ref('')
const chatContainer = ref(null)

const handleSendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const message = userInput.value
  userInput.value = ''

  try {
    await sendMessageStream(message)

    // Scroll to bottom
    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const formatTimestamp = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="llm-chat-container">
    <!-- Main Chat Interface -->
    <div class="chat-interface">
      <!-- Messages -->
      <div ref="chatContainer" class="messages-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
          <div class="message-header">
            <span class="role">{{
              message.role === 'user' ? 'user9985' : '...'
            }}</span>
            <span class="timestamp">{{
              formatTimestamp(message.timestamp)
            }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-if="isLoading" class="message model loading">
          <div class="message-content"></div>
        </div>
        <!-- ADD blinking bar-->
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <textarea
          v-model="userInput"
          rows="3"
          @keydown.enter.exact.prevent="handleSendMessage"
          :disabled="isLoading"
        ></textarea>
        <button
          @click="handleSendMessage"
          :disabled="!userInput.trim() || isLoading"
          class="btn-send"
        >
          ↵
        </button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.llm-chat-container {
  width: 100%;
  height: 100vh;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  background: black;
  color: white;
}

/* Chat Interface */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
}

.message {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.loading {
  opacity: 0.7;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.role {
  font-weight: bold;
  color: #95a8ff;
}

.timestamp {
  color: rgba(255, 255, 255, 0.5);
}

.message-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Input Area */
.input-area {
  display: flex;
  gap: 12px;
  padding: 20px;

}

.input-area textarea {
  flex: 1;
  padding: 12px;
  background: #0f0f1e;
  border: 1px solid #ffffff;
  border-radius: 8px;
  color: white;
  font-family: inherit;
  resize: none;
}

.input-area textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary,
.btn-send {
  padding: 12px 24px;
  background: #ffffff;
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  white-space: nowrap;
}

.btn-primary:hover,
.btn-send:hover:not(:disabled) {
  background: #b3b3b3;
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  padding: 12px;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin: 12px 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .input-area {
    flex-direction: column;
  }

  .btn-send {
    width: 100%;
  }
}
</style>
