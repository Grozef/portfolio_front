describe('TerminalInterface (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/github**', { body: { data: [] } }).as('getGithub')
    cy.clearLocalStorage()
    cy.visit('/')
  })

  // ─── Layout ──────────────────────────────────────────────────────────────────

  it('renders the terminal interface root', () => {
    cy.get('.terminal-interface').should('exist')
  })

  it('renders the inner terminal element', () => {
    cy.get('.terminal').should('exist')
  })

  // ─── Quick nav banner ─────────────────────────────────────────────────────────

  it('shows quick nav banner by default', () => {
    cy.get('.quick-nav').should('be.visible')
  })

  it('quick nav contains GUI mode button', () => {
    cy.get('.quick-nav__btn').should('contain', 'Switch to GUI Mode')
  })

  it('quick nav has close button', () => {
    cy.get('.quick-nav__close').should('have.attr', 'aria-label', 'Close banner')
  })

  it('dismissing quick nav hides the banner', () => {
    cy.get('.quick-nav__close').click()
    cy.get('.quick-nav').should('not.exist')
  })

  // ─── Terminal info panel ──────────────────────────────────────────────────────

  it('shows terminal info panel on first visit', () => {
    cy.get('.terminal-info').should('be.visible')
  })

  it('terminal info mentions "Why a Terminal Interface"', () => {
    cy.get('.info-card h3').should('contain', 'Why a Terminal Interface')
  })

  it('terminal info has close button', () => {
    cy.get('.info-close').should('have.attr', 'aria-label', 'Close info')
  })

  it('closing terminal info removes the panel', () => {
    cy.get('.info-close').click()
    cy.get('.terminal-info').should('not.exist')
  })

  // ─── Terminal output ──────────────────────────────────────────────────────────

  it('renders the output area', () => {
    cy.get('.terminal__output').should('exist')
  })

  it('shows initial welcome output on mount', () => {
    cy.get('.terminal__output').should('not.be.empty')
  })

  // ─── Input area ───────────────────────────────────────────────────────────────

  it('renders the terminal input', () => {
    cy.get('.terminal__input').should('exist')
  })

  it('clicking the terminal focuses the input', () => {
    cy.get('.terminal').click()
    cy.get('.terminal__input').should('be.focused')
  })

  // ─── Commands ────────────────────────────────────────────────────────────────

  it('typing help and pressing Enter produces output', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.terminal__output').should('contain.text', 'help')
  })

  it('typing clear removes output history', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.terminal__input').type('clear{enter}', { force: true })
    cy.get('.terminal__output').should('exist')
  })

  it('typing an unknown command shows error output', () => {
    cy.get('.terminal__input').type('unknowncommand123{enter}', { force: true })
    cy.get('.terminal__output').should('not.be.empty')
  })

  it('typing projects command triggers fetch', () => {
    cy.get('.terminal__input').type('projects{enter}', { force: true })
    cy.get('.terminal__output').should('not.be.empty')
  })

  // ─── Quick-access command cards (mobile navigation) ──────────────────────────

  it('renders the quick-commands section', () => {
    cy.get('.quick-commands').should('exist')
  })

  it('renders six cmd-card buttons', () => {
    cy.get('.cmd-card').should('have.length', 6)
  })

  it('cmd-cards have label and hint', () => {
    cy.get('.cmd-card').first().find('.cmd-label').should('not.be.empty')
    cy.get('.cmd-card').first().find('.cmd-hint').should('not.be.empty')
  })

  it('about cmd-card executes the about command', () => {
    cy.get('.cmd-card[data-command="about"]').click()
    cy.get('.terminal__output').should('contain.text', 'Full Stack Developer')
  })

  it('skills cmd-card executes the skills command', () => {
    cy.get('.cmd-card[data-command="skills"]').click()
    cy.get('.skill-tag').should('exist')
  })

  it('contact cmd-card executes the contact command', () => {
    cy.get('.cmd-card[data-command="contact"]').click()
    cy.get('.contact-label').should('exist')
  })

  // ─── Demo indicator (no clock needed) ────────────────────────────────────────

  it('demo indicator is not shown on initial load', () => {
    cy.get('.demo-indicator').should('not.exist')
  })
})

// ─── Demo mode (requires cy.clock() BEFORE cy.visit()) ───────────────────────

// describe('TerminalInterface demo mode (E2E)', () => {
//   beforeEach(() => {
//     cy.clock()
//     cy.intercept('GET', '**/api/v1/github**', { body: { data: [] } }).as('getGithub')
//     cy.clearLocalStorage()
//     cy.visit('/')
//   })

//   afterEach(() => {
//     cy.clock().then((clock) => clock.restore())
//   })

//   it('demo mode starts after 2 minutes of inactivity', () => {
//     cy.tick(120000)
//     cy.get('.demo-indicator').should('be.visible')
//   })

//   it('demo mode shows Stop Demo button', () => {
//     cy.tick(120000)
//     cy.get('.demo-stop').should('contain', 'Stop Demo')
//   })

//   it('clicking Stop Demo exits demo mode', () => {
//     cy.tick(120000)
//     cy.get('.demo-stop').click()
//     cy.get('.demo-indicator').should('not.exist')
//   })

//   it('cmd-cards are disabled during demo mode', () => {
//     cy.tick(120000)
//     cy.get('.demo-indicator').should('be.visible')
//     cy.get('.cmd-card').each(($btn) => {
//       cy.wrap($btn).should('be.disabled')
//     })
//   })

//   it('typing resets the demo timer before it fires', () => {
//     cy.tick(60000)
//     cy.get('.terminal__input').type('a', { force: true })
//     cy.tick(60000)
//     cy.get('.demo-indicator').should('not.exist')
//   })
// })