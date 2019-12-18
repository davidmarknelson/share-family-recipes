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
    beforeEach(() => {
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
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should not show a message for verifying the email', () => {
      cy.visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=emailVerifyMsg]')
        .should('not.exist');
    });

    it('should navigate to the user created recipes', () => {
      cy.visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=your-recipes]').click()
        .url().should('include', '/recipes/user-recipes?username=verifiedUser');
    });

    it('should navigate to the profile edit page', () => {
      cy.visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=edit-profile]').click()
        .url().should('include', '/profile/edit');
    });

    it('should navigate to the admin page', () => {
      cy.visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=admin-link]').click()
        .url().should('include', '/admin');
    });
  });
});