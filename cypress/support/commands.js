// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginAsAdmin', () => {
  // On mock l'appel de vérification de session
  cy.intercept('GET', '**/api/user', { fixture: 'user.json' }).as('getAuth')
  
  // Si ton app utilise un token dans le localStorage, on le simule ici
  window.localStorage.setItem('auth_token', 'fake-jwt-token')
  
  // On peut même mocker l'appel initial des stats pour gagner du temps
  cy.intercept('GET', '**/api/books/stats', {
    body: { total: 10, read: 5, reading: 2, to_read: 3 }
  }).as('getStats')
})