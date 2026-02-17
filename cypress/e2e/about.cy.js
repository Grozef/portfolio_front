describe('Page About - François Lisowski', () => {
  beforeEach(() => {
    // Cypress utilisera la baseUrl de ton cypress.config.js
    cy.visit('/about') 
  })

  it('devrait charger la page avec l’animation d’entrée', () => {
    // On attend que la classe .visible soit appliquée (ton setTimeout de 100ms)
    cy.get('.about-page', { timeout: 2000 })
      .should('have.class', 'visible')
      .and('be.visible')
  })

  it('devrait afficher les informations du Hero correctement', () => {
    cy.get('.hero-name').should('contain', 'Francois')
    cy.get('.hero-name .accent-text').should('contain', 'Lisowski')
    
    // Check de la photo et des anneaux décoratifs
    cy.get('.visual-photo img').should('have.attr', 'src', '/images/francois-lisowski.png')
    cy.get('.visual-ring').should('have.length', 3) // Les 3 rings de ton CSS
  })

  it('devrait générer la grille de skills dynamiquement', () => {
    // On vérifie que les catégories sont bien rendues (frontend, backend, etc.)
    const categories = ['frontend', 'backend', 'devops', 'tools', 'mobile']
    
    categories.forEach(cat => {
      cy.get('.skill-category').contains(cat).should('be.visible')
    })

    // On check si un skill spécifique est présent
    cy.get('.skill-item').contains('Vue.js').should('exist')
    cy.get('.skill-item').contains('Cypress').should('exist')
  })

  it('devrait afficher la timeline d’expérience', () => {
    cy.get('.timeline-item').should('have.length.at.least', 2)
    
    // Check du poste actuel
    cy.get('.timeline-item').first().within(() => {
      cy.get('.exp-title').should('contain', 'Full Stack Developer')
      cy.get('.exp-company').should('contain', 'Lab')
    })
  })

  it('devrait tester la navigation (Back et Contact)', () => {
    // On vérifie le lien de retour vers la home
    cy.get('.back-btn').should('have.attr', 'href', '/')
    
    // On vérifie le bouton CTA en bas de page
    cy.get('.cta-button')
      .should('have.attr', 'href', '/contact')
      .click()
    
    // On vérifie qu'on a bien changé d'URL
    cy.url().should('include', '/contact')
  })
})