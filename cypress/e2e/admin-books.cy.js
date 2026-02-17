// describe('Admin Books Management', () => {
// describe('Admin Books Management', () => {
// beforeEach(() => {
//   // Simule le token
//   window.localStorage.setItem('auth_token', 'fake-token');

//   // Mocks
//   cy.intercept('GET', '**/api/me', { body: { id: 1, name: 'Francois' } }).as('getMe');
  
//   // Utilise le fichier que tu viens de créer
//   cy.intercept('GET', '**/api/books', { fixture: 'books-list.json' }).as('getBooks');
  
//   cy.intercept('GET', '**/api/books/stats', {
//     body: { total: 2, read: 1, reading: 1, to_read: 0 }
//   }).as('getStats');

//   cy.visit('/admin/books');

//   // ATTENDRE que le chargement soit fini
//   cy.wait(['@getMe', '@getBooks', '@getStats']);
  
//   // Optionnel : s'assurer que le loader a disparu
//   cy.get('.loading-state').should('not.exist');
// });

//   it('devrait afficher les stats...', () => {
//     cy.get('.stat-item').should('contain', '2')
//   })
// })

//   it('devrait afficher les stats et la liste des livres', () => {
//     cy.get('.stat-item').contains('2').should('be.visible') // Total
//     cy.get('table tbody tr').should('have.length', 2)
//     cy.get('.book-title').first().should('contain', 'Clean Code')
//   })

//   it('devrait filtrer les livres via la barre de recherche', () => {
//     cy.get('.search-box input').type('Pragmatic')
//     cy.get('table tbody tr').should('have.length', 1)
//     cy.get('.book-title').should('contain', 'The Pragmatic Programmer')
//     cy.get('.book-title').should('not.contain', 'Clean Code')
//   })

//   it('devrait ouvrir la modale et ajouter un livre', () => {
//     // Intercepter le POST de création
//     cy.intercept('POST', '**/api/books', {
//       statusCode: 201,
//       body: { id: 3, title: 'Refactoring', author: 'Martin Fowler', status: 'to-read' }
//     }).as('addBook')

//     cy.get('.add-btn').click()
//     cy.get('.modal-overlay').should('be.visible')
    
//     cy.get('input[placeholder="9780132350884"]').type('9780134757599')
//     // Si ton app fetch auto les infos via ISBN, tu peux mocker l'API OpenLibrary ici aussi
    
//     cy.get('input[placeholder="Clean Code"]').clear().type('Refactoring')
//     cy.get('select').select('to-read')
    
//     cy.get('.btn-submit').click()
//     cy.wait('@addBook')
//     cy.get('.modal-overlay').should('not.exist')
//   })

//   it('devrait gérer la suppression avec confirmation', () => {
//     cy.intercept('DELETE', '**/api/books/1', { statusCode: 200 }).as('deleteBook')
    
//     cy.get('.action-btn.delete').first().click()
//     cy.get('.modal-small').should('be.visible')
//     cy.get('.modal-small strong').should('contain', 'Clean Code')
    
//     cy.get('.btn-delete').click()
//     cy.wait('@deleteBook')
//     cy.get('.modal-small').should('not.exist')
//   })

//   it('devrait switcher le statut "featured" directement depuis le tableau', () => {
//     cy.intercept('PUT', '**/api/books/2', { 
//       body: { id: 2, is_featured: true } 
//     }).as('updateFeatured')

//     // Le livre 2 n'est pas "featured" (☆)
//     cy.get('tr').last().find('.featured-toggle').should('contain', '☆').click()
    
//     cy.wait('@updateFeatured')
//     // Vérification visuelle (attention au rendu du bouton après update)
//     cy.get('tr').last().find('.featured-toggle').should('contain', '★')
//   })
// })