describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('renders the Admin Login heading', () => {
    cy.get('.page-title').should('contain', 'Admin Login')
  })

  it('renders the Authentication card title', () => {
    cy.get('.login-header h2').should('contain', 'Authentication')
  })

  it('renders email and password fields', () => {
    cy.get('#email').should('exist')
    cy.get('#password').should('exist')
  })

  it('renders the login submit button', () => {
    cy.get('.submit-btn').should('be.visible').and('contain', 'Login')
  })

  it('renders the back button', () => {
    cy.get('.back-btn').should('be.visible')
  })

  it('back button navigates to home', () => {
    cy.get('.back-btn').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('displays brute force protection notice', () => {
    cy.get('.login-footer').should('contain', 'brute force protection')
  })

  // ─── Password visibility toggle ───────────────────────────────────────────────

  it('password field is masked by default', () => {
    cy.get('#password').should('have.attr', 'type', 'password')
  })

  it('toggle button reveals and hides password', () => {
    cy.get('#password').type('secret123')
    cy.get('.toggle-password').click()
    cy.get('#password').should('have.attr', 'type', 'text')
    cy.get('.toggle-password').click()
    cy.get('#password').should('have.attr', 'type', 'password')
  })

  it('toggle button has correct aria-label when showing', () => {
    cy.get('.toggle-password').click()
    cy.get('.toggle-password').should('have.attr', 'aria-label', 'Hide password')
  })

  it('toggle button has correct aria-label when hidden', () => {
    cy.get('.toggle-password').should('have.attr', 'aria-label', 'Show password')
  })

  // ─── Successful login ─────────────────────────────────────────────────────────
  // After login the app calls router.push('/books') — this is the intended behavior.

  it('redirects to books page after successful login', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 200,
      body: {
        data: {
          token: 'valid-jwt-token',
          user: { id: 1, name: 'Francois', email: 'admin@example.com' },
        },
      },
    }).as('login')
    cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
    cy.intercept('GET', '/api/v1/books*', { fixture: 'books-list.json' }).as('getBooks')
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('getCarousel')

    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('correct-password')
    cy.get('.submit-btn').click()

    cy.wait('@login')
    cy.url().should('include', '/books')
  })

  // ─── Failed login ─────────────────────────────────────────────────────────────

  it('shows error message on invalid credentials', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('failLogin')

    cy.get('#email').type('wrong@example.com')
    cy.get('#password').type('wrongpassword')
    cy.get('.submit-btn').click()

    cy.wait('@failLogin')
    cy.get('.error-message').should('be.visible')
  })

  it('shows rate limit message and disables form on 429', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 429,
      body: { message: 'Too many attempts.', retry_after: 60 },
    }).as('rateLimit')

    cy.get('#email').type('brute@example.com')
    cy.get('#password').type('badpassword')
    cy.get('.submit-btn').click()

    cy.wait('@rateLimit')
    cy.get('.error-message').should('be.visible')
    cy.get('.countdown').should('be.visible')
    cy.get('.submit-btn').should('be.disabled')
    cy.get('#email').should('be.disabled')
    cy.get('#password').should('be.disabled')
  })

  // ─── Redirect when already authenticated ─────────────────────────────────────

  it('redirects authenticated users away from login page', () => {
    cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
    cy.intercept('GET', '/api/v1/books*', { fixture: 'books-list.json' }).as('getBooks')
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('getCarousel')

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'valid-token')
      },
    })
    cy.url().should('include', '/Moi')
  })

  // ─── Accessibility ────────────────────────────────────────────────────────────

  it('submit button has aria-label', () => {
    cy.get('.submit-btn').should('have.attr', 'aria-label', 'Login to admin panel')
  })

  it('email field has autocomplete attribute', () => {
    cy.get('#email').should('have.attr', 'autocomplete', 'email')
  })
})