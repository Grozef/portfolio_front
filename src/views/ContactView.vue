<template>
  <div class="contact-page">
    <!-- Weather background overlay -->
    <WeatherBackground />
    
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Get in touch</h1>
        <p class="page-subtitle">Let's create something amazing together</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <h2>Contact Information</h2>
          <div class="info-items">
            <div class="info-item">
              <span class="label">Email</span>
              <a href="mailto:francois.lisowski@proton.me" class="value" data-cursor-hover>
                francois.lisowski@proton.me
              </a>
            </div>
            <div class="info-item">
              <span class="label">Location</span>
              <span class="value">Lyon, France</span>
            </div>
            <div class="info-item">
              <span class="label">Response Time</span>
              <span class="value">Within a year</span>
            </div>
          </div>

          <!-- Easter Egg Progress Display (no reset button) -->
          <div class="easter-egg-progress">
            <h3>Easter Eggs Progress</h3>
            <div class="progress-info">
              <p>Found: {{ easterEggProgress.discovered }}/{{ easterEggProgress.total }}</p>
              <p>{{ easterEggProgress.percentage }}% Complete</p>
            </div>
            <p class="reset-hint">
              Type <code>resetEasterEggs()</code> in console to reset progress
            </p>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                placeholder="Your name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                placeholder="What's this about?"
              />
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="6"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting"
              data-cursor-hover
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>

            <!-- Progressive button easter egg -->
            <button 
              type="button"
              @click="handleProgressiveClick"
              class="submit-btn progressive-btn"
              data-cursor-hover
            >
              {{ progressiveButtonText }}
            </button>
          </form>

          <p v-if="submitMessage" :class="['submit-message', submitStatus]">
            {{ submitMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Blue Screen of Death -->
    <BluescreenOfDeath 
      :show="showBSOD" 
      :clickCount="progressiveClickCount"
      @close="handleCloseBSOD"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BluescreenOfDeath from '@/components/BluescreenOfDeath.vue'
import WeatherBackground from '@/components/WeatherBackground.vue'
import { useEasterEggs } from '@/composables/useEasterEggs'

const { progress: easterEggProgress, discoverEgg, EASTER_EGGS } = useEasterEggs()

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')

// Progressive button easter egg with persistent tracking
const STORAGE_KEY = 'progressive_button_clicks'
const progressiveClickCount = ref(0)
const showBSOD = ref(false)

// Load click count from localStorage
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    progressiveClickCount.value = parseInt(stored, 10) || 0
  }
})

const progressiveButtonText = computed(() => {
  const count = progressiveClickCount.value
  if (count === 0) return 'Contact me faster'
  if (count < 5) return 'Please stop...'
  if (count < 10) return 'Seriously, stop!'
  if (count < 14) return 'You are determined...'
  if (count === 14) return 'One more click...'
  return 'Contact me faster'
})

const handleProgressiveClick = () => {
  progressiveClickCount.value++
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, progressiveClickCount.value.toString())
  
  // Discover easter egg on first click
  if (progressiveClickCount.value === 1) {
    discoverEgg(EASTER_EGGS.PROGRESSIVE_BUTTON)
  }
  
  // Trigger BSOD at exactly 15 clicks
  if (progressiveClickCount.value === 15) {
    showBSOD.value = true
    // Reset counter after showing BSOD
    progressiveClickCount.value = 0
    localStorage.setItem(STORAGE_KEY, '0')
  }
}

const handleCloseBSOD = () => {
  showBSOD.value = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    submitMessage.value = 'Message sent successfully! I\'ll get back to you soon.'
    submitStatus.value = 'success'
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    submitMessage.value = 'Failed to send message. Please try again.'
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
    
    setTimeout(() => {
      submitMessage.value = ''
      submitStatus.value = ''
    }, 5000)
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
  position: relative;
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--terminal-accent);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.page-subtitle {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--terminal-text-dim);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-top: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.contact-info {
  h2 {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--terminal-accent);
    margin-bottom: 2rem;
  }
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  .label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    color: var(--terminal-text);
    
    &[href] {
      color: var(--terminal-accent);
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--terminal-accent-secondary);
      }
    }
  }
}

.easter-egg-progress {
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 8px;

  h3 {
    font-family: var(--font-mono);
    font-size: 1.125rem;
    color: var(--terminal-accent);
    margin-bottom: 1rem;
  }

  .progress-info {
    margin-bottom: 1rem;
    
    p {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--terminal-text);
      margin: 0.25rem 0;
    }
  }
  
  .reset-hint {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
    font-style: italic;
    
    code {
      padding: 0.2rem 0.4rem;
      background: var(--terminal-bg);
      border: 1px solid var(--terminal-border);
      border-radius: 3px;
      color: var(--terminal-accent);
    }
  }
}

.contact-form-wrapper {
  background: var(--terminal-bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--terminal-border);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--terminal-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  textarea {
    padding: 0.75rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--terminal-text);
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    border-radius: 4px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--terminal-accent);
    }

    &::placeholder {
      color: var(--terminal-text-dim);
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
}

.submit-btn {
  padding: 1rem 2rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--terminal-bg);
  background: var(--terminal-accent);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: var(--terminal-text);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.progressive-btn {
  background: var(--terminal-accent-secondary);
  margin-bottom: 0.5rem;
}

.submit-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-align: center;

  &.success {
    background: rgba(39, 202, 64, 0.1);
    color: var(--terminal-success);
    border: 1px solid var(--terminal-success);
  }

  &.error {
    background: rgba(255, 68, 68, 0.1);
    color: var(--terminal-error);
    border: 1px solid var(--terminal-error);
  }
}
</style>