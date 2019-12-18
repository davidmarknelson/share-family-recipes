describe('Recipe Browse', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('no meals', () => {
    it('should show an error if there are no meals', () => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .visit('/recipes')
        .url().should('include', '/recipes')
        .get('.notification').should('contain', 'There are no recipes.');
    });
  });

  describe('signed in user', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed')
      .request('POST', 'http://localhost:3000/tests/seedmeal')
      .request('POST', 'http://localhost:3000/tests/seedmeal2')
      .login('verified@email.com', 'password');
    });

    it('should show the newest recipe when the page loads', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and rice')
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and fries');
    });

    it('should populate the page and navigate to the recipe', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('.is-accent').first().click()
        .url().should('include', '/recipes/2')
        .get('.page-header__title').should('contain', 'Chicken and rice');
    });

    it('should show the recipes when the user changes the sorting options', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and rice')
        .get('[data-test=sorting-select]').select('Oldest').wait(1000)
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and rice')
        .get('[data-test=sorting-select]').select('A - Z').wait(1000)
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and rice')
        .get('[data-test=sorting-select]').select('Z - A').wait(1000)
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and rice');
    });

    it('should show the recipes when the user changes the amount options', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .wait(1000)
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and rice')
        .get('[data-test=amount-select]').select('Show 18').wait(1000)
        .get('[data-test=recipe-count]').should('contain', '1-2 of 2');
    });

    it('should like and save a recipe', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=likes]').first().should('contain', '0')
        .get('[data-test=like-btn]').first().click()
        .get('[data-test=likes]').first().should('contain', '1')
        .get('[data-test=like-btn]').first().click()
        .get('[data-test=likes]').first().should('contain', '0')
        .get('[data-test=save-button]').first().should('contain', 'Save')
        .get('[data-test=save-button]').first().click()
        .get('[data-test=save-button]').first().should('contain', 'Saved')
        .get('[data-test=save-button]').first().click()
        .get('[data-test=save-button]').first().should('contain', 'Save');
    });
  });

  describe('user not signed in', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .request('POST', 'http://localhost:3000/tests/seedmeal2');
    });

    it('should not be able to like or save a recipe', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=like-btn]').first().click()
        .get('.notification').invoke('text')
        .should('contain', 'You must be signed in to do that.')
        .get('.delete').click()
        .get('[data-test=save-button]').first().click()
        .get('.notification').invoke('text')
        .should('contain', 'You must be signed in to do that.');
    });
  });
});