<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Navigation</h3>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/projects">Projects</router-link></li>
            <li><router-link to="/books">Books</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Legal Information</h3>
          <ul class="footer-links">
            <li><router-link to="/legal-notice">Legal Notice</router-link></li>
            <li><router-link to="/privacy-policy">Privacy</router-link></li>
            <li><router-link to="/cookies">Cookies</router-link></li>
            <li><router-link to="/terms">Terms of Use</router-link></li>
            <li><router-link to="/404" class="footer-link footer-link--game" data-cursor-hover>
                Legal Actions
              </router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contact</h3>
          <ul class="footer-links">
            <li>
              <a href="mailto:francois.lisowski@proton.me">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                francois.lisowski@proton.me
              </a>
            </li>
            <li>
              <a href="https://github.com/Grozef" target="_blank" rel="noopener" aria-label="Visit GitHub profile">
                <svg height="15" viewBox="0 0 16 16" width="15" aria-hidden="true">
                  <path fill="currentColor"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                  </path>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/françois-lisowski-39a88576" target="_blank"
                rel="noopener" aria-label="Visit LinkedIn profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a href='https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0'
                target="_blank" rel="noopener" @click.prevent="handleXLinkClick" aria-label="RickRoll">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
            </li>
            <li>
              <a href="/humans.txt" target="_blank" class="footer-link" @click="handleHumansTxtClick"
                data-cursor-hover>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-7 5c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm6 12.5c0 2.485-2.686 4.5-6 4.5s-6-2.015-6-4.5v-.5h12v.5z" />
                </svg>
                Credits
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ currentYear }} - All rights reserved -
          <span class="eightbit-text" @mouseenter="playHoverSound" @click="toggleMusic" data-cursor-hover>Built with 8-bit</span>
        </p>
        <p class="tagline">
          Built with Vue.js & Laravel
        </p>
        <button 
          class="cursor-toggle" 
          @click="toggleCursor" 
          :title="isCustomCursorEnabled ? 'Switch to system cursor' : 'Switch to custom cursor'"
          data-cursor-hover
        >
          {{ isCustomCursorEnabled ? 'Disable custom cursor' : 'Enable custom cursor' }}
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useEasterEggs } from '@/composables/useEasterEggs'
import { use8BitSounds } from '@/composables/use8BitSounds'
import { useCursorPreference } from '@/composables/useCursorPreference'

const { discoverEgg, EASTER_EGGS } = useEasterEggs()
const { isCustomCursorEnabled, toggleCursor } = useCursorPreference()

const handleHumansTxtClick = () => {
  discoverEgg(EASTER_EGGS.HUMANS_TXT)
}

const handleXLinkClick = (event) => {
  event.preventDefault()
  console.log('%cRick Roll Easter Egg!', 'color: #c9a227; font-size: 16px; font-weight: bold;')
  discoverEgg(EASTER_EGGS.RICKROLL)
  window.open('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1', '_blank')
}

const currentYear = computed(() => new Date().getFullYear())

const { playHoverSound, toggleMusic } = use8BitSounds()

</script>

<style src="@/assets/styles/componentsScss/footer.scss" scoped lang="scss">

</style>