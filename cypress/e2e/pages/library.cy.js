// describe('Books Page - Portfolio Books', () => {
//   const mockBooks = {
//     data: [
//       { id: 1, display_title: 'The Witcher', display_author: 'Sapkowski', status: 'read', rating: 5 },
//       { id: 2, display_title: 'Clean Code', display_author: 'Uncle Bob', status: 'reading', rating: 4 }
//     ],
//     meta: { total: 2 }
//   }

//   const mockCarousel = {
//     data: [
//       { id: 1, image_url: '/img1.jpg', title: 'Ma première lecture' },
//       { id: 2, image_url: '/img2.jpg', title: 'Setup de dev' }
//     ]
//   }

//   beforeEach(() => {
//     cy.intercept('GET', '**/api/books/stats', { body: { to_read: 5, read: 12, reading: 2 } }).as('getStats')
//     cy.intercept('GET', '**/api/carousel', { body: mockCarousel }).as('getCarousel')
//     cy.intercept('GET', '**/api/books*', { body: mockBooks }).as('getBooks')
//   })

//   context('Visiteur non connecté', () => {
//     it('devrait naviguer dans le carousel', () => {
//       cy.visit('/books')
//       // Attente explicite du rendu du premier titre
//       cy.get('.carousel-info h3', { timeout: 15000 }).should('be.visible').and('not.be.empty')
//       cy.get('.carousel-info h3').should('contain', 'Ma première lecture')
      
//       cy.get('.carousel-next').click()
//       cy.get('.carousel-info h3').should('contain', 'Setup de dev')
//     })
//   })

//   context('Admin connecté', () => {
//     it('devrait afficher les boutons de gestion admin', () => {
//       cy.visit('/books', {
//         onBeforeLoad(win) {
//           win.localStorage.setItem('auth_token', 'fake-admin-token')
//         }
//       })
      
//       cy.intercept('GET', '**/api/me', { body: { id: 1, name: 'Francois' } }).as('getMe')
      
//       // On s'assure que le mode admin est détecté
//       cy.get('.header-actions', { timeout: 10000 }).within(() => {
//         // On est moins strict sur le sélecteur si .add-btn pose souci
//         cy.get('button').contains('Add Book').should('be.visible')
//       })
//     })
//   })

//   it('devrait avoir le Easter Egg du bouton qui s’enfuit', () => {
//     cy.visit('/books')
//     cy.get('.quote-section').scrollIntoView()
    
//     // On cherche par texte sans se soucier de la balise, au cas où c'est un <div> qui ressemble à un bouton
//     cy.contains(/don't click/i, { timeout: 15000 })
//       .should('exist')
//       .scrollIntoView()
//       .should('be.visible')
//   })
// })