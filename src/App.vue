<!--
  App.vue - Composant racine de l'application
  
  Contient:
  - Variables CSS globales (theme terminal)
  - RouterView pour le rendu des pages
  - Styles de base
-->
<template>
  <div id="app">
    <RouterView />
    <FooterComponent />
  </div>
</template>

<script setup>
import FooterComponent from '@/components/FooterComponent.vue'
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

:root {
  --terminal-bg: #0a0a0b;
  --terminal-bg-secondary: #111113;
  --terminal-text: #e8e6e3;
  --terminal-text-dim: #6b6b6b;
  --terminal-accent: #c9a227;
  --terminal-accent-secondary: #4a9eff;
  --terminal-border: #2a2a2a;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Playfair Display', serif;
  --font-serif: 'Crimson Pro', serif;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-mono);
  background: var(--terminal-bg);
  color: var(--terminal-text);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

::selection {
  background: var(--terminal-accent);
  color: var(--terminal-bg);
}
</style>