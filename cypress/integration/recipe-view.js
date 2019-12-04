describe('Recipe View', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed')
      .request('POST', 'http://localhost:3000/tests/seedmeal');
  });

  describe('error', () => {
    it('should show for a recipe that does not exist with the id', () => {
      cy
        .visit('/recipes/2')
        .url().should('include', '/recipes/2')
        .get('.message-body').should('contain', 'That meal does not exist.');
    });

    it('should show for a recipe that does not exist with the name', () => {
      cy
        .visit('/recipes/pizza')
        .url().should('include', '/recipes/pizza')
        .get('.message-body').should('contain', 'That meal does not exist.');
    });
  });

  describe('recipe', () => {
    it('should show a recipe and not the edit button', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('.page-header__title').should('contain', 'Chicken and fries')
        .get('[data-test=edit-btn]').should('not.exist');
    });
  });

  describe('creator', () => {
    beforeEach(() => {
      cy.login('verified@email.com', 'password');
    });

    it('should show a recipe and the edit button', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('.page-header__title').should('contain', 'Chicken and fries')
        .get('[data-test=edit-btn]').should('exist');
    });
  });

});