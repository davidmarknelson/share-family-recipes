describe('Navbar', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.visit('/');
  });

  describe('a user who isn\'t logged in', () => {
    it('should show a link to signup', () => {
      cy
        .get('[data-target=navbarMenu]').click()
        .get('[data-test=navbar-signup]').click()
        .url().should('include', '/signup');
    });

    it('should redirect to the base url when the navbar brand is clicked', () => {
      cy
        .get('[data-test=navbar-brand]').click().url().should('include', '/');
    });
  });

  describe('a user who is logged in', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should show a link to logout', () => {
      cy
        .get('[data-target=navbarMenu]').click()
        .get('[data-test=navbar-logout]')
        .should('contain', 'Log Out')
        .click().url().should('include', '/');
    });
  });
});