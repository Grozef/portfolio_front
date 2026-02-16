<template>
  <div class="login-page">
    <header class="page-header">
      <button class="back-btn" @click="goToTerminal" aria-label="Back to site" data-cursor-hover>
        <span class="back-icon">&larr;</span>
        <span class="back-text">Back to Site</span>
      </button>
      <h1 class="page-title">Admin Login</h1>
      <div></div>
    </header>

    <main class="login-main">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">&#9919;</div>
          <h2>Authentication</h2>
          <p>Enter your credentials to access the admin panel.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="admin@example.com" required autocomplete="email"
              :disabled="countdown > 0" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                required autocomplete="current-password" :disabled="countdown > 0" />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'" data-cursor-hover>
                {{ showPassword ? '◉' : '○' }}
              </button>
            </div>
          </div>

          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
            <div v-if="countdown > 0" class="countdown">
              Try again in: <strong>{{ formattedCountdown }}</strong>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="authStore.isLoading || countdown > 0"   :aria-busy="authStore.isLoading"
  aria-label="Login to admin panel" data-cursor-hover>
            <span v-if="authStore.isLoading">Authenticating...</span>
            <span v-else-if="countdown > 0">Locked ({{ formattedCountdown }})</span>
            <span v-else>Login</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Protected by brute force protection</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const countdown = ref(0)
let countdownInterval = null

const formattedCountdown = computed(() => {
  if (countdown.value <= 0) return ''
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const startCountdown = (seconds) => {
  countdown.value = seconds
  if (countdownInterval) clearInterval(countdownInterval)

  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      countdownInterval = null
      authStore.clearError()
    }
  }, 1000)
}

const handleSubmit = async () => {
  const success = await authStore.login(email.value, password.value)

  if (success) {
    router.push('/books')
  } else if (authStore.retryAfter > 0) {
    startCountdown(authStore.retryAfter)
  }
}

const goToTerminal = () => router.push('/')

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style src="@/assets/styles/pagesScss/login.scss" lang="scss" scoped>

</style>