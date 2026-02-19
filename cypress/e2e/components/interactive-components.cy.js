// ─── FleeingButton ────────────────────────────────────────────────────────────

describe('FleeingButton (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/auth/me', { statusCode: 401, body: {} }).as('getMe')
    cy.intercept('GET', '/api/v1/books*', {
      body: { data: [], meta: { total: 0, per_page: 50 } },
    }).as('getBooks')
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('getCarousel')
    cy.visit('/books')
        cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
  })

  it('renders the fleeing button', () => {
    cy.get('.fleeing-button').should('be.visible')
  })

  it('shows "Don\'t Click" text on initial render', () => {
    cy.get('.fleeing-button').should('contain', "Don't Click")
  })

  it('has correct aria-label', () => {
    cy.get('.fleeing-button').should('have.attr', 'aria-label', 'Fleeing Button (easter egg)')
  })
})

// ─── CookieBanner ────────────────────────────────────────────────────────────

describe('CookieBanner (E2E)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('appears on first visit', () => {
    cy.get('.cookie-banner', { timeout: 3000 }).should('be.visible')
  })

  it('has accept and customize buttons', () => {
    cy.get('.cookie-banner .btn-primary').should('be.visible')
    cy.get('.cookie-banner .btn-secondary').should('be.visible')
  })

  it('disappears after accepting', () => {
    cy.get('.cookie-banner .btn-primary').contains(/accept|tout/i).click()
    cy.get('.cookie-banner').should('not.exist')
  })

  it('shows CookieSettings panel when customize is clicked', () => {
    cy.get('.cookie-banner .btn-secondary').contains(/personnaliser|customize/i).click()
    cy.get('.cookie-preferences').should('be.visible')
  })

  it('essential cookies toggle is disabled in settings', () => {
    cy.get('.cookie-banner .btn-secondary').contains(/personnaliser|customize/i).click()
    cy.get('.cookie-preferences input[type="checkbox"]').first().should('be.disabled')
  })
})

// ─── AdBlockDetector ──────────────────────────────────────────────────────────

describe('AdBlockDetector (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('adblock message is not shown when no adblock is detected', () => {
    cy.get('.adblock-message').should('not.exist')
  })

  it('home page renders correctly regardless of adblock state', () => {
    cy.get('.terminal-wrapper').should('be.visible')
  })
})