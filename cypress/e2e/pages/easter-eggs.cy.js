describe('Fake Admin Terminal (/admin)', () => {
  beforeEach(() => {
    cy.visit('/admin')
  })

  it('renders the SSH terminal header', () => {
    cy.get('.terminal-header').should('be.visible')
    cy.get('.header-title').should('contain', 'SSH: root@portfolio.local')
  })

  it('renders terminal window chrome buttons', () => {
    cy.get('.header-buttons .btn').should('have.length', 3)
    cy.get('.btn.minimize').should('be.visible')
    cy.get('.btn.maximize').should('be.visible')
    cy.get('.btn.close').should('be.visible')
  })

  it('renders terminal body with output lines', () => {
    cy.get('.terminal-body').should('be.visible')
    cy.get('.terminal-line').should('have.length.gte', 1)
  })

  it('renders the terminal input field', () => {
    cy.get('.terminal-input').should('exist')
  })

  it('close button navigates back to home', () => {
    cy.get('.btn.close').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('accepts text input in terminal', () => {
    cy.get('.terminal-input').type('help')
    cy.get('.terminal-input').should('have.value', 'help')
  })

  it('pressing Enter submits a command', () => {
    cy.get('.terminal-input').type('help{enter}')
    cy.get('.terminal-line').should('have.length.gte', 2)
  })
})

describe('Dino Game page (/easter-egg/dino)', () => {
  beforeEach(() => {
    cy.visit('/easter-egg/dino')
  })

  it('renders the game header', () => {
    cy.get('.game-header').should('be.visible')
  })

  it('shows Easter Egg Unlocked title', () => {
    cy.get('.game-title h1').should('contain', 'Easter Egg Unlocked')
  })

  it('renders the game canvas', () => {
    cy.get('canvas').should('exist')
  })

  it('shows game overlay with start instructions on load', () => {
    cy.get('.game-overlay').should('be.visible')
    cy.get('.start-message').should('be.visible')
  })

  it('displays high score', () => {
    cy.get('.high-score').should('be.visible').and('contain', 'HI:')
  })

  it('back button navigates away from the game', () => {
    cy.get('.back-btn').click()
    cy.url().should('not.include', '/easter-egg/dino')
  })
})

describe('Brew Coffee page (/brew-coffee - RFC 2324)', () => {
  beforeEach(() => {
    cy.visit('/brew-coffee')
  })

  it('renders the 418 teapot heading', () => {
    cy.get('h1').should('contain', "418")
    cy.get('h1').should('contain', "teapot")
  })

  it('renders the teapot SVG', () => {
    cy.get('.teapot-svg').should('exist')
  })

  it('renders steam animation elements', () => {
    cy.get('.steam-container').should('exist')
    cy.get('.steam-path').should('have.length.gte', 1)
  })
})

describe('Not Found page (/404)', () => {
  it('renders 404 error code when accessing /404 directly', () => {
    cy.visit('/404')
    cy.get('.error-code').should('contain', '404')
  })

  it('renders the page-not-found message', () => {
    cy.visit('/404')
    cy.get('.error-message').should('contain', 'Page not found')
  })

  it('shows the secret game tease text', () => {
    cy.visit('/404')
    cy.get('.error-subtitle').should('contain', 'secret game')
  })

  it('renders the game canvas', () => {
    cy.visit('/404')
    cy.get('.game-canvas').should('exist')
  })

  it('shows score and high-score displays', () => {
    cy.visit('/404')
    cy.get('.score-display').should('contain', 'Score')
    cy.get('.high-score-display').should('contain', 'Best')
  })

  it('shows start instructions before game begins', () => {
    cy.visit('/404')
    cy.get('.start-message').should('be.visible')
  })

  it('shows control hints on the game start screen', () => {
    cy.visit('/404')
    cy.get('.control-hints').should('be.visible')
  })

  it('renders 404 when accessing a non-existent route', () => {
    cy.visit('/this-route-does-not-exist-at-all', { failOnStatusCode: false })
    cy.get('.error-code').should('contain', '404')
  })
})
