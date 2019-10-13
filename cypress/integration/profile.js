describe('Profile', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  it('should redirect to the home page for an unauthorized user', () => {
    cy
      .visit('/profile')
      .url().should('include', '/')
      .get('.notification').invoke('text').should('include', 'You must be signed in to do that.');
  });

});