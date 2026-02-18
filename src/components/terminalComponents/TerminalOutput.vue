<template>
  <div class="terminal-output-entries">
    <div
      v-for="entry in history"
      :key="entry.id"
      class="output-entry"
      :class="`output-entry--${entry.type}`"
    >
      <!-- User input line -->
      <template v-if="entry.type === 'input'">
        <span class="prompt">{{ prompt }} $</span>
        <span class="command">{{ entry.content }}</span>
      </template>

      <!-- ASCII art -->
      <template v-else-if="entry.format === 'ascii'">
        <pre class="ascii-art">{{ entry.content }}</pre>
      </template>

      <!-- Help list -->
      <template v-else-if="entry.format === 'help'">
        <div class="help-output">
          <p class="help-title">Available Commands:</p>
          <div class="help-list">
            <div v-for="cmd in entry.content" :key="cmd.name" class="help-item">
              <span class="cmd-name">{{ cmd.name }}</span>
              <span class="cmd-desc">{{ cmd.description }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- About -->
      <template v-else-if="entry.format === 'about'">
        <div class="about-output">
          <p class="about-name">{{ entry.content.name }}</p>
          <p class="about-title">{{ entry.content.title }}</p>
          <p class="about-bio">{{ entry.content.bio }}</p>
          <p class="about-meta">
            <span class="label">Location:</span> {{ entry.content.location }}
          </p>
          <p class="about-meta">
            <span class="label">Status:</span>
            <span class="status-available">{{ entry.content.status }}</span>
          </p>
        </div>
      </template>

      <!-- Projects -->
      <template v-else-if="entry.format === 'projects'">
        <div class="projects-output">
          <div v-for="repo in entry.content" :key="repo.name" class="project-item">
            <div class="project-header">
              <span class="project-name" data-cursor-hover>{{ repo.name }}</span>
              <span v-if="repo.language" class="project-lang">{{ repo.language }}</span>
            </div>
            <p class="project-desc">{{ repo.description || 'No description' }}</p>
            <div class="project-stats">
              <span class="stat">★ {{ repo.stars || 0 }}</span>
              <span class="stat">⑂ {{ repo.forks || 0 }}</span>
            </div>
            <span class="project-hint">Type: open {{ repo.name }}</span>
          </div>
        </div>
      </template>

      <!-- Skills -->
      <template v-else-if="entry.format === 'skills'">
        <div class="skills-output">
          <div v-for="(skills, category) in entry.content" :key="category" class="skill-category">
            <span class="category-name">{{ category.toUpperCase() }}</span>
            <div class="skill-list">
              <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Contact -->
      <template v-else-if="entry.format === 'contact'">
        <div class="contact-output">
          <div v-for="(value, key) in entry.content" :key="key" class="contact-item">
            <span class="contact-label">{{ key }}:</span>
            <span class="contact-value">{{ value }}</span>
          </div>
        </div>
      </template>

      <!-- Experience -->
      <template v-else-if="entry.format === 'experience'">
        <div class="experience-output">
          <div v-for="exp in entry.content" :key="exp.title + exp.company" class="exp-item">
            <div class="exp-header">
              <span class="exp-title">{{ exp.title }}</span>
              <span class="exp-period">{{ exp.period }}</span>
            </div>
            <span class="exp-company">@ {{ exp.company }}</span>
            <p class="exp-desc">{{ exp.description }}</p>
          </div>
        </div>
      </template>

      <!-- Social links -->
      <template v-else-if="entry.format === 'social'">
        <div class="social-output">
          <a
            v-for="link in entry.content"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="social-link"
            data-cursor-hover
            @click="handleSocialLinkClick(link, $event)"
          >
            <span class="social-icon">{{ link.icon }}</span>
            {{ link.name }}
          </a>
        </div>
      </template>

      <!-- Whoami -->
      <template v-else-if="entry.format === 'whoami'">
        <div class="whoami-output">
          <div class="whoami-header">
            <span class="whoami-title">=== WHOAMI OUTPUT ===</span>
          </div>

          <div class="whoami-section">
            <div class="section-title">[Browser Info]</div>
            <div class="whoami-grid">
              <div class="whoami-item">
                <span class="whoami-label">Browser:</span>
                <span class="whoami-value">{{ entry.content.browser }} {{ entry.content.browserVersion }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Engine:</span>
                <span class="whoami-value">{{ entry.content.engine }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Cookies:</span>
                <span class="whoami-value">{{ entry.content.cookiesEnabled }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Do Not Track:</span>
                <span class="whoami-value">{{ entry.content.doNotTrack }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-section">
            <div class="section-title">[System Info]</div>
            <div class="whoami-grid">
              <div class="whoami-item">
                <span class="whoami-label">Platform:</span>
                <span class="whoami-value">{{ entry.content.platform }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Device Type:</span>
                <span class="whoami-value">{{ entry.content.deviceType }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">CPU Cores:</span>
                <span class="whoami-value">{{ entry.content.cpuCores }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Memory:</span>
                <span class="whoami-value">{{ entry.content.deviceMemory }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Touch Support:</span>
                <span class="whoami-value">{{ entry.content.touchSupport }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-section">
            <div class="section-title">[Display Info]</div>
            <div class="whoami-grid">
              <div class="whoami-item">
                <span class="whoami-label">Screen:</span>
                <span class="whoami-value">{{ entry.content.screen }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Viewport:</span>
                <span class="whoami-value">{{ entry.content.viewport }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Color Depth:</span>
                <span class="whoami-value">{{ entry.content.colorDepth }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Pixel Ratio:</span>
                <span class="whoami-value">{{ entry.content.pixelRatio }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-section">
            <div class="section-title">[Network Info]</div>
            <div class="whoami-grid">
              <div class="whoami-item">
                <span class="whoami-label">Status:</span>
                <span class="whoami-value">{{ entry.content.online }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Type:</span>
                <span class="whoami-value">{{ entry.content.connectionType }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Speed:</span>
                <span class="whoami-value">{{ entry.content.connectionSpeed }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-section">
            <div class="section-title">[Location Info]</div>
            <div class="whoami-grid">
              <div class="whoami-item">
                <span class="whoami-label">Timezone:</span>
                <span class="whoami-value">{{ entry.content.timezone }}</span>
              </div>
              <div class="whoami-item">
                <span class="whoami-label">Language:</span>
                <span class="whoami-value">{{ entry.content.language }}</span>
              </div>
              <div class="whoami-item wide">
                <span class="whoami-label">Languages:</span>
                <span class="whoami-value">{{ entry.content.languages }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-section">
            <div class="section-title">[Privacy Settings]</div>
            <div class="whoami-grid">
              <div class="whoami-item wide">
                <span class="whoami-label">Referrer:</span>
                <span class="whoami-value">{{ entry.content.referrer }}</span>
              </div>
              <div class="whoami-item wide">
                <span class="whoami-label">User Agent:</span>
                <span class="whoami-value small">{{ entry.content.userAgent }}</span>
              </div>
            </div>
          </div>

          <div class="whoami-footer">
            <small>Your privacy is important. This information is only displayed to you.</small>
          </div>
        </div>
      </template>

      <!-- Error -->
      <template v-else-if="entry.type === 'error'">
        <span class="error-text">{{ entry.content }}</span>
      </template>

      <!-- Plain text fallback -->
      <template v-else>
        <span class="output-text">{{ entry.content }}</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useEasterEggs } from '@/composables/useEasterEggs'

defineProps({
  history: {
    type: Array,
    default: () => []
  },
  prompt: {
    type: String,
    default: '$'
  }
})

const { discoverEgg, EASTER_EGGS } = useEasterEggs()

const handleSocialLinkClick = (link, event) => {
  if (link.name === 'X') {
    event.preventDefault()
    discoverEgg(EASTER_EGGS.RICKROLL)
    console.log('%c Rick Roll from Terminal! ', 'color: #c9a227; font-size: 16px; font-weight: bold;')
    window.open(link.url, '_blank')
  }
}
</script>

<style src="@/assets/styles/componentsScss/terminal-output.scss" lang="scss" scoped></style>
