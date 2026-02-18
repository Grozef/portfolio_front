import { mount } from 'cypress/vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'

// ─── Stub router (no real routes needed in component tests) ────────────────────

const stubRouter = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
  ],
})

// ─── Global mount helper ──────────────────────────────────────────────────────

Cypress.Commands.add('mount', (component, options = {}) => {
  const pinia = createPinia()

  return mount(component, {
    global: {
      plugins: [pinia, stubRouter],
      stubs: {
        Teleport: true,
        Transition: false,
      },
      ...(options.global || {}),
    },
    ...options,
  })
})

// ─── Import e2e commands so shared helpers are available ──────────────────────

import './commands'
