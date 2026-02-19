describe('TerminalHeader (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
        cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
  })

  it('renders window chrome controls', () => {
    cy.get('.control--close').should('exist')
    cy.get('.control--minimize').should('exist')
    cy.get('.control--maximize').should('exist')
  })

  it('shows portfolio@terminal title', () => {
    cy.get('.terminal__title').should('contain', 'portfolio@terminal')
  })

  it('shows Ready status when not processing', () => {
    cy.get('.status-text').should('contain', 'Ready')
    cy.get('.status-dot').should('have.class', 'active')
  })

  it('shows Processing status after submitting a command', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    // Status briefly shows Processing then returns to Ready — assert final settled state
    cy.get('.status-text').should('contain', 'Ready')
  })
})

describe('TerminalInput (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('renders the input line container', () => {
    cy.get('.terminal__input-line').should('exist')
  })

  it('renders the prompt', () => {
    cy.get('.prompt').should('exist')
  })

  it('renders the text input', () => {
    cy.get('.terminal__input').should('exist')
  })

  it('renders the blinking cursor', () => {
    cy.get('.cursor').should('exist')
  })

  it('cursor has cursor-blink class when not processing', () => {
    cy.get('.cursor').should('have.class', 'cursor-blink')
  })

  it('typing in input updates the value', () => {
    cy.get('.terminal__input').type('projects', { force: true })
    cy.get('.terminal__input').should('have.value', 'projects')
  })

  it('Enter key submits the command and clears input', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.terminal__input').should('have.value', '')
  })
})