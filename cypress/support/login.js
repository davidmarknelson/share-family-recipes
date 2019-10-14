Cypress.Commands.add('login', (email, password) => {
  cy
    .visit('/login')
    .url().should('include', '/login')
    .get('#email').type(email)
    .get('#password').type(password)
    .get('form').submit()
    .url().should('include', '/profile');
});