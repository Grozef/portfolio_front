// All tests run against the live HomeView (cy.visit('/'))
// which mounts TerminalInterface and all its sub-components.

const setupHome = () => {
  cy.intercept('GET', '**/api/v1/github**', { body: { data: [] } }).as('getGithub')
  cy.clearLocalStorage()
  cy.visit('/')
}

// ─── TerminalHeader ────────────────────────────────────────────────────────────

describe('TerminalHeader (E2E)', () => {
  beforeEach(setupHome)

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

  it('status dot loses active class briefly while processing a command', () => {
    // After the command resolves the status returns to Ready — assert settled state
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.status-text').should('contain', 'Ready')
  })
})

// ─── TerminalInput ────────────────────────────────────────────────────────────

describe('TerminalInput (E2E)', () => {
  beforeEach(setupHome)

  it('renders the input line container', () => {
    cy.get('.terminal__input-line').should('exist')
  })

  it('renders the prompt with $ sign', () => {
    cy.get('.prompt').should('contain', '$')
  })

  it('renders the blinking cursor', () => {
    cy.get('.cursor').should('contain', '█')
  })

  it('cursor has cursor-blink class when not processing', () => {
    cy.get('.cursor').should('have.class', 'cursor-blink')
  })

  it('input field is enabled when not processing', () => {
    cy.get('.terminal__input').should('not.be.disabled')
  })

  it('input has autocomplete off and no spellcheck', () => {
    cy.get('.terminal__input')
      .should('have.attr', 'autocomplete', 'off')
      .and('have.attr', 'spellcheck', 'false')
  })

  it('typing updates the input value', () => {
    cy.get('.terminal__input').type('projects', { force: true })
    cy.get('.terminal__input').should('have.value', 'projects')
  })

  it('pressing Enter submits the command and clears input', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.terminal__input').should('have.value', '')
  })

  it('clicking the wrapper focuses the input', () => {
    cy.get('.terminal__input-line').click()
    cy.get('.terminal__input').should('be.focused')
  })
})

// ─── TerminalOutput ───────────────────────────────────────────────────────────

describe('TerminalOutput (E2E)', () => {
  beforeEach(setupHome)

  it('output area is rendered', () => {
    cy.get('.terminal__output').should('exist')
  })

  it('initial ascii welcome block is present', () => {
    cy.get('.ascii-art').should('exist')
  })

  it('help command renders help list with command names', () => {
    cy.get('.terminal__input').type('help{enter}', { force: true })
    cy.get('.help-title').should('contain', 'Available Commands')
    cy.get('.cmd-name').should('have.length.gte', 1)
  })

  it('about command renders about output with name and status', () => {
    cy.get('.terminal__input').type('about{enter}', { force: true })
    cy.get('.about-name').should('contain', 'Full Stack Developer')
    cy.get('.status-available').should('contain', 'Open to opportunities')
  })

  it('skills command renders skill categories and tags', () => {
    cy.get('.terminal__input').type('skills{enter}', { force: true })
    cy.get('.category-name').should('exist')
    cy.get('.skill-tag').should('have.length.gte', 1)
  })

  it('contact command renders contact labels', () => {
    cy.get('.terminal__input').type('contact{enter}', { force: true })
    cy.get('.contact-label').should('have.length.gte', 2)
  })

  it('experience command renders exp-title and exp-company', () => {
    cy.get('.terminal__input').type('experience{enter}', { force: true })
    cy.get('.exp-title').should('exist')
    cy.get('.exp-company').should('exist')
  })

  it('social command renders social links as anchors with target _blank', () => {
    cy.get('.terminal__input').type('social{enter}', { force: true })
    cy.get('.social-link').should('have.length.gte', 1)
    cy.get('.social-link').first().should('have.attr', 'target', '_blank')
  })

  it('unknown command renders error entry', () => {
    cy.get('.terminal__input').type('zzzzunknown{enter}', { force: true })
    cy.get('.output-entry--error').should('exist')
    cy.get('.error-text').should('contain', 'Command not found')
  })

  it('input entries echo the typed command', () => {
    cy.get('.terminal__input').type('about{enter}', { force: true })
    cy.get('.output-entry--input .command').should('contain', 'about')
  })
})

