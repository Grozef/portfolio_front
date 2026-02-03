<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({})
const isSubmitting = ref(false)
const isSuccess = ref(false)

const validateForm = () => {
  const newErrors = {}
  
  if (!form.name.trim()) {
    newErrors.name = 'Name is required'
  }
  
  if (!form.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Invalid email format'
  }
  
  if (!form.message.trim()) {
    newErrors.message = 'Message is required'
  } else if (form.message.length < 10) {
    newErrors.message = 'Message must be at least 10 characters'
  }
  
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, newErrors)
  
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    await axios.post('/api/v1/contact', form)
    isSuccess.value = true
    Object.keys(form).forEach(key => form[key] = '')
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    }
  } finally {
    isSubmitting.value = false
  }
}

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/Grozef', icon: '◆' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/françois-lisowski-39a88576', icon: '◇' },
  // { name: 'Twitter', url: 'https://twitter.com', icon: '○' },
  { name: 'Email', url: 'mailto:francois.lisowski@proton.me', icon: '◈' }
]
</script>

<template>
  <div class="contact-page">
    <header class="page-header">
      <router-link to="/" class="back-btn" data-cursor-hover>
        <span class="back-icon">←</span>
        <span>Back</span>
      </router-link>
      <h1 class="page-title">Contact</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="contact-main">
      <div class="contact-grid">
        <!-- Left side: Info -->
        <div class="contact-info">
          <div class="info-content">
            <span class="section-label">Get in touch</span>
            <h2 class="info-title">Let's create something amazing together</h2>
            <p class="info-text">
              I'm always interested in hearing about new projects and opportunities. 
              Whether you have a question or just want to say hi, feel free to reach out.
            </p>
            
            <div class="social-links">
              <a 
                v-for="link in socialLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener"
                class="social-link"
                data-cursor-hover
              >
                <span class="link-icon">{{ link.icon }}</span>
                <span class="link-name">{{ link.name }}</span>
              </a>
            </div>
          </div>
          
          <div class="info-visual">
            <div class="visual-line" v-for="i in 5" :key="i"></div>
          </div>
        </div>

        <!-- Right side: Form -->
        <div class="contact-form-wrapper">
          <Transition name="fade" mode="out-in">
            <div v-if="isSuccess" class="success-message">
              <div class="success-icon">✓</div>
              <h3 class="success-title">Message Sent!</h3>
              <p class="success-text">Thank you for reaching out. I'll get back to you soon.</p>
              <button class="reset-btn" @click="isSuccess = false" data-cursor-hover>
                Send another message
              </button>
            </div>
            
            <form v-else class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.name }"
                  placeholder="Your name"
                  data-cursor-hover
                />
                <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ error: errors.email }"
                  placeholder="your@email.com"
                  data-cursor-hover
                />
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Subject <span class="optional">(optional)</span></label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  class="form-input"
                  placeholder="What's this about?"
                  data-cursor-hover
                />
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="form-textarea"
                  :class="{ error: errors.message }"
                  placeholder="Tell me about your project..."
                  rows="6"
                  data-cursor-hover
                ></textarea>
                <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
              </div>

              <button 
                type="submit" 
                class="submit-btn"
                :disabled="isSubmitting"
                data-cursor-hover
              >
                <span v-if="isSubmitting" class="btn-loading">
                  <span class="loading-dot"></span>
                  <span class="loading-dot"></span>
                  <span class="loading-dot"></span>
                </span>
                <span v-else class="btn-text">
                  Send Message
                  <span class="btn-arrow">→</span>
                </span>
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-nav">
        <router-link to="/" data-cursor-hover>Terminal</router-link>
        <router-link to="/projects" data-cursor-hover>Projects</router-link>
        <router-link to="/about" data-cursor-hover>About</router-link>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.contact-page {
  min-height: 100vh;
  background: var(--terminal-bg);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--terminal-border);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--terminal-text-dim);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--terminal-accent);
  }
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--terminal-text);
}

.header-spacer {
  width: 80px;
}

.contact-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

// Info section
.contact-info {
  position: relative;
}

.info-content {
  position: relative;
  z-index: 1;
}

.section-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--terminal-accent);
  margin-bottom: 1rem;
}

.info-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 500;
  color: var(--terminal-text);
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.info-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--terminal-text-dim);
  margin-bottom: 3rem;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  transition: all 0.3s ease;
  
  .link-icon {
    color: var(--terminal-accent);
  }
  
  &:hover {
    border-color: var(--terminal-accent);
    background: rgba(34, 211, 238, 0.05);
  }
}

.info-visual {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0.2;
  
  @media (max-width: 968px) {
    display: none;
  }
}

.visual-line {
  height: 1px;
  background: var(--terminal-accent);
  animation: lineWidth 3s ease infinite;
  
  @for $i from 1 through 5 {
    &:nth-child(#{$i}) {
      width: #{100 + ($i * 30)}px;
      animation-delay: #{$i * 0.2}s;
    }
  }
}

@keyframes lineWidth {
  0%, 100% { transform: scaleX(0.5); opacity: 0.3; }
  50% { transform: scaleX(1); opacity: 1; }
}

// Form section
.contact-form-wrapper {
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  padding: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
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
}

.form-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--terminal-text);
  
  .optional {
    color: var(--terminal-text-dim);
    text-transform: none;
    letter-spacing: normal;
  }
}

.form-input,
.form-textarea {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--terminal-text);
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  padding: 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--terminal-text-dim);
  }
  
  &:focus {
    outline: none;
    border-color: var(--terminal-accent);
    box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
  }
  
  &.error {
    border-color: var(--terminal-error);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.form-error {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--terminal-error);
}

.submit-btn {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--terminal-bg);
  background: var(--terminal-accent);
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: var(--terminal-text);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  .btn-arrow {
    transition: transform 0.3s ease;
  }
}

.submit-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  background: var(--terminal-bg);
  border-radius: 50%;
  animation: loadingPulse 1.4s ease infinite;
  
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes loadingPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

// Success message
.success-message {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--terminal-success);
  border: 2px solid var(--terminal-success);
  border-radius: 50%;
}

.success-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--terminal-text);
  margin-bottom: 0.5rem;
}

.success-text {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--terminal-text-dim);
  margin-bottom: 2rem;
}

.reset-btn {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--terminal-accent);
  background: transparent;
  border: 1px solid var(--terminal-accent);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--terminal-accent);
    color: var(--terminal-bg);
  }
}

// Footer
.page-footer {
  padding: 2rem;
  border-top: 1px solid var(--terminal-border);
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 3rem;
  
  a {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--terminal-text-dim);
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--terminal-accent);
    }
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
