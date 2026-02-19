<template>
  <div class="contact-page">
    <header class="fixed-weather-header">
      <WeatherBackground />
    </header>
    
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
              <span class="value">Time is relative - Albert Einstein</span>
            </div>
          </div>

          <div class="easter-egg-progress">
            <h3>Easter Eggs Progress</h3>
            <div class="progress-info">
              <p>Found: {{ easterEggProgress.discovered }}/{{ easterEggProgress.total }}</p>
              <p>{{ easterEggProgress.percentage }}% Complete</p>
            </div>
            <p class="reset-hint">
              Type <code>resetEgg()</code> in console to reset progress
            </p>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
            <div class="form-group" :class="{ 'has-error': fieldErrors.name }">
              <label for="name">
                Name
                <span class="char-count">{{ formData.name.length }}/100</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                maxlength="100"
                placeholder="Your name"
                aria-required="true"
                aria-invalid="fieldErrors.name ? 'true' : 'false'"
                aria-describedby="name-error"
                @blur="validateField('name', formData.name)"
                @input="fieldErrors.name && validateField('name', formData.name)"
              />
              <span v-if="fieldErrors.name" id="name-error" class="error-message" role="alert">
                {{ fieldErrors.name }}
              </span>
            </div>

            <div class="form-group" :class="{ 'has-error': fieldErrors.email }">
              <label for="email">
                Email
                <span class="char-count">{{ formData.email.length }}/150</span>
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                maxlength="150"
                placeholder="your.email@example.com"
                aria-required="true"
                aria-invalid="fieldErrors.email ? 'true' : 'false'"
                aria-describedby="email-error"
                @blur="validateField('email', formData.email)"
                @input="fieldErrors.email && validateField('email', formData.email)"
              />
              <span v-if="fieldErrors.email" id="email-error" class="error-message" role="alert">
                {{ fieldErrors.email }}
              </span>
            </div>

            <div class="form-group" :class="{ 'has-error': fieldErrors.subject }">
              <label for="subject">
                Subject
                <span class="char-count">{{ formData.subject.length }}/200</span>
              </label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                maxlength="200"
                placeholder="What's this about?"
                aria-required="true"
                aria-invalid="fieldErrors.subject ? 'true' : 'false'"
                aria-describedby="subject-error"
                @blur="validateField('subject', formData.subject)"
                @input="fieldErrors.subject && validateField('subject', formData.subject)"
              />
              <span v-if="fieldErrors.subject" id="subject-error" class="error-message" role="alert">
                {{ fieldErrors.subject }}
              </span>
            </div>

            <div class="form-group" :class="{ 'has-error': fieldErrors.message }">
              <label for="message">
                Message
                <span class="char-count">{{ formData.message.length }}/2000</span>
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                maxlength="2000"
                rows="6"
                placeholder="Your message..."
                aria-required="true"
                aria-invalid="fieldErrors.message ? 'true' : 'false'"
                aria-describedby="message-error"
                @blur="validateField('message', formData.message)"
                @input="fieldErrors.message && validateField('message', formData.message)"
              ></textarea>
              <span v-if="fieldErrors.message" id="message-error" class="error-message" role="alert">
                {{ fieldErrors.message }}
              </span>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting || formIsInvalid"
              data-cursor-hover
              aria-label="Send contact message"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>

            <button 
              type="button"
              @click="handleProgressiveClick"
              class="submit-btn progressive-btn"
              data-cursor-hover
              aria-label="Progressive button easter egg"
            >
              {{ progressiveButtonText }}
            </button>
          </form>

          <div 
            v-if="submitMessage" 
            :class="['submit-message', submitStatus]"
            role="alert"
            aria-live="polite"
          >
            <span>{{ submitMessage }}</span>
            <button 
              @click="closeSubmitMessage" 
              class="close-message-btn"
              aria-label="Close message"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <BluescreenOfDeath 
      :show="showBSOD" 
      :clickCount="progressiveClickCount"
      @close="handleCloseBSOD"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BluescreenOfDeath from '@/components/BluescreenOfDeath.vue'
import WeatherBackground from '@/components/WeatherBackground.vue'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { useFormValidation } from '@/composables/useFormValidation'
import { submitContactForm } from '@/services/contact'

const router = useRouter()
const { progress: easterEggProgress, discoverEgg, EASTER_EGGS } = useEasterEggs()

const STORAGE_KEY = 'progressive_button_clicks'
const POST_BSOD_KEY = 'post_bsod_clicks'
const BSOD_OCCURRED_KEY = 'bsod_occurred'
const RATE_LIMIT_KEY = 'contact_form_submissions'
const RATE_LIMIT_WINDOW = 3600000 // 1 hour
const MAX_SUBMISSIONS = 5

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const { validateField, validateForm, fieldErrors, clearErrors } = useFormValidation()

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')

const progressiveClickCount = ref(0)
const postBsodClicks = ref(0)
const bsodOccurred = ref(false)
const showBSOD = ref(false)

