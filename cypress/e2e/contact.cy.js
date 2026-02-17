describe('Contact page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.intercept('GET', '/api/v1/weather*', {
      body: { data: { temp: 12, city: 'Lyon', condition: 'clouds' } },
    }).as('getWeather')
    cy.visit('/contact')
  })

  // ─── Layout ───────────────────────────────────────────────────────────────────

  it('renders the page heading', () => {
    cy.get('.page-title').should('contain', 'Get in touch')
    cy.get('.page-subtitle').should('be.visible')
  })

  it('displays contact information items', () => {
    cy.get('.info-item').should('have.length.gte', 3)
    cy.get('.info-item').contains('Email').should('be.visible')
    cy.get('.info-item').contains('Location').should('be.visible')
  })

  it('email link points to correct address', () => {
    cy.get('a[href^="mailto:"]')
      .should('have.attr', 'href', 'mailto:francois.lisowski@proton.me')
  })

  it('shows Lyon as location', () => {
    cy.get('.info-item').contains('Lyon, France').should('be.visible')
  })

  it('displays easter egg progress section', () => {
    cy.get('.easter-egg-progress').should('be.visible')
    cy.get('.easter-egg-progress h3').should('contain', 'Easter Eggs Progress')
    cy.get('.progress-info').should('be.visible')
  })

  // ─── Form structure ───────────────────────────────────────────────────────────

  it('renders all form fields', () => {
    cy.get('#name').should('exist')
    cy.get('#email').should('exist')
    cy.get('#subject').should('exist')
    cy.get('#message').should('exist')
  })

  it('renders the submit button', () => {
    cy.get('.contact-form .submit-btn[aria-label="Send contact message"]').should('be.visible')
  })

  it('shows character count for name field', () => {
    cy.get('.char-count').first().should('be.visible')
  })

  it('char count updates as user types in name', () => {
    cy.get('#name').type('John')
    cy.get('.char-count').first().should('contain', '4')
  })

  // ─── Submit button state ──────────────────────────────────────────────────────

  it('submit button is disabled when form is empty', () => {
    cy.get('.contact-form .submit-btn[aria-label="Send contact message"]').should('be.disabled')
  })

  it('submit button becomes enabled when all fields are filled with valid data', () => {
    cy.get('#name').type('Alice Dupont')
    cy.get('#email').type('alice@example.com')
    cy.get('#subject').type('Hello from Cypress')
    cy.get('#message').type('This is a test message with sufficient content.')
    cy.get('.contact-form .submit-btn[aria-label="Send contact message"]').should('not.be.disabled')
  })

  // ─── Field-level validation (blur-triggered) ──────────────────────────────────

  it('shows name error when name field is blurred while empty', () => {
    cy.get('#name').focus().blur()
    cy.get('#name-error').should('be.visible')
  })

  it('shows email error when blurred with invalid email', () => {
    cy.get('#email').type('not-an-email').blur()
    cy.get('#email-error').should('be.visible')
  })

  it('shows subject error when subject field is blurred while empty', () => {
    cy.get('#subject').focus().blur()
    cy.get('#subject-error').should('be.visible')
  })

  it('shows message error when message field is blurred while empty', () => {
    cy.get('#message').focus().blur()
    cy.get('#message-error').should('be.visible')
  })

  it('name error clears after typing valid name', () => {
    cy.get('#name').focus().blur()
    cy.get('#name-error').should('be.visible')
    cy.get('#name').type('Alice')
    cy.get('#name-error').should('not.exist')
  })

  // ─── Successful submission ────────────────────────────────────────────────────

  it('submits valid form and shows success feedback', () => {
    cy.intercept('POST', '/api/v1/contact', {
      statusCode: 200,
      body: { message: 'Message sent successfully' },
    }).as('sendMessage')

    cy.get('#name').type('Alice Dupont')
    cy.get('#email').type('alice@example.com')
    cy.get('#subject').type('Hello from Cypress')
    cy.get('#message').type('This is a test message from Cypress e2e tests with enough content.')

    cy.get('.contact-form .submit-btn[aria-label="Send contact message"]').should('not.be.disabled').click()

    cy.wait('@sendMessage')
    cy.get('.success-message, .alert-success, [class*="success"]').should('exist')
  })

  it('handles server error on form submission', () => {
    cy.intercept('POST', '/api/v1/contact', {
      statusCode: 500,
      body: { message: 'Server error' },
    }).as('failMessage')

    cy.get('#name').type('Alice')
    cy.get('#email').type('alice@example.com')
    cy.get('#subject').type('Test')
    cy.get('#message').type('Test message body for error handling.')

    cy.get('.contact-form .submit-btn[aria-label="Send contact message"]').should('not.be.disabled').click()

    cy.wait('@failMessage')
    cy.get('[class*="error"]').should('exist')
  })
})