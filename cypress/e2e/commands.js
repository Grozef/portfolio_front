// ─── Auth helpers ────────────────────────────────────────────────────────────

Cypress.Commands.add('loginAsAdmin', () => {
  cy.intercept('GET', '**/auth/me', { fixture: 'user.json' }).as('getMe')

  cy.visit('/Moi/messages', {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', 'fake-jwt-token')
    },
  })

  cy.wait('@getMe')
})

Cypress.Commands.add('setAuthToken', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('auth_token', 'fake-jwt-token')
  })
})

// ─── Navigation helpers ───────────────────────────────────────────────────────

Cypress.Commands.add('dismissCookieBanner', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.cookie-banner').length) {
      cy.get('.cookie-banner').find('button').contains('Accept').click({ force: true })
    }
  })
})

// ─── Admin setup helper ───────────────────────────────────────────────────────

Cypress.Commands.add('setupAdminMocks', () => {
  cy.intercept('GET', '**/auth/me', { fixture: 'user.json' }).as('getMe')
  cy.intercept('GET', '**/books/stats', {
    body: { total: 2, read: 1, reading: 1, to_read: 0 },
  }).as('getStats')
  cy.intercept('GET', '**/books*', { fixture: 'books-list.json' }).as('getBooks')
})
