const sampleProject = {
  id: 1,
  name: 'portfolio-frontend',
  description: 'My personal portfolio built with Vue 3',
  language: 'JavaScript',
  stars: 12,
  forks: 3,
  html_url: 'https://github.com/user/portfolio-frontend',
  tags: ['Vue', 'Vite'],
  problem: 'Needed a showcase for development skills',
  solution: 'Built a terminal-themed portfolio',
  role: 'Solo developer',
  outcomes: 'Successfully deployed',
}

// ─── CookieBanner ─────────────────────────────────────────────────────────────

describe('CookieBanner component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('appears on first visit before consent is given', () => {
    cy.get('.cookie-banner').should('be.visible')
  })

  it('displays at least two action buttons', () => {
    cy.get('.cookie-banner button').should('have.length.gte', 2)
  })

  it('hides after clicking Accept (Tout accepter)', () => {
    cy.get('.cookie-banner').contains('Tout accepter').click()
    cy.get('.cookie-banner').should('not.exist')
  })

  it('shows detailed preferences panel when Customize (Personnaliser) is clicked', () => {
    cy.get('.cookie-banner').contains('Personnaliser').click()
    cy.get('.cookie-preferences').should('be.visible')
  })

  it('essential cookies checkbox is always disabled in settings', () => {
    cy.get('.cookie-banner').contains('Personnaliser').click()
    cy.get('.cookie-preferences input[type="checkbox"]').first().should('be.disabled')
  })

  it('does not reappear after accepting and revisiting', () => {
    cy.get('.cookie-banner').contains('Tout accepter').click()
    cy.get('.cookie-banner').should('not.exist')
    cy.visit('/')
    cy.get('.cookie-banner').should('not.exist')
  })
})

// ─── FooterComponent ──────────────────────────────────────────────────────────

describe('FooterComponent', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true }))
      },
    })
  })

  it('renders footer navigation section', () => {
    cy.get('.site-footer .footer-section').should('exist')
  })

  it('navigation column has links to main routes', () => {
    cy.get('.site-footer').find('a[href="/"]').should('exist')
    cy.get('.site-footer').find('a[href="/projects"]').should('exist')
  })

  it('legal column has links to legal pages', () => {
    cy.get('.site-footer').find('a[href="/legal-notice"]').should('exist')
    cy.get('.site-footer').find('a[href="/privacy-policy"]').should('exist')
  })

  it('Legal Actions link points to the 404 game', () => {
    cy.get('.site-footer').find('a[href="/404"]').should('exist')
  })

  it('Contact section is present', () => {
    cy.get('.site-footer .footer-section h3').contains('Contact').should('exist')
  })
})

// ─── ProjectModal ─────────────────────────────────────────────────────────────

describe('ProjectModal component', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/github/repositories*', {
      body: { data: [sampleProject] },
    }).as('getProjects')
    cy.intercept('GET', '**/api/v1/github/repositories/pinned*', {
      body: { data: [sampleProject] },
    }).as('getPinned')
    cy.intercept('GET', '**/api/v1/github/repositories/*', {
      body: { data: sampleProject },
    }).as('getRepo')

    cy.visit('/projects', {
      onBeforeLoad(win) {
        win.localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true }))
      },
    })
    cy.wait('@getProjects', { timeout: 8000 })
    cy.get('.loading-state', { timeout: 6000 }).should('not.exist')
    cy.get('.project-card', { timeout: 6000 }).should('exist')
  })

  it('renders the modal with project title', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.project-modal .project-title').should('be.visible')
  })

  it('modal close button closes the modal', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-close').click()
    cy.get('.project-modal').should('not.exist')
  })

  it('pressing Escape closes the modal', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('body').type('{esc}')
    cy.get('.project-modal').should('not.exist')
  })

  it('clicking the modal backdrop closes the modal', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.project-modal').click(10, 10, { force: true })
    cy.get('.project-modal').should('not.exist')
  })

  it('renders navigation dots', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-nav .nav-dot').should('have.length.gte', 1)
  })

  it('first nav dot has active class', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-nav .nav-dot').first().should('have.class', 'active')
  })

  it('first nav dot has aria-current true', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-nav .nav-dot').first().should('have.attr', 'aria-current', 'true')
  })

  it('inactive nav dots have aria-current false', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-nav .nav-dot').not('.active').each(($dot) => {
      cy.wrap($dot).should('have.attr', 'aria-current', 'false')
    })
  })

  it('section 01 overview is present', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.modal-section').should('exist')
  })

  it('shows metadata items with stars, forks, and language', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.meta-item').should('have.length.gte', 1)
  })

  it('shows scroll hint with arrow', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
    cy.get('.scroll-hint').should('exist')
  })
})