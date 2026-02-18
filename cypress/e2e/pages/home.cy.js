describe('Home page - Terminal Interface', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('renders the logo and author name', () => {
    cy.get('.logo-text').should('contain', 'Lisowski François')
    cy.get('.logo-symbol').should('be.visible')
  })

  it('renders the desktop navigation with all links', () => {
    cy.get('.desktop-nav').should('be.visible')
    cy.get('.desktop-nav .nav-link').should('have.length', 5)
    cy.get('.desktop-nav').contains('terminal').should('have.attr', 'href', '/')
    cy.get('.desktop-nav').contains('projects').should('have.attr', 'href', '/projects')
    cy.get('.desktop-nav').contains('books').should('have.attr', 'href', '/books')
    cy.get('.desktop-nav').contains('about').should('have.attr', 'href', '/about')
    cy.get('.desktop-nav').contains('contact').should('have.attr', 'href', '/contact')
  })

  it('shows the available-for-work status indicator', () => {
    cy.get('.status-indicator').should('be.visible')
    cy.get('.status-text').should('contain', 'Available for work')
  })

  it('renders the terminal interface', () => {
    cy.get('.terminal-wrapper').should('be.visible')
  })

  it('shows the mobile menu button on small viewports', () => {
    cy.viewport(375, 812)
    cy.get('.mobile-menu-btn').should('be.visible')
  })

  it('toggles mobile menu open and closed', () => {
    cy.viewport(375, 812)
    cy.get('.mobile-nav').should('not.have.class', 'open')
    cy.get('.mobile-menu-btn').click()
    cy.get('.mobile-nav').should('have.class', 'open')
    cy.get('.mobile-menu-btn').click()
    cy.get('.mobile-nav').should('not.have.class', 'open')
  })

  it('sets aria-expanded correctly on mobile toggle', () => {
    cy.viewport(375, 812)
    cy.get('.mobile-menu-btn').should('have.attr', 'aria-expanded', 'false')
    cy.get('.mobile-menu-btn').click()
    cy.get('.mobile-menu-btn').should('have.attr', 'aria-expanded', 'true')
  })

  it('closes mobile menu when a nav link is clicked', () => {
    cy.viewport(375, 812)
    cy.get('.mobile-menu-btn').click()
    cy.get('.mobile-nav').should('have.class', 'open')
    cy.get('.mobile-nav .nav-link').first().click()
    cy.get('.mobile-nav').should('not.have.class', 'open')
  })

  it('project modal is not visible on initial load', () => {
    cy.get('.project-modal').should('not.exist')
  })

  it('navigation has proper aria labels', () => {
    cy.get('nav[aria-label="Primary navigation"]').should('exist')
    cy.get('nav[aria-label="Mobile navigation"]').should('exist')
  })
})