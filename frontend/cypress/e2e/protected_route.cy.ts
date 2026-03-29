describe('Protected route', () => {
  it('redirects unauthenticated user from /favorites to /login', () => {
    cy.visit('/favorites')
    cy.url().should('include', '/login')
  })
})