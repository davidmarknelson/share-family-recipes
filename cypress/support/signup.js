Cypress.Commands.add('signup', (email, password) => {
  var email = email || 'test@email.com';
  var password = password || 'password';
  cy
    .visit('/signup')
    .url().should('include', '/signup')
    .get('#firstName').type('John')
    .get('#lastName').type('Doe')
    .get('#email').type(email)
    .get('#username').type('myUser').wait(1000)
    .get('#password').type(password)
    .get('#passwordConfirmation').type(password)
    .get('form').submit()
    .url().should('include', '/profile');
});