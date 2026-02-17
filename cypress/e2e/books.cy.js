describe('Books page - unauthenticated visitor', () => {
  beforeEach(() => {
    // Return 401 so authStore.isAuthenticated stays false without hitting real backend
    cy.intercept('GET', '/api/v1/auth/me', { statusCode: 401, body: { message: 'Unauthenticated' } }).as('getMe')
    cy.intercept('GET', '/api/v1/books*', { fixture: 'books-list.json' }).as('getBooks')
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('getCarousel')
    cy.visit('/books')
  })

  it('renders the Library title', () => {
    cy.get('.page-title').should('contain', 'Library')
  })

  it('shows Admin login button for unauthenticated users', () => {
    cy.get('.login-btn').should('be.visible').and('contain', 'Admin')
  })

  it('does not show Add Book button for unauthenticated users', () => {
    cy.get('.add-btn').should('not.exist')
  })

  it('navigates to login when Admin button is clicked', () => {
    cy.get('.login-btn').click()
    cy.url().should('include', '/login')
  })

  it('shows portfolio intro section for visitors', () => {
    cy.get('.portfolio-intro').should('be.visible')
    cy.get('.portfolio-intro h2').should('contain', 'Why This Page Exists')
  })

  it('renders four tech showcase points', () => {
    cy.get('.tech-point').should('have.length', 4)
  })

  it('back button navigates to home', () => {
    cy.get('.back-btn').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})

describe('Books page - authenticated admin', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
    cy.intercept('GET', '/api/v1/books/stats', {
      body: { data: { total: 2, read: 1, reading: 1, to_read: 0 } },
    }).as('getStats')
    cy.intercept('GET', '/api/v1/books*', { fixture: 'books-list.json' }).as('getBooks')
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('getCarousel')

    cy.visit('/books', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-jwt-token')
      },
    })

    cy.wait('@getMe')
  })

  it('shows admin action buttons when authenticated', () => {
    cy.get('.add-btn').should('be.visible')
    cy.get('.logout-btn').should('be.visible')
  })

  it('does not show portfolio intro for admin', () => {
    cy.get('.portfolio-intro').should('not.exist')
  })

  it('logout button clears session and redirects', () => {
    cy.intercept('POST', '/api/v1/auth/logout', { statusCode: 200, body: {} }).as('logout')
    cy.get('.logout-btn').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })
})