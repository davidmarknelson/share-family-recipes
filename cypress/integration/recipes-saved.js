describe('Recipe Browse', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('signed in user', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .login('verified@email.com', 'password');
    });

    it('should navigate to the saved page through the profile and show that there are no saved recipes', () => {
      cy.visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=save-list-btn]').click()
        .url().should('include', '/saved-list')
        .get('[data-test=no-recipes-msg]').should('contain', 'You have not saved any recipes.');
    });

    it('should save recipes and navigate to the saved page through the navbar', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=save-button]').first().should('contain', 'Save')
        .get('[data-test=save-button]').first().click()
        .get('[data-test=save-button]').first().should('contain', 'Saved')
        .get('[data-target=navbarMenu]').click()
        .get('[data-test=navbar-saved]').click()
        .url().should('include', '/saved-list')
        .get('.page-header__title').should('contain', 'Saved Recipes')
        .get('[data-test=recipe-name]').should('contain', 'Chicken and fries');
    });
  });

  describe('user not signed in', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete');
    });

    it('should not allow a user to go to the saved page and show an error message', () => {
      cy.visit('recipes/saved-list')
        .url().should('include', '/')
        .get('.notification').invoke('text')
        .should('contain', 'You must be signed in to do that.');
    });
  });
});