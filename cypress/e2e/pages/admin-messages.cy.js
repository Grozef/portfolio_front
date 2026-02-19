const messagesFixture = [
  {
    id: 1,
    name: 'Alice Dupont',
    email: 'alice@example.com',
    subject: 'Job opportunity',
    message: 'Hello, I would like to discuss a potential collaboration.',
    read_at: null,
    created_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 2,
    name: 'Bob Martin',
    email: 'bob@example.com',
    subject: 'Nice portfolio',
    message: 'Great work on your portfolio site!',
    read_at: '2026-02-11T08:00:00Z',
    created_at: '2026-02-09T15:30:00Z',
  },
]

const setupAdminMessages = () => {
  cy.intercept('GET', '/api/v1/auth/me', { fixture: 'user.json' }).as('getMe')
  cy.intercept('GET', '/api/v1/messages*', { body: { data: messagesFixture } }).as('getMessages')

  cy.visit('/Moi/messages', {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', 'fake-jwt-token')
        win.localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true }))
            cy.get('body').then(($body) => {
      if ($body.find('button:contains("Tout accepter")').length > 0) {
        cy.contains('Tout accepter').click();
      }
    });
    },
    
  })

  cy.wait('@getMe')
  cy.get('.loading-state', { timeout: 8000 }).should('not.exist')
}

describe('Admin - Messages', () => {
  beforeEach(setupAdminMessages)

  it('renders the admin sidebar', () => {
    cy.get('.sidebar').should('be.visible')
  })

  it('displays total and unread counts in stats bar', () => {
    cy.get('.stat-item').contains('Total').should('be.visible')
    cy.get('.stat-item').contains('Unread').should('be.visible')
  })

  it('renders All, Unread and Read filter buttons', () => {
    cy.get('.filter-btn').should('have.length', 3)
    cy.get('.filter-btn').contains('All').should('be.visible')
    cy.get('.filter-btn').contains('Unread').should('be.visible')
    cy.get('.filter-btn').contains('Read').should('be.visible')
  })

  it('All filter is active by default', () => {
    cy.get('.filter-btn').contains('All').should('have.class', 'active')
  })

  it('switching to Unread filter marks it active', () => {
    cy.get('.filter-btn').contains('Unread').click()
    cy.get('.filter-btn').contains('Unread').should('have.class', 'active')
  })

  it('Unread filter shows only unread messages', () => {
    cy.get('.filter-btn').contains('Unread').click()
    cy.get('.message-item').each(($item) => {
      cy.wrap($item).should('have.class', 'unread')
    })
  })

  it('Read filter shows only read messages', () => {
    cy.get('.filter-btn').contains('Read').click()
    cy.get('.message-item').each(($item) => {
      cy.wrap($item).should('not.have.class', 'unread')
    })
  })

  it('renders message items from fixture', () => {
    cy.get('.message-item').should('have.length', 2)
  })

  it('displays sender name and subject per message', () => {
    cy.get('.message-from').first().should('contain', 'Alice Dupont')
    cy.get('.message-subject').first().should('contain', 'Job opportunity')
  })

  it('unread message has unread class', () => {
    cy.get('.message-item').first().should('have.class', 'unread')
  })

  it('read message does not have unread class', () => {
    cy.get('.message-item').last().should('not.have.class', 'unread')
  })

  it('opens message detail when clicking a message', () => {
    cy.get('.message-item').first().click()
    cy.get('.message-detail, .detail-panel, [class*="detail"]').should('be.visible')
  })

  it('shows empty state when no messages match filter', () => {
    cy.intercept('GET', '/api/v1/messages*', { body: { data: [] } }).as('emptyMessages')
    cy.visit('/Moi/messages', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'fake-jwt-token')
      },
    })
    cy.wait('@getMe')
    cy.get('.empty-state').should('be.visible')
  })
})

describe('Admin - Messages redirect', () => {
  it('redirects to login without token', () => {
    cy.clearLocalStorage()
    cy.visit('/Moi/messages')
    cy.url().should('include', '/login')
  })
})