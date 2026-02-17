const carouselFixture = [
  { id: 1, title: 'Image One', image_url: 'https://example.com/image1.jpg', sort_order: 1, is_active: true },
  { id: 2, title: 'Image Two', image_url: 'https://example.com/image2.jpg', sort_order: 2, is_active: false },
]

const setupAdminCarousel = () => {
  cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
  cy.intercept('GET', '/api/v1/carousel*', { body: { data: carouselFixture } }).as('getCarousel')

  cy.visit('/Moi/carousel', {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', 'fake-jwt-token')
    },
  })

  cy.wait(['@getMe', '@getCarousel'])
  cy.get('.loading-state', { timeout: 5000 }).should('not.exist')
}

describe('Admin - Carousel Management', () => {
  beforeEach(setupAdminCarousel)

  it('renders the Carousel Management header', () => {
    cy.get('.page-title').should('contain', 'Carousel Management')
  })

  it('renders the Add Image button', () => {
    cy.get('.add-btn').should('be.visible').and('contain', 'Add Image')
  })

  it('renders image cards from fixture', () => {
    cy.get('.image-card').should('have.length', 2)
  })

  it('displays image titles', () => {
    cy.get('.image-title').first().should('contain', 'Image One')
  })

  it('displays sort order for each image', () => {
    cy.get('.meta-order').first().should('contain', 'Order: 1')
  })

  it('active image card does not have inactive class', () => {
    cy.get('.image-card').first().should('not.have.class', 'inactive')
  })

  it('inactive image card has inactive class', () => {
    cy.get('.image-card').last().should('have.class', 'inactive')
  })

  it('toggle active button displays correct label', () => {
    cy.get('.meta-status').first().should('contain', 'Active')
    cy.get('.meta-status').last().should('contain', 'Inactive')
  })

  it('clicking toggle calls update endpoint', () => {
    cy.intercept('PATCH', '/api/v1/carousel/*', { statusCode: 200, body: {} }).as('toggleActive')
    cy.get('.meta-status').first().click()
    cy.wait('@toggleActive')
  })

  it('opens Add Image modal on button click', () => {
    cy.get('.add-btn').click()
    cy.get('.modal-overlay, .modal-content').should('be.visible')
    cy.get('.modal-content').should('contain', 'Add Image')
  })

  it('modal has URL and file upload tabs', () => {
    cy.get('.add-btn').click()
    cy.get('.mode-tab, .mode-tabs button').should('have.length.gte', 2)
  })

  it('modal closes via close button', () => {
    cy.get('.add-btn').click()
    cy.get('.modal-close').first().click()
    cy.get('.modal-overlay').should('not.exist')
  })

  it('modal closes by clicking overlay backdrop', () => {
    cy.get('.add-btn').click()
    cy.get('.modal-overlay').click({ force: true })
    cy.get('.modal-overlay').should('not.exist')
  })

  it('edit button on image card opens edit modal', () => {
    cy.get('.image-card').first().find('.btn-edit').click({ force: true })
    cy.get('.modal-overlay, .modal-content').should('be.visible')
  })

  it('delete button calls delete endpoint', () => {
    cy.intercept('DELETE', '/api/v1/carousel/*', { statusCode: 200, body: {} }).as('deleteImage')
    cy.get('.image-card').first().find('.btn-delete').click({ force: true })
    cy.wait('@deleteImage')
  })

  it('shows empty state and Add First Image button when carousel is empty', () => {
    cy.intercept('GET', '/api/v1/carousel*', { body: { data: [] } }).as('emptyCarousel')
    cy.visit('/Moi/carousel', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-jwt-token')
      },
    })
    cy.wait('@getMe')
    cy.get('.empty-state').should('be.visible')
    cy.get('.btn-primary').should('contain', 'Add First Image')
  })

  it('redirects to login without token', () => {
    cy.visit('/Moi/carousel')
    cy.url().should('include', '/login')
  })
})