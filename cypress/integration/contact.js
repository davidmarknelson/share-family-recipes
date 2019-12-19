describe('Contact', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  it('should go to the contact page from the footer', () => {
    cy.visit('/')
      .url().should('include', '/')
      .get('[data-test=footer-contact]').click()
      .url().should('include', '/contact')
      .get('.spacing').should('exist');
  });
});