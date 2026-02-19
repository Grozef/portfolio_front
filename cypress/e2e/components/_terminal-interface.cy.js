describe('TerminalInterface (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.clearLocalStorage()
    cy.visit('/')
        cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
  })

  it('renders the terminal wrapper', () => {
    cy.get('.terminal-wrapper').should('exist')
  })

  it('renders the inner terminal element', () => {
    cy.get('.terminal').should('exist')
  })

  it('shows quick nav banner by default', () => {
    cy.get('.quick-nav').should('be.visible')
  })

  it('quick nav contains GUI mode button', () => {
    cy.get('.quick-nav__btn').should('contain', 'Switch to GUI Mode')
  })

  it('quick nav has a close button', () => {
    cy.get('.quick-nav__close').should('exist')
  })

  it('close button dismisses the quick nav banner', () => {
    cy.get('.quick-nav__close').click()
    cy.get('.quick-nav').should('not.exist')
  })

  it('renders the terminal input line', () => {
    cy.get('.terminal__input-line').should('exist')
  })

  it('renders the terminal input field', () => {
    cy.get('.terminal__input').should('exist')
  })

  it('terminal input has a prompt', () => {
    cy.get('.prompt').should('exist')
  })

  it('renders the blinking cursor', () => {
    cy.get('.cursor').should('exist')
  })

  it('renders window chrome controls', () => {
    cy.get('.control--close').should('exist')
    cy.get('.control--minimize').should('exist')
    cy.get('.control--maximize').should('exist')
  })

  it('shows portfolio@terminal title', () => {
    cy.get('.terminal__title').should('contain', 'portfolio@terminal')
  })

  it('shows Ready status initially', () => {
    cy.get('.status-text').should('contain', 'Ready')
  })

  it('status dot has active class when not processing', () => {
    cy.get('.status-dot').should('have.class', 'active')
  })

  it('accepts text input', () => {
    cy.get('.terminal__input').type('help', { force: true })
    cy.get('.terminal__input').should('have.value', 'help')
  })

  it('pressing Enter processes a command', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.terminal__output, .output-line, .history-entry, .output-block').should('exist')
  })
})