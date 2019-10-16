describe('Edit profile', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');

    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed');
  });

  beforeEach(() => {
    cy.login('verified@email.com', 'password');
  })

  it('should show an error if the user tried to submit an empty form', () => {
    cy
      .visit('/profile/edit/password')
      .url().should('include', '/profile/edit/password')
      .get('[data-test=submit-button]').click()
      .get('[data-test=passwordRequired]').should('exist')
      .get('[data-test=passwordConfirmationRequired]').should('exist')
      .url().should('include', '/profile/edit/password');
  });

  it('should show an error if the passwords are too short', () => {
    cy
      .visit('/profile/edit/password')
      .url().should('include', '/profile/edit/password')
      .get('#password').type('pass')
      .get('#passwordConfirmation').type('pass')
      .get('[data-test=passwordLength]').should('exist')
      .get('[data-test=passwordConfirmationLength]').should('exist');
  });

  it('should show an error if the passwords do not match', () => {
    cy
      .visit('/profile/edit/password')
      .url().should('include', '/profile/edit/password')
      .get('#password').type('passwords')
      .get('#passwordConfirmation').type('password')
      .get('[data-test=submit-button]').click()
      .get('.notification').should('contain', 'Passwords must match.')
      .url().should('include', '/profile/edit/password');
  });
  
  it('should navigate to the profile with a successful password update, ' + 
    'not be able to log in with old password, log in with new password', () => {
    cy
      .visit('/profile/edit/password')
      .url().should('include', '/profile/edit/password')
      .get('#password').type('newpassword')
      .get('#passwordConfirmation').type('newpassword')
      .get('[data-test=submit-button]').click()
      .get('.notification').invoke('text')
      .should('contain', 'Your password was successfully updated.')
      .url().should('include', '/profile')
      .get('[data-target=navbarMenu]').click()
      .get('[data-test=navbar-logout]')
      .should('contain', 'Log Out')
      .click().url().should('include', '/')
      .visit('/login')
      .url().should('include', '/login')
      .get('#email').type('verified@email.com')
      .get('#password').type('password') // old password
      .get('form').submit()
      .get('.notification').invoke('text').should('contain', 'The login information was incorrect.')
      .url().should('include', '/login')
      .get('#password').clear().type('newpassword') // new password
      .get('form').submit()
      .url().should('include', '/profile');
  });
});