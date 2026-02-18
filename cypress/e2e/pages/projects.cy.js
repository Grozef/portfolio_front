const projectsFixture = [
  {
    id: 101,
    name: 'portfolio-frontend',
    description: 'My personal portfolio built with Vue 3',
    language: 'JavaScript',
    stars: 12,
    forks: 3,
    html_url: 'https://github.com/user/portfolio-frontend',
    tags: ['Vue', 'Vite'],
  },
  {
    id: 102,
    name: 'api-backend',
    description: 'Laravel REST API',
    language: 'PHP',
    stars: 5,
    forks: 1,
    html_url: 'https://github.com/user/api-backend',
    tags: ['Laravel', 'PHP'],
  },
]

describe('Projects page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: projectsFixture } }).as('getProjects')
    cy.visit('/projects')
  })

  it('renders the page title', () => {
    cy.get('.page-title').should('contain', 'Projects')
  })

  it('renders the back button', () => {
    cy.get('.back-btn').should('be.visible').and('contain', 'Terminal')
  })

  it('navigates back to home when back button is clicked', () => {
    cy.get('.back-btn').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('shows loading state while fetching', () => {
    cy.intercept('GET', '/api/v1/github*', (req) => {
      req.reply({ delay: 500, body: { data: projectsFixture } })
    }).as('slowProjects')
    cy.visit('/projects')
    cy.get('.loading-state').should('be.visible')
    cy.get('.loading-state p').should('contain', 'Fetching repositories')
  })

  it('displays project counter after load', () => {
    cy.get('.count-current').should('be.visible')
    cy.get('.count-total').should('be.visible')
    cy.get('.count-divider').should('contain', '/')
  })

  it('renders project articles with titles', () => {
    cy.get('.project-card').should('have.length.gte', 1)
    cy.get('.card-title').first().should('be.visible')
  })

  it('renders card descriptions', () => {
    cy.get('.card-description').first().should('be.visible')
  })

  it('first card has active class', () => {
    cy.get('.project-card').first().should('have.class', 'active')
  })

  it('project cards have proper aria attributes', () => {
    cy.get('.project-card')
      .first()
      .should('have.attr', 'role', 'article')
      .and('have.attr', 'aria-label')
  })

  it('opens project modal when a card is clicked', () => {
    cy.get('.project-card').first().click()
    cy.get('.project-modal').should('be.visible')
  })

  it('modal displays project title', () => {
    cy.get('.project-card').first().click()
    cy.get('.project-modal .project-title').should('be.visible')
  })

  it('modal close button closes the modal', () => {
    cy.get('.project-card').first().click()
    cy.get('.project-modal').should('be.visible')
    cy.get('.modal-close').click()
    cy.get('.project-modal').should('not.exist')
  })

  it('clicking modal backdrop closes the modal', () => {
    cy.get('.project-card').first().click()
    cy.get('.project-modal').should('be.visible')
    cy.get('.project-modal').click({ force: true })
    cy.get('.project-modal').should('not.exist')
  })

  it('modal navigation dots are rendered', () => {
    cy.get('.project-card').first().click()
    cy.get('.modal-nav .nav-dot').should('have.length.gte', 1)
  })
})