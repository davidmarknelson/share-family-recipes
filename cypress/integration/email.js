describe('Email verification', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
    cy.request('DELETE', 'http://localhost:3000/tests/delete');
  });

  describe('Verification email', () => {
    before(() => {
      cy.request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('unverified@email.com', 'password');
    });

    it('should show an loading bar and a success message when the email is sent', () => {
      cy
        .get('[data-test=emailVerifyMsg] > p > a').click()
        .get('[data-test=emailSending]').should('contain', 'Sending email...')
        .wait(4000, {timeout: 7000})
        .get('.notification').invoke('text')
        .should('contain', 'Email has successfully been sent.')
        .get('[data-test=emailVerifySuccess]').should('exist');
    });
  });

  describe('Email verification page', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seedemailtoken')
        .login('unverified@email.com', 'password')
    });

    it('should show an error message when the token does not exist', () => {
      cy
        .visit('/verify?token=doesnotexist')
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'The token has expired. Please send another verification email.')
        .get('[data-test=emailVerifyMsg]').should('exist');
    });

    it('should show a success message when the email is verified and not show a verify email message', () => {
      cy
        .visit('/verify?token=1234567890')
        .url().should('include', '/profile')
        .get('[data-test=emailVerifyMsg]').should('not.exist')
        .get('.notification').invoke('text')
        .should('contain', 'Your email is now verified.');
    });
  });

});