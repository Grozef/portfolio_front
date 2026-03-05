import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    // Le pattern des fichiers à inclure
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    // Le pattern des fichiers à exclure
    excludeSpecPattern: [
      "**/_*", 
      "**/old_tests/*.js"
    ],
    
    screenshotOnRunFailure: true,
    video: false,

    setupNodeEvents(on, config) {
      // Tes plugins ici
    },
  },
  
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
    screenshotOnRunFailure: true,
    video: false,
  },
});