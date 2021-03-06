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
        .get('.message-body').should('contain', 'That recipe does not exist.');
    });

    it('should show for a recipe that does not exist with the name', () => {
      cy
        .visit('/recipes/pizza')
        .url().should('include', '/recipes/pizza')
        .get('.message-body').should('contain', 'That recipe does not exist.');
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

  describe('likes', () => {
    beforeEach(() => {
      cy.login('verified@email.com', 'password');
    });

    it('should add and remove likes', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('[data-test=likes]').should('contain', '0')
        .get('.btn').click()
        .get('[data-test=likes]').should('contain', '1')
        .get('.btn').click()
        .get('[data-test=likes]').should('contain', '0');
    });
  });

  describe('likes for a user not signed in', () => {
    it('should show an error message', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('[data-test=likes]').should('contain', '0')
        .get('.btn').click()
        .get('.notification').invoke('text')
        .should('contain', 'You must be signed in to do that.')
        .get('[data-test=likes]').should('contain', '0');
    });
  });

  describe('saves', () => {
    beforeEach(() => {
      cy.login('verified@email.com', 'password');
    });

    it('should save and unsave a recipe', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('[data-test=save-button]').should('contain', 'Save')
        .get('[data-test=save-button]').click()
        .get('[data-test=save-button]').should('contain', 'Saved')
        .get('[data-test=save-button]').click()
        .get('[data-test=save-button]').should('contain', 'Save');
    });
  });

  describe('saves for a user not signed in', () => {
    it('should show an error message', () => {
      cy
        .visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('[data-test=save-button]').click()
        .get('.notification').invoke('text')
        .should('contain', 'You must be signed in to do that.');
    });
  });

});