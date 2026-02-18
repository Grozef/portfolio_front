describe('FooterComponent (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/auth/me', { statusCode: 401, body: {} }).as('getMe')
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('renders the footer element', () => {
    cy.get('.site-footer').should('exist')
  })

  it('renders Navigation section heading', () => {
    cy.get('.footer-section h3').contains('Navigation').should('exist')
  })

  it('renders Legal Information section heading', () => {
    cy.get('.footer-section h3').contains('Legal Information').should('exist')
  })

  it('renders Contact section heading', () => {
    cy.get('.footer-section h3').contains('Contact').should('exist')
  })

  it('navigation links include all main routes', () => {
    ;['/', '/projects', '/books', '/about', '/contact'].forEach((route) => {
      cy.get('.site-footer').find(`a[href="${route}"]`).should('exist')
    })
  })

  it('legal links are present', () => {
    cy.get('.site-footer').find('a[href="/legal-notice"]').should('exist')
    cy.get('.site-footer').find('a[href="/privacy-policy"]').should('exist')
  })
})

describe('AdminLayout (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
    cy.intercept('GET', '/api/v1/messages*', { body: { data: [] } }).as('getMessages')
    cy.visit('/Moi/messages', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-jwt-token')
      },
    })
    cy.wait('@getMe')
  })

  it('renders the sidebar', () => {
    cy.get('.sidebar').first().should('exist')
  })

  it('sidebar contains navigation links', () => {
    cy.get('.sidebar').first().find('a, button').should('have.length.gte', 2)
  })

  it('sidebar has link to messages', () => {
    cy.get('.sidebar').first().contains(/messages/i).should('exist')
  })

  it('sidebar has link to books', () => {
    cy.get('.sidebar').first().contains(/books/i).should('exist')
  })

  it('sidebar has link to carousel', () => {
    cy.get('.sidebar').first().contains(/carousel/i).should('exist')
  })
})

describe('EyeTrackingPortrait (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/projects')
  })

  it('projects page loads correctly', () => {
    cy.get('.projects-page, .page-title').should('exist')
  })

  it('SwordTrigger wrapper is present on projects page', () => {
    cy.get('.sword-trigger-wrapper').should('exist')
  })

  it('SwordTrigger button is accessible via aria-label', () => {
    cy.get('.sword-trigger').should('have.attr', 'aria-label', 'Toggle sword cursor')
  })

  it('back button is present and navigates home', () => {
    cy.get('.back-btn').should('exist')
    cy.get('.back-btn').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})