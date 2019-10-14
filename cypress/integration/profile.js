describe('Profile', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
    cy.request('DELETE', 'http://localhost:3000/tests/delete');
  });

  it('should redirect to the home page for an unauthorized user', () => {
    cy
      .visit('/profile')
      .url().should('include', '/')
      .get('.notification').invoke('text').should('include', 'You must be signed in to do that.');
  });

  describe('Unverified User', () => {
    before(() => {
      cy.request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('unverified@email.com', 'password');
    });

    it('should show a message for verifying the email', () => {
      cy
        .get('[data-test=emailVerifyMsg]')
        .should('have.class', 'is-warning');
    });
  });

  describe('Verified User', () => {
    before(() => {
      cy.request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should not show a message for verifying the email', () => {
      cy
        .get('[data-test=emailVerifyMsg]')
        .should('not.exist');
    });
  });
});