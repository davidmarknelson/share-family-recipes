describe('Password reset', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('Forgot password page', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed');
    });

    it('should show an error message when the user submits an empty form', () => {
      cy
        .visit('/login')
        .url().should('include', '/login')
        .get('.reset-link-container > a').click()
        .url().should('include', '/forgotpassword')
        .get('form').submit()        
        .get('.notification')
        .should('contain', 'Email is required.');
    });

    it('should show an error message when the user submits an empty form', () => {
      cy
        .visit('/forgotpassword')
        .url().should('include', '/forgotpassword')
        .get('#email').type('notexist@email.com')
        .get('form').submit()        
        .get('.notification')
        .should('contain', 'No account with that email address exists.');
    });

    it('should show an error message when the user submits an empty form', () => {
      cy
        .visit('/forgotpassword')
        .url().should('include', '/forgotpassword')
        .get('#email').type('verified@email.com')
        .get('form').submit()        
        .get('[data-test=emailSending]')
        .should('exist')
        .wait(7000)
        .get('.notification').invoke('text')
        .should('contain', 'An email has been sent to verified@email.com with further instructions.')
        .get('[data-test=emailSuccess]').should('exist')
        .get('#email').should('be.empty');
    });
  });
});