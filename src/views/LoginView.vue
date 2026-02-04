<!--
  LoginView.vue - Page de connexion admin
  
  Fonctionnalites:
  - Formulaire de connexion email/password
  - Affichage du temps restant si compte bloque (brute force)
  - Compte a rebours automatique
  - Redirection vers /admin apres connexion
-->
<template>
  <div class="login-page">
    <header class="page-header">
      <button class="back-btn" @click="goToTerminal" data-cursor-hover>
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
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" data-cursor-hover>
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

          <button type="submit" class="submit-btn" :disabled="authStore.isLoading || countdown > 0" data-cursor-hover>
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
    router.push('/admin')
  } else if (authStore.retryAfter > 0) {
    startCountdown(authStore.retryAfter)
  }
}

const goToTerminal = () => router.push('/')

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style lang="scss" scoped>
.login-page {
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
  background: transparent;
  border: 1px solid var(--terminal-border);
  color: var(--terminal-text);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--terminal-accent);
    color: var(--terminal-accent);
  }

  .back-icon {
    transition: transform 0.2s ease;
  }

  &:hover .back-icon {
    transform: translateX(-3px);
  }
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--terminal-text);
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--terminal-bg-secondary);
  border: 1px solid var(--terminal-border);
  border-radius: 12px;
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid var(--terminal-border);

  .login-icon {
    font-size: 3rem;
    color: var(--terminal-accent);
    margin-bottom: 1rem;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--terminal-text);
    margin-bottom: 0.5rem;
  }

  p {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--terminal-text-dim);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--terminal-text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  input {
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    color: var(--terminal-text);
    padding: 0.875rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--terminal-accent);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.password-input {
  position: relative;

  input {
    width: 100%;
    padding-right: 3rem;
  }

  .toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--terminal-text-dim);
    font-size: 1.25rem;
    cursor: pointer;

    &:hover {
      color: var(--terminal-accent);
    }
  }
}

.error-message {
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  color: #ff6464;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-align: center;

  .countdown {
    margin-top: 0.5rem;
    font-size: 1rem;

    strong {
      color: #ff8080;
      font-size: 1.25rem;
    }
  }
}

.submit-btn {
  background: var(--terminal-accent);
  border: none;
  color: var(--terminal-bg);
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.login-footer {
  padding: 1rem 2rem;
  border-top: 1px solid var(--terminal-border);
  text-align: center;

  p {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--terminal-text-dim);
  }
}
</style>