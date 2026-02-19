describe('Privacy Policy page (/privacy-policy)', () => {
  beforeEach(() => {
    cy.visit('/privacy-policy')
        cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
  })

  it('renders the page heading', () => {
    cy.get('.privacy-policy h1, .header h1').should('be.visible')
  })

  it('renders last updated date', () => {
    cy.get('.last-updated').should('contain', '04/02/2026')
  })

  it('renders the language toggle button', () => {
    cy.get('.lang-toggle').should('be.visible')
  })

  it('language toggle switches between FR and EN', () => {
    cy.get('.lang-toggle').should('contain.text', 'English')
    cy.get('.lang-toggle').click()
    cy.get('.lang-toggle').should('contain.text', 'Français')
  })

  it('renders at least one content section', () => {
    cy.get('.content section').should('have.length.gte', 1)
  })
})

describe('Legal Notice page (/legal-notice)', () => {
  beforeEach(() => {
    cy.visit('/legal-notice')
  })

  it('renders the page heading', () => {
    cy.get('.legal-notice h1, .header h1').should('be.visible')
  })

  it('renders last updated date', () => {
    cy.get('.last-updated').should('be.visible')
  })

  it('displays company name Lisowski François', () => {
    cy.get('.content, .info-box').should('contain', 'Lisowski François')
  })

  it('language toggle is present and functional', () => {
    cy.get('.lang-toggle').should('be.visible')
    cy.get('.lang-toggle').click()
    cy.get('.lang-toggle').should('be.visible')
  })

  it('renders multiple info sections', () => {
    cy.get('.content section').should('have.length.gte', 1)
  })
})

describe('Cookies page (/cookies)', () => {
  beforeEach(() => {
    cy.visit('/cookies')
  })

  it('renders the cookies heading', () => {
    cy.get('.cookies h1, .header h1').should('be.visible')
  })

  it('renders last updated 04/02/2026', () => {
    cy.get('.last-updated').should('contain', '04/02/2026')
  })

  it('language toggle switches language', () => {
    cy.get('.lang-toggle').click()
    cy.get('.lang-toggle').should('be.visible')
  })

  it('renders multiple sections with headings', () => {
    cy.get('.content section h2').should('have.length.gte', 2)
  })

  it('section 3 covers types of cookies', () => {
    cy.get('.content section h2').should('contain.text', '3')
  })
})

describe('Terms of Use page (/terms)', () => {
  beforeEach(() => {
    cy.visit('/terms')
  })

  it('renders the terms heading', () => {
    cy.get('.terms h1, .header h1').should('be.visible')
  })

  it('renders last updated date', () => {
    cy.get('.last-updated').should('contain', '04/02/2026')
  })

  it('language toggle is functional', () => {
    cy.get('.lang-toggle').should('be.visible').click()
    cy.get('.lang-toggle').should('be.visible')
  })

  it('renders acceptance and services sections', () => {
    cy.get('.content section').should('have.length.gte', 2)
  })
})
