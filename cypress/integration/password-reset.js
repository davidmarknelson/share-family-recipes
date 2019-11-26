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
        .url().should('include', '/login/forgotpassword')
        .get('form').submit()        
        .get('.notification')
        .should('contain', 'Email is required.');
    });

    it('should show an error message when the email does not exist', () => {
      cy
        .visit('/login/forgotpassword')
        .url().should('include', '/login/forgotpassword')
        .get('#email').type('notexist@email.com')
        .get('form').submit()        
        .get('.notification')
        .should('contain', 'No account with that email address exists.');
    });

    it('should show a success message when the user submits the email', () => {
      cy
        .visit('/login/forgotpassword')
        .url().should('include', '/login/forgotpassword')
        .get('#email').type('verified@email.com')
        .get('form').submit()
        .get('[data-test=emailSending]')
        .should('exist')
        .wait(5000)
        .get('.notification').invoke('text')
        .should('contain', 'An email has been sent to verified@email.com with further instructions.')
        .get('[data-test=emailSuccess]').should('exist')
        .get('#email').should('be.empty');
    });
  });

  describe('Reset Password Page', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seedpasswordtoken');
    });

    it('should show an error and reroute when the email token has expired', () => {
      cy
        .visit('/login/forgotpassword/reset?token=wrongtoken')
        .url().should('include', '/login/forgotpassword/reset')
        .get('[data-test=password]').type('newpassword')
        .get('[data-test=passwordConfirmation]').type('newpassword')
        .get('form').submit()        
        .url().should('include', '/login/forgotpassword')
        .get('.notification').invoke('text')
        .should('contain', 'Password reset token is invalid or has expired. Resend reset email.');
    });

    it('should redirect to the login page after a successful reset and not use the previous password', () => {
      cy
        .visit('/login/forgotpassword/reset?token=1234567890')
        .url().should('include', '/login/forgotpassword/reset')
        .get('[data-test=password]').type('newpassword')
        .get('[data-test=passwordConfirmation]').type('newpassword')
        .get('form').submit()        
        .url().should('include', '/login')
        .get('.notification').invoke('text')
        .should('contain', 'Your password was successfully reset. Please log in with your new password.')
        .get('#email').type('verified@email.com')
        .get('#password').type('password')
        .get('form').submit()
        .get('.notification').should('contain', 'The login information was incorrect.')
        .get('#password').clear().type('newpassword')
        .get('form').submit()
        .url().should('include', '/profile');        
    });
  });
});