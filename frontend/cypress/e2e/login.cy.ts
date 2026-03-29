describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('renders the login form', () => {
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain.text', 'Sign in')
  })

  it('shows error on invalid credentials', () => {
    cy.intercept('POST', '**/auth/login', { statusCode: 401, body: { detail: 'Unauthorized' } })

    cy.get('input[type="email"]').type('wrong@test.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    cy.contains('Invalid email or password').should('be.visible')
  })

  it('redirects to /favorites on successful login', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { message: 'ok', user_id: '1', access_token: 'tok', username: 'nick' },
    })

    cy.get('input[type="email"]').type('user@test.com')
    cy.get('input[type="password"]').type('correctpassword')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/favorites')
  })
})