const formIsInvalid = computed(() => {
  return !formData.value.name || 
         !formData.value.email || 
         !formData.value.subject || 
         !formData.value.message ||
         Object.keys(fieldErrors.value).length > 0
})

const progressiveButtonText = computed(() => {
  if (bsodOccurred.value) {
    if (postBsodClicks.value === 0) return 'Try Again?'
    if (postBsodClicks.value === 1) return 'Still clicking?'
    if (postBsodClicks.value === 2) return 'Last chance...'
    return 'Contact me faster'
  }
  
  const count = progressiveClickCount.value
  if (count === 0) return 'Contact me faster'
  if (count < 5) return 'Please stop...'
  if (count < 10) return 'Seriously, stop!'
  if (count < 14) return 'You are determined...'
  if (count === 14) return 'One more click...'
  return 'Contact me faster'
})

const checkRateLimit = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    if (!stored) return true
    
    const submissions = JSON.parse(stored)
    const now = Date.now()
    const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW)
    
    if (recentSubmissions.length >= MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions)
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestSubmission)) / 60000)
      submitMessage.value = `Too many submissions. Please wait ${waitTime} minutes.`
      submitStatus.value = 'error'
      return false
    }
    
    return true
  } catch (e) {
    console.error('Rate limit check failed:', e)
    return true
  }
}

const recordSubmission = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    const submissions = stored ? JSON.parse(stored) : []
    const now = Date.now()
    
    submissions.push(now)
    const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW)
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions))
  } catch (e) {
    console.error('Failed to record submission:', e)
  }
}

const handleSubmit = async () => {
  clearErrors()
  
  const formErrors = validateForm(formData.value)
  if (Object.keys(formErrors).length > 0) {
    Object.assign(fieldErrors.value, formErrors)
    return
  }
  
  if (!checkRateLimit()) return
  
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    const result = await submitContactForm({
      name: formData.value.name,
      email: formData.value.email,
      subject: formData.value.subject,
      message: formData.value.message
    })
    
    if (result.success) {
      submitMessage.value = 'Message sent successfully! I\'ll get back to you soon.'
      submitStatus.value = 'success'
      recordSubmission()
      
      formData.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    } else {
      submitMessage.value = result.message || 'Failed to send message. Please try again.'
      submitStatus.value = 'error'
      if (result.errors) {
        Object.assign(fieldErrors.value, result.errors)
      }
    }
  } catch (error) {
    submitMessage.value = 'Network error. Please try again later.'
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const closeSubmitMessage = () => {
  submitMessage.value = ''
  submitStatus.value = ''
}

const handleProgressiveClick = () => {
  if (bsodOccurred.value) {
    postBsodClicks.value++
    try {
      localStorage.setItem(POST_BSOD_KEY, postBsodClicks.value.toString())
    } catch (e) {
      console.error('localStorage error:', e)
    }
    
    if (postBsodClicks.value >= 3) {
      bsodOccurred.value = false
      postBsodClicks.value = 0
      try {
        localStorage.removeItem(BSOD_OCCURRED_KEY)
        localStorage.removeItem(POST_BSOD_KEY)
      } catch (e) {
        console.error('localStorage error:', e)
      }
      router.push('/easter-egg/dino')
    }
    return
  }
  
  progressiveClickCount.value++
  try {
    localStorage.setItem(STORAGE_KEY, progressiveClickCount.value.toString())
  } catch (e) {
    console.error('localStorage error:', e)
  }
  
  if (progressiveClickCount.value === 1) {
    discoverEgg(EASTER_EGGS.PROGRESSIVE_BUTTON)
  }
  
  if (progressiveClickCount.value === 15) {
    showBSOD.value = true
  }
}

const handleCloseBSOD = () => {
  showBSOD.value = false
  bsodOccurred.value = true
  progressiveClickCount.value = 0
  postBsodClicks.value = 0
  
  try {
    localStorage.setItem(BSOD_OCCURRED_KEY, 'true')
    localStorage.setItem(STORAGE_KEY, '0')
    localStorage.setItem(POST_BSOD_KEY, '0')
  } catch (e) {
    console.error('localStorage error:', e)
  }
}

onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null && stored !== '0') {
      progressiveClickCount.value = parseInt(stored, 10)
    }
    
    const bsodOccurredStored = localStorage.getItem(BSOD_OCCURRED_KEY)
    if (bsodOccurredStored === 'true') {
      bsodOccurred.value = true
    }
    
    const postBsodStored = localStorage.getItem(POST_BSOD_KEY)
    if (postBsodStored !== null && postBsodStored !== '0') {
      postBsodClicks.value = parseInt(postBsodStored, 10)
    }
  } catch (e) {
    console.error('localStorage read error:', e)
  }
})
</script>

<style src="@/assets/styles/pagesScss/contact.scss" lang="scss" scoped></style>