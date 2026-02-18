import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: true,
    video: false,
    setupNodeEvents(on, config) {},
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
