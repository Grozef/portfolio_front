const sampleProject = {
  id: 101,
  name: 'portfolio-frontend',
  description: 'My personal portfolio built with Vue 3 and Vite.',
  language: 'JavaScript',
  stars: 12,
  forks: 3,
  html_url: 'https://github.com/user/portfolio-frontend',
  tags: ['Vue', 'Vite'],
  problem: 'Needed a showcase for development skills.',
  solution: 'Built a terminal-themed portfolio.',
  role: 'Solo developer',
  outcomes: 'Successfully deployed.',
}

// ─── CookieBanner component ────────────────────────────────────────────────────
// CookieBanner defaults to currentLang = 'fr'.
// "Customize" renders "Personnaliser", "Accept all" renders "Tout accepter".

describe('CookieBanner component', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('/')
  })

  it('appears on first visit before consent is given', () => {
    cy.get('.cookie-banner', { timeout: 3000 }).should('be.visible')
  })

  it('displays at least two action buttons', () => {
    cy.get('.cookie-banner').within(() => {
      cy.get('button').should('have.length.gte', 2)
    })
  })

  it('hides after clicking Accept (Tout accepter)', () => {
    cy.get('.cookie-banner').should('be.visible')
    cy.get('.cookie-banner .btn-primary').contains(/accept|tout/i).click()
    cy.get('.cookie-banner').should('not.exist')
  })

  it('shows detailed preferences panel when Customize (Personnaliser) is clicked', () => {
    cy.get('.cookie-banner .btn-secondary').contains(/personnaliser|customize/i).click()
    cy.get('.cookie-preferences').should('be.visible')
  })

  it('essential cookies checkbox is always disabled', () => {
    cy.get('.cookie-banner .btn-secondary').contains(/personnaliser|customize/i).click()
    cy.get('.cookie-preferences input[type="checkbox"]').first().should('be.disabled')
  })

  it('does not reappear after accepting and revisiting', () => {
    cy.get('.cookie-banner .btn-primary').contains(/accept|tout/i).click()
    cy.get('.cookie-banner').should('not.exist')
    cy.visit('/')
    cy.get('.cookie-banner').should('not.exist')
  })
})

// ─── FooterComponent ──────────────────────────────────────────────────────────

describe('FooterComponent', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/auth/me', { statusCode: 401, body: {} }).as('getMe')
    cy.visit('/')
  })

  it('renders footer navigation section', () => {
    cy.get('.site-footer').should('exist')
    cy.get('.footer-section h3').contains('Navigation').should('be.visible')
  })

  it('navigation column has links to main routes', () => {
    cy.get('.footer-section').contains('Navigation').parent().within(() => {
      cy.get('a[href="/"]').should('exist')
      cy.get('a[href="/projects"]').should('exist')
      cy.get('a[href="/books"]').should('exist')
      cy.get('a[href="/about"]').should('exist')
      cy.get('a[href="/contact"]').should('exist')
    })
  })

  it('legal column has links to legal pages', () => {
    cy.get('.footer-section').contains('Legal Information').parent().within(() => {
      cy.get('a[href="/legal-notice"]').should('exist')
      cy.get('a[href="/privacy-policy"]').should('exist')
      cy.get('a[href="/cookies"]').should('exist')
      cy.get('a[href="/terms"]').should('exist')
    })
  })

  it('Legal Actions link points to the 404 game', () => {
    cy.get('a[href="/404"]').should('contain', 'Legal Actions')
    cy.get('a[href="/404"]').should('have.class', 'footer-link--game')
  })

  it('Contact section is present', () => {
    cy.get('.footer-section h3').contains('Contact').should('be.visible')
  })
})

// ─── ProjectModal component ────────────────────────────────────────────────────

describe('ProjectModal component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', {
      body: { data: [sampleProject] },
    }).as('getProjects')
    cy.visit('/projects')
    cy.get('.project-card', { timeout: 5000 }).should('exist')
    cy.get('.project-card').first().click()
    cy.get('.project-modal').should('be.visible')
  })

  it('renders the modal with project title', () => {
    cy.get('.project-modal .project-title').should('be.visible')
  })

  it('modal close button closes the modal', () => {
    cy.get('.modal-close').click()
    cy.get('.project-modal').should('not.exist')
  })

  it('pressing Escape closes the modal', () => {
    cy.get('body').type('{esc}')
    cy.get('.project-modal').should('not.exist')
  })

  it('clicking the modal backdrop closes the modal', () => {
    cy.get('.project-modal').click({ force: true })
    cy.get('.project-modal').should('not.exist')
  })

  it('renders navigation dots', () => {
    cy.get('.modal-nav .nav-dot').should('have.length.gte', 1)
  })

  it('first nav dot has active class', () => {
    cy.get('.modal-nav .nav-dot').first().should('have.class', 'active')
  })

  it('first nav dot has aria-current true', () => {
    cy.get('.modal-nav .nav-dot').first().should('have.attr', 'aria-current', 'true')
  })

  it('inactive nav dots have aria-current false', () => {
    cy.get('.modal-nav .nav-dot').eq(1).should('have.attr', 'aria-current', 'false')
  })

  it('section 01 overview is present', () => {
    cy.get('.section-number').first().should('contain', '01')
  })

  it('shows metadata items with stars, forks, and language', () => {
    cy.get('.meta-label').contains('Stars').should('exist')
    cy.get('.meta-label').contains('Forks').should('exist')
    cy.get('.meta-label').contains('Language').should('exist')
  })

  it('shows scroll hint with arrow', () => {
    cy.get('.scroll-hint').should('be.visible')
    cy.get('.scroll-arrow').should('contain', '→')
  })
})