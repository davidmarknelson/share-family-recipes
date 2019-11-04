describe('Edit profile', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('First Name', () => {
    before(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should navigate to the profile after a successful update with only changing the first name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=name]').should('contain', 'John Doe')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#firstName').type('Joe')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=name]').should('contain', 'Joe Doe');
    });
  });

  describe('Last Name', () => {
    before(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should navigate to the profile after a successful update with only changing the last name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=name]').should('contain', 'John Doe')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#lastName').type('Smith')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=name]').should('contain', 'John Smith');
    });
  });

  describe('Email', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('verified@email.com', 'password');
    });

    it('should update the email and change the email to unverified', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=emailVerifyMsg]').should('not.exist')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('new@email.com')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=email]').should('contain', 'new@email.com')
        .get('[data-test=emailVerifyMsg]').should('exist');
    });

    it('should show an error message if someone is already using the email', () => {
      cy
        .visit('/profile')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('unverified@email.com')
        .get('form').submit()
        .get('.notification')
        .should('contain', 'This email account is already in use.');
    });

    it('should remove the error message on the email input after the user changes the email', () => {
      cy
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('unverified@email.com')
        .get('form').submit()
        .get('.notification')
        .should('contain', 'This email account is already in use.')
        .get('#email').clear().type('new@email.com')
        .get('[data-test=emailTaken]').should('not.exist');
    });
  });

  describe('Username', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('verified@email.com', 'password');
    });

    it('should show an error message when the username is already taken', () => {
      cy
      .visit('/profile/edit')
      .url().should('include', '/profile/edit')
      .get('#username').type('unverifiedUser')
      .wait(1000)
      .get('[data-test=usernameUnavailable]').should('exist');
    });

    it('should show a message when the username is available', () => {
      cy
      .visit('/profile/edit')
      .url().should('include', '/profile/edit')
      .get('#username').type('newUser')
      .wait(1000)
      .get('[data-test=usernameAvailable]').should('exist');
    });

    it('should navigate to the profile after a successful update with only changing the last name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=username]').should('contain', 'verifiedUser')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#username').type('newUser')
        .wait(1000)
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=username]').should('contain', 'newUser');
    });
  });
});