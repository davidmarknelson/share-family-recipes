describe('Log In', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');

    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed');
  });

  it('should show an error if the email does not exist', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#email').type('wrong@email.com')
      .get('#password').type('password')
      .get('form').submit()
      .wait(1000)
      .get('.notification').invoke('text').should('contain', 'The login information was incorrect.');
  });

  it('should show an error if the password is incorrect', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#email').type('verified@email.com')
      .get('#password').type('passwords')
      .get('form').submit()
      .wait(1000)
      .get('.notification').invoke('text').should('contain', 'The login information was incorrect.');
  });

  it('should show redirect a user when there is a successful login', () => {
    cy
      .visit('/login')
      .url().should('include', '/login')
      .get('#email').type('verified@email.com')
      .get('#password').type('password')
      .get('form').submit()
      .wait(1000)
      .url().should('include', '/profile');;
  });
});