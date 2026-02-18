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

// ─── ProjectModal ─────────────────────────────────────────────────────────────

describe('ProjectModal (E2E)', () => {
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

    cy.visit('/projects')
    cy.wait('@getProjects', { timeout: 8000 })
    cy.get('.loading-state', { timeout: 6000 }).should('not.exist')
    cy.get('.project-card', { timeout: 6000 }).should('exist')
  })

  it('modal is not visible before clicking a card', () => {
    cy.get('.project-modal').should('not.exist')
  })

  it('opens modal when a project card is clicked', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal', { timeout: 8000 }).should('be.visible')
  })

  it('modal displays project title', () => {
    cy.get('.project-card').first().click()
    cy.wait('@getRepo', { timeout: 6000 })
    cy.get('.project-modal .project-title', { timeout: 8000 }).should('be.visible')
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

  it('nav dots are rendered in the open modal', () => {
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
})

// ─── FakeAdminTerminal ────────────────────────────────────────────────────────

describe('FakeAdminTerminal (E2E)', () => {
  beforeEach(() => {
    cy.visit('/admin')
    cy.get('.fake-admin-terminal', { timeout: 4000 }).should('exist')
  })

  it('renders the SSH terminal header', () => {
    cy.get('.terminal-header').should('exist')
    cy.get('.header-title').should('contain', 'SSH')
  })

  it('renders terminal window chrome buttons', () => {
    cy.get('.header-buttons .btn').should('have.length', 3)
  })

  it('renders the terminal input field', () => {
    cy.get('.terminal-input').should('exist')
  })

  it('accepts text input in the terminal', () => {
    cy.get('.terminal-input').type('help', { force: true })
    cy.get('.terminal-input').should('have.value', 'help')
  })

  it('pressing Enter submits a command and appends a line', () => {
    cy.get('.terminal-input').type('help{enter}', { force: true })
    cy.get('.terminal-line').should('have.length.gte', 1)
  })

  it('close button navigates back to home', () => {
    cy.get('.header-buttons .btn.close').click({ force: true })
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})