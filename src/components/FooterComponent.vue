<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Links Section -->
        <div class="footer-section">
          <h3>Navigation</h3>
          <ul class="footer-links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/projects">Projets</router-link></li>
            <li><router-link to="/books">Livres</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <!-- Legal Section -->
        <div class="footer-section">
          <h3>Informations légales</h3>
          <ul class="footer-links">
            <li><router-link to="/legal-notice">Mentions légales</router-link></li>
            <li><router-link to="/privacy-policy">Confidentialité</router-link></li>
            <li><router-link to="/cookies">Cookies</router-link></li>
            <li><router-link to="/terms">Conditions d'utilisation</router-link></li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="footer-section">
          <h3>Contact</h3>
          <ul class="footer-links">
            <li>
              <a href="mailto:contact@example.com">
                <span class="icon">✉</span>
                contact@example.com
              </a>
            </li>
            <li>
              <a href="https://github.com/username" target="_blank" rel="noopener">
                <span class="icon">⚡</span>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/username" target="_blank" rel="noopener">
                <span class="icon">◆</span>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} - Tous droits réservés
        </p>
        <p class="tagline">
          Développé avec <span class="heart">♥</span> en Vue.js & Laravel
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
.site-footer {
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.8) 0%, rgba(5, 5, 10, 0.95) 100%);
  border-top: 1px solid rgba(0, 255, 255, 0.1);
  color: var(--text-primary, #e0e0e0);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-section {
  h3 {
    font-size: 1.1rem;
    color: #00ffff;
    margin-bottom: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.75rem;
    
    a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      
      &:hover {
        color: #00ffff;
        transform: translateX(4px);
      }
      
      .icon {
        color: #00ffff;
        font-size: 0.9rem;
      }
    }
  }
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .copyright {
    font-weight: 500;
  }
  
  .tagline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    .heart {
      color: #ff0066;
      animation: heartbeat 1.5s ease-in-out infinite;
    }
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.1);
  }
  20%, 40% {
    transform: scale(1);
  }
}

// Dark mode adjustments
@media (prefers-color-scheme: dark) {
  .site-footer {
    background: linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, rgba(5, 5, 10, 1) 100%);
  }
}
</style>