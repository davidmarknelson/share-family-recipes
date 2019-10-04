describe('Signup', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });
  
  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3000/tests/delete');
  });

  it('should navigate to the profile with valid credentials', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('example@email.com')
      .get('#username').type('myUser').wait(2000)
      .get('#password').type('password')
      .get('#passwordConfirmation').type('password')
      .get('form').submit()
      .url().should('include', '/profile');
  });

  it('should show an error if a username is already taken', () => {
    cy.request('POST', 'http://localhost:3000/tests/seed');

    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('example@email.com')
      .get('#username').type('johndoe').wait(2000)
      .get('[data-test=usernameUnavailable]').should('contain', 'This username is already taken');
  });

  it('should show an error if an email is already taken', () => {
    cy.request('POST', 'http://localhost:3000/tests/seed');

    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('test@email.com')
      .get('#username').type('johndoe2').wait(2000)
      .get('#password').type('password')
      .get('#passwordConfirmation').type('password')
      .get('form').submit().wait(1000)
      .get('.notification').should('contain', 'This email account is already in use.')
      .get('[data-test=emailTaken]').should('contain', 'This email account is already in use.')
      .get('#email').clear().type('example@email.com')
      .get('[data-test=emailTaken]').should('not.exist')
      .get('form').submit().wait(1000)
      .url().should('include', '/profile');
  });
});