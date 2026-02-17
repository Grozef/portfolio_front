const setupAdminBooks = () => {
  cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
  cy.intercept('GET', '/api/v1/books/stats', {
    body: { data: { total: 2, read: 1, reading: 1, to_read: 0 } },
  }).as('getStats')
  cy.intercept('GET', '/api/v1/books*', { fixture: 'books-list.json' }).as('getBooks')

  cy.visit('/Moi/books', {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', 'fake-jwt-token')
    },
  })

  cy.wait('@getMe')
  cy.get('.loading-state', { timeout: 5000 }).should('not.exist')
}

describe('Admin - Books Management', () => {
  beforeEach(setupAdminBooks)

  it('renders the admin sidebar', () => {
    cy.get('.sidebar').should('be.visible')
  })

  it('displays correct stats in the stats bar', () => {
    cy.get('.stat-item').contains('2').should('be.visible')
    cy.get('.stat-item').contains('Total').should('be.visible')
    cy.get('.stat-item').contains('Read').should('be.visible')
    cy.get('.stat-item').contains('Reading').should('be.visible')
    cy.get('.stat-item').contains('To Read').should('be.visible')
  })

  it('renders the books table', () => {
    cy.get('.books-table table').should('be.visible')
    cy.get('table thead th').should('have.length.gte', 6)
  })

  it('renders a row per book from fixture', () => {
    cy.get('table tbody tr').should('have.length', 2)
  })

  it('displays book title and author in first row', () => {
    cy.get('.book-title').first().should('contain', 'Clean Code')
    cy.get('.book-author').first().should('contain', 'Robert C. Martin')
  })

  it('displays status badge per row', () => {
    cy.get('.status-badge').should('have.length.gte', 1)
  })

  it('search box filters the books table', () => {
    cy.get('.search-box input').type('Pragmatic')
    cy.get('table tbody tr').should('have.length', 1)
    cy.get('.book-title').should('contain', 'The Pragmatic Programmer')
    cy.get('.book-title').should('not.contain', 'Clean Code')
  })

  it('clearing search restores all books', () => {
    cy.get('.search-box input').type('Pragmatic').clear()
    cy.get('table tbody tr').should('have.length', 2)
  })

  it('renders filter buttons', () => {
    cy.get('.filters .filter-btn').should('have.length.gte', 2)
  })

  it('clicking a filter marks it as active', () => {
    cy.get('.filter-btn').contains('read').click()
    cy.get('.filter-btn').contains('read').should('have.class', 'active')
  })

  it('opens Add Book modal on toolbar button click', () => {
    cy.get('.toolbar .add-btn').click()
    cy.get('.modal-overlay').should('be.visible')
    cy.get('#modal-title').should('contain', 'Add New Book')
  })

  it('closes modal via close button', () => {
    cy.get('.toolbar .add-btn').click()
    cy.get('.modal-close').first().click()
    cy.get('.modal-overlay').should('not.exist')
  })

  it('closes modal by clicking overlay backdrop', () => {
    cy.get('.toolbar .add-btn').click()
    cy.get('.modal-overlay').click({ force: true })
    cy.get('.modal-overlay').should('not.exist')
  })

  it('opens edit modal when edit action is triggered', () => {
    cy.get('table tbody tr').first().find('[aria-label*="Edit"], .btn-edit, [class*="edit"]').first().click()
    cy.get('.modal-overlay').should('be.visible')
  })

  it('opens delete confirmation modal when delete action is triggered', () => {
    cy.get('table tbody tr').first().find('[aria-label*="Delete"], .btn-delete, [class*="delete"]').first().click()
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-overlay').should('contain.text', 'Delete')
  })

  it('submits new book via modal form', () => {
    cy.intercept('POST', '/api/v1/books', {
      statusCode: 201,
      body: {
        data: { id: 3, display_title: 'Refactoring', display_author: 'Martin Fowler', status: 'to_read' },
      },
    }).as('createBook')

    cy.get('.toolbar .add-btn').click()
    cy.get('.modal-form').within(() => {
      cy.get('input').first().type('Refactoring')
    })
    cy.get('.modal-form button[type="submit"]').click()
    cy.wait('@createBook')
  })

  it('redirects to login when accessing without token', () => {
    cy.visit('/Moi/books')
    cy.url().should('include', '/login')
  })
})