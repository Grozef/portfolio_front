// ─── BluescreenOfDeath ────────────────────────────────────────────────────────

describe('BluescreenOfDeath (E2E)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.intercept('GET', '/api/v1/weather*', {
      body: { data: { temp: 12, city: 'Lyon', condition: 'clouds' } },
    }).as('getWeather')
    cy.visit('/contact')
  })

  it('BSOD overlay is not visible on page load', () => {
    cy.get('.bsod-overlay').should('not.exist')
  })

  it('contact page loads without BSOD', () => {
    cy.get('.contact-form').should('be.visible')
    cy.get('.bsod-overlay').should('not.exist')
  })
})

// ─── GrandCompletionAnimation ─────────────────────────────────────────────────

describe('GrandCompletionAnimation (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('completion overlay is not visible on initial load', () => {
    cy.get('.completion-overlay').should('not.exist')
  })
})

// ─── MasterEasterEgg ──────────────────────────────────────────────────────────

describe('MasterEasterEgg (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    cy.visit('/')
  })

  it('master easter egg overlay is not visible on initial load', () => {
    cy.get('.master-easter-egg, .master-completion').should('not.exist')
  })
})

// ─── KonamiAnimationGradius ───────────────────────────────────────────────────
// Konami code is registered in App.vue via useKonamiCode composable.
// Sequence: Up Up Down Down Left Right Left Right b a — then Enter to confirm.

describe('KonamiAnimationGradius (E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/github*', { body: { data: [] } }).as('getGithub')
    // Visit a page with no focused input to ensure keydown events hit window
    cy.visit('/about')
  })

  it('konami animation is not visible before the code is entered', () => {
    cy.get('.konami-animation').should('not.exist')
  })

  it('entering konami code sequence + Enter triggers the animation', () => {
    // Type sequence one key at a time to avoid focus interception
    const seq = [
      '{upArrow}', '{upArrow}',
      '{downArrow}', '{downArrow}',
      '{leftArrow}', '{rightArrow}',
      '{leftArrow}', '{rightArrow}',
      'b', 'a'
    ]
    seq.forEach((k) => cy.get('body').type(k, { release: false }))
    cy.get('body').type('{enter}')
    cy.get('.konami-animation.gradius', { timeout: 3000 }).should('exist')
  })
})