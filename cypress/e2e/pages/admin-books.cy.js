const booksFixture = [
  {
    id: 1,
    display_title: 'Clean Code',
    display_author: 'Robert C. Martin',
    status: 'read',
    rating: 5,
    isbn: '9780132350884',
    is_featured: true,
    created_at: '2023-01-01',
  },
  {
    id: 2,
    display_title: 'The Pragmatic Programmer',
    display_author: 'Andrew Hunt',
    status: 'reading',
    rating: 4,
    isbn: '9780135957059',
    is_featured: false,
    created_at: '2023-02-01',
  },
]

const setupAdminBooks = () => {
  cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
  cy.intercept('GET', '/api/v1/books/stats', {
    body: { data: { total: 2, read: 1, reading: 1, to_read: 0 } },
  }).as('getStats')
  cy.intercept('GET', '/api/v1/books*', {
    body: { data: booksFixture, meta: { total: 2, per_page: 50 } },
  }).as('getBooks')

  cy.visit('/Moi/books', {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', 'fake-jwt-token')
        win.localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true }))
            cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
    },
  })

  cy.wait('@getMe')
  cy.get('.loading-state', { timeout: 8000 }).should('not.exist')
}

describe('Admin - Books Management', () => {
  beforeEach(setupAdminBooks)

  it('renders the admin sidebar', () => {
    cy.get('.sidebar').first().should('exist')
  })

  it('displays correct stats in the stats bar', () => {
    cy.get('.stat-item').contains('2').should('be.visible')
    cy.get('.stat-item').contains('Total').should('be.visible')
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
  })

  it('clearing search restores all books', () => {
    cy.get('.search-box input').type('Pragmatic').clear()
    cy.get('table tbody tr').should('have.length', 2)
  })

  it('renders filter buttons', () => {
    cy.get('.filters .filter-btn').should('have.length.gte', 2)
  })

  it('clicking a filter marks it as active', () => {
    cy.get('.filter-btn[aria-label="Filter by Read"]').click({ force: true })
    cy.get('.filter-btn[aria-label="Filter by Read"]').should('have.class', 'active')
  })

  it('opens Add Book modal on toolbar button click', () => {
    cy.get('.toolbar .add-btn').scrollIntoView().click({ force: true })
    cy.get('.modal-overlay').should('be.visible')
    cy.get('#modal-title').should('contain', 'Add New Book')
  })

  it('closes modal via close button', () => {
    cy.get('.toolbar .add-btn').scrollIntoView().click({ force: true })
    cy.get('.modal-close').first().click()
    cy.get('.modal-overlay').should('not.exist')
  })

  it('closes modal by clicking overlay backdrop', () => {
    cy.get('.toolbar .add-btn').scrollIntoView().click({ force: true })
    cy.get('.modal-overlay').click({ force: true })
    cy.get('.modal-overlay').should('not.exist')
  })

  it('opens edit modal when edit action is triggered', () => {
    cy.get('table tbody tr').first().find('.action-btn.edit').scrollIntoView().click({ force: true })
    cy.get('.modal-overlay').should('be.visible')
  })

  it('opens delete confirmation modal when delete action is triggered', () => {
    cy.get('table tbody tr').first().find('.action-btn.delete').scrollIntoView().click({ force: true })
    cy.get('.modal-overlay').should('be.visible')
    cy.get('.modal-overlay').should('contain.text', 'Delete')
  })

  it('submits new book via modal form', () => {
    cy.intercept('POST', '/api/v1/books', {
      statusCode: 201,
      body: { data: { id: 3, display_title: 'Refactoring', display_author: 'Martin Fowler', status: 'to_read' } },
    }).as('createBook')

    cy.get('.toolbar .add-btn').scrollIntoView().click({ force: true })
    cy.get('.modal-form').within(() => {
      cy.get('input').first().type('Refactoring')
    })
    cy.get('.modal-form button[type="submit"]').click({ force: true })
    cy.wait('@createBook')
  })
})

describe('Admin - Books redirect', () => {
  it('redirects to login when accessing without token', () => {
    cy.clearLocalStorage()
    cy.visit('/Moi/books')
    cy.url().should('include', '/login')
  })
})