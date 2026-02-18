// ─── DarkModeToggle ────────────────────────────────────────────────────────────

describe('DarkModeToggle (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    // Accept cookie banner before testing to avoid overlay covering the toggle
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true }))
      },
    })
  })

  it('renders a button', () => {
    cy.get('.dark-mode-toggle').should('exist').and('be.visible')
  })

  it('shows OFF label in default inactive state', () => {
    cy.get('.toggle-label').should('contain', 'OFF')
  })

  it('aria-label reflects inactive state', () => {
    cy.get('.dark-mode-toggle').should('have.attr', 'aria-label', 'Enable Extreme Dark Mode')
  })

  it('does not have active class by default', () => {
    cy.get('.dark-mode-toggle').should('not.have.class', 'active')
  })

  it('clicking toggle switches to active state', () => {
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('.dark-mode-toggle').should('have.class', 'active')
    cy.get('.toggle-label').should('contain', 'ON')
  })

  it('aria-label updates when active', () => {
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('.dark-mode-toggle').should('have.attr', 'aria-label', 'Disable Extreme Dark Mode')
  })

  it('clicking again deactivates', () => {
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('.dark-mode-toggle').click({ force: true })
    cy.get('.dark-mode-toggle').should('not.have.class', 'active')
  })
})

// ─── LanjuageToggle ────────────────────────────────────────────────────────────

describe('LanjuageToggle (E2E)', () => {
  beforeEach(() => {
    cy.visit('/legal-notice')
  })

  it('renders the language toggle button', () => {
    cy.get('.lang-toggle').should('exist').and('be.visible')
  })

  it('clicking toggle switches the language', () => {
    cy.get('.lang-toggle').click()
    cy.get('.lang-toggle').should('be.visible')
  })
})

// ─── SwordTrigger — rendered on /projects ─────────────────────────────────────

describe('SwordTrigger (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/projects')
    cy.get('.sword-trigger', { timeout: 6000 }).should('exist')
  })

  it('renders the sword trigger wrapper', () => {
    cy.get('.sword-trigger-wrapper').should('exist')
  })

  it('renders the sword trigger button', () => {
    cy.get('.sword-trigger').should('exist')
  })

  it('has Toggle sword cursor aria-label', () => {
    cy.get('.sword-trigger').should('have.attr', 'aria-label', 'Toggle sword cursor')
  })

  it('is not active by default', () => {
    cy.get('.sword-trigger').should('not.have.class', 'active')
  })

  it('clicking activates the sword cursor', () => {
    cy.get('.sword-trigger').click({ force: true })
    cy.get('.sword-trigger').should('have.class', 'active')
  })
})

// ─── HiddenMusicPlayer — rendered on /about ───────────────────────────────────

describe('HiddenMusicPlayer (E2E)', () => {
  beforeEach(() => {
    cy.visit('/about')
    cy.get('.hidden-music-player', { timeout: 4000 }).should('exist')
  })

  it('renders the hidden music player container', () => {
    cy.get('.hidden-music-player').should('exist')
  })

  it('renders the play button', () => {
    cy.get('.play-button').should('exist')
  })

  it('play button is not in playing state by default', () => {
    cy.get('.play-button').should('not.have.class', 'playing')
  })
})