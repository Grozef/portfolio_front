import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Ajuste le port si nécessaire
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: true,
    video: false,
    setupNodeEvents(on, config) {
      // C'est ici que tu mettras tes plugins (ex: preprocessors)
    },
  },
  
  // Si tu décides de faire du Component Testing plus tard
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});