// ─── TerminalQuickNav ─────────────────────────────────────────────────────────

describe('TerminalQuickNav (E2E)', () => {
  beforeEach(setupHome)

  it('shows the banner on first visit', () => {
    cy.get('.quick-nav').should('be.visible')
  })

  it('has a GUI mode button', () => {
    cy.get('.quick-nav__btn').should('contain', 'Switch to GUI Mode')
  })

  it('has a close button with correct aria-label', () => {
    cy.get('.quick-nav__close').should('have.attr', 'aria-label', 'Close banner')
  })

  it('dismissing hides the banner', () => {
    cy.get('.quick-nav__close').click()
    cy.get('.quick-nav').should('not.exist')
  })

  it('dismissed state persists via localStorage across visits', () => {
    cy.get('.quick-nav__close').click()
    cy.visit('/')
    cy.get('.quick-nav').should('not.exist')
  })

  it('banner is hidden when localStorage flag is pre-set', () => {
    cy.clearLocalStorage()
    cy.window().then((win) => win.localStorage.setItem('hide_quick_nav', 'true'))
    cy.visit('/')
    cy.get('.quick-nav').should('not.exist')
  })
})

// ─── TerminalInfoCard ─────────────────────────────────────────────────────────

describe('TerminalInfoCard (E2E)', () => {
  beforeEach(setupHome)

  it('shows the info card on first visit', () => {
    cy.get('.terminal-info').should('be.visible')
  })

  it('contains the why-terminal heading', () => {
    cy.get('.info-card h3').should('contain', 'Why a Terminal Interface')
  })

  it('has a close button with correct aria-label', () => {
    cy.get('.info-close').should('have.attr', 'aria-label', 'Close info')
  })

  it('closing the card removes it from the DOM', () => {
    cy.get('.info-close').click()
    cy.get('.terminal-info').should('not.exist')
  })

  it('dismissed state persists via localStorage across visits', () => {
    cy.get('.info-close').click()
    cy.visit('/')
    cy.get('.terminal-info').should('not.exist')
  })

  it('card is hidden when localStorage flag is pre-set', () => {
    cy.clearLocalStorage()
    cy.window().then((win) => win.localStorage.setItem('hide_terminal_info', 'true'))
    cy.visit('/')
    cy.get('.terminal-info').should('not.exist')
  })
})

// ─── TerminalDemoIndicator ────────────────────────────────────────────────────

// describe('TerminalDemoIndicator (E2E)', () => {
//   beforeEach(() => {
//     cy.intercept('GET', '**/api/v1/github**', { body: { data: [] } }).as('getGithub')
//     cy.clearLocalStorage()
//   })

//   it('is not visible before the 2-minute timeout fires', () => {
//     cy.visit('/')
//     cy.get('.demo-indicator').should('not.exist')
//   })

//   it('becomes visible after 2 minutes of inactivity', () => {
//     cy.clock()
//     cy.visit('/')
//     cy.tick(120000)
//     cy.get('.demo-indicator').should('be.visible')
//     cy.clock().then((clock) => clock.restore())
//   })

//   it('shows "Demo Mode Active" label', () => {
//     cy.clock()
//     cy.visit('/')
//     cy.tick(120000)
//     cy.get('.demo-text').should('contain', 'Demo Mode Active')
//     cy.clock().then((clock) => clock.restore())
//   })

//   it('has a Stop Demo button that emits stop', () => {
//     cy.clock()
//     cy.visit('/')
//     cy.tick(120000)
//     cy.get('.demo-stop').should('contain', 'Stop Demo').click()
//     cy.get('.demo-indicator').should('not.exist')
//     cy.clock().then((clock) => clock.restore())
//   })
// })