// ─── WeatherBackground ────────────────────────────────────────────────────────

describe('WeatherBackground (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/weather*', {
      body: { data: { temp: 12, city: 'Lyon', condition: 'clouds' } },
    }).as('getWeather')
    cy.visit('/contact')
  })

  it('renders the weather background container', () => {
    cy.get('.weather-background').should('exist')
  })

  it('renders the weather canvas', () => {
    cy.get('.weather-canvas').should('exist')
  })

  it('weather canvas has aria-hidden', () => {
    cy.get('.weather-canvas').should('have.attr', 'aria-hidden', 'true')
  })
})

// ─── GrainOverlay ─────────────────────────────────────────────────────────────

describe('GrainOverlay (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('renders the grain overlay canvas', () => {
    cy.get('.grain-overlay').should('exist')
  })

  it('grain overlay has aria-hidden', () => {
    cy.get('.grain-overlay').should('have.attr', 'aria-hidden', 'true')
  })
})

// ─── SwordCursor — rendered on /projects ─────────────────────────────────────

describe('SwordCursor (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/projects')
    cy.get('.sword-trigger', { timeout: 6000 }).should('exist')
  })

  it('sword trigger button is present on the projects page', () => {
    cy.get('.sword-trigger').should('exist')
  })

  it('sword trigger has correct aria-label', () => {
    cy.get('.sword-trigger').should('have.attr', 'aria-label', 'Toggle sword cursor')
  })

  it('clicking sword trigger activates sword mode', () => {
    cy.get('.sword-trigger').click({ force: true })
    cy.get('.sword-trigger').should('have.class', 'active')
  })

  it('clicking sword trigger again deactivates sword mode', () => {
    cy.get('.sword-trigger').click({ force: true })
    cy.get('.sword-trigger').should('have.class', 'active')
    cy.get('.sword-trigger').click({ force: true })
    cy.get('.sword-trigger').should('not.have.class', 'active')
  })
})

// ─── ExtremeDarkMode ──────────────────────────────────────────────────────────

describe('ExtremeDarkMode (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('dark mode toggle is present on home page', () => {
    cy.get('.dark-mode-toggle').should('exist')
  })

  it('dark mode is inactive by default', () => {
    cy.get('.dark-mode-toggle').should('not.have.class', 'active')
    cy.get('.toggle-label').should('contain', 'OFF')
  })

  it('clicking toggle activates extreme dark mode', () => {
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('.dark-mode-toggle').should('have.class', 'active')
    cy.get('.toggle-label').should('contain', 'ON')
  })
})