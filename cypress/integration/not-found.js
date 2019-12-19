describe('Not Found', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  it('should redirect when the user navigates to a page that does not exist', () => {
    cy.visit('/doesnotexist')
      .url().should('include', '/notfound')
      .get('.not-found-msg').should('exist');
  });
});