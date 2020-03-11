describe('Recipe User Browse', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('page errors', () => {
    it('should show an error message if there is not a username parameter', () => {
      cy.visit('/recipes/user-recipes')
        .url().should('include', '/recipes/user-recipes')
        .get('.error-message').should('contain', 'There was an error. You must search for a user.');
    });

    it('should show an error message if there is not a username parameter', () => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .visit('/recipes/user-recipes?username=verifiedUser')
        .url().should('include', '/recipes/user-recipes?username=verifiedUser')
        .get('[data-test=no-recipes-msg]').should('contain', 'This user has not created any recipes.');
    });
  });

  describe('user not signed in', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .request('POST', 'http://localhost:3000/tests/seedmeal2');
    });

    it('should navigate to the user recipe browse page from recipe browse page', () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=user-recipe-link]').first().click()
        .url().should('include', '/recipes/user-recipes?username=verifiedUser')
        .get('.page-header__title').should('contain', 'verifiedUser\'s Recipes');
    });

    it('should change the order of recipes with the sorting select', () => {
      cy.visit('/recipes/user-recipes?username=verifiedUser')
        .url().should('include', '/recipes/user-recipes?username=verifiedUser')
        .get('.page-header__title').should('contain', 'verifiedUser\'s Recipes')
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and rice')
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and fries')
        .get('[data-test=sorting-select]').select('Z - A').wait(1000)
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and rice')
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and fries')
        .get('[data-test=sorting-select]').select('A - Z').wait(1000)
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and rice')
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and fries');
    });

    it('should change amount of the recipes shown', () => {
      cy.visit('/recipes/user-recipes?username=verifiedUser')
        .url().should('include', '/recipes/user-recipes?username=verifiedUser')
        .get('.page-header__title').should('contain', 'verifiedUser\'s Recipes')
        .get('[data-test=recipe-name').first().should('contain', 'Chicken and fries')
        .get('[data-test=recipe-name').last().should('contain', 'Chicken and rice')
        .get('[data-test=amount-select]').select('Show 18').wait(1000)
        .get('[data-test=amount-select]').should('contain', 'Show 18')
        .get('[data-test=amount-select]').select('Show 9').wait(1000)
        .get('[data-test=amount-select]').should('contain', 'Show 9');
    });
  });

  describe("a user recipe with unsafe username", () => {
    beforeEach(() => {
      cy.request("DELETE", "http://localhost:3000/tests/delete")
        .request("POST", "http://localhost:3000/tests/seed-unsafe-username")
        .request('POST', 'http://localhost:3000/tests/seedmeal');
    });

    it("should navigate to user recipes with encoded username in the url by clicking on recipe card username link", () => {
      cy.visit('/recipes')
        .url().should('include', '/recipes')
        .get('[data-test=user-recipe-link]').first().click()
        .url().should('include', '/recipes/user-recipes?username=verifiedUser%232');
    });

    it("should navigate to user recipes with encoded username in the url by clicking on recipe page username link", () => {
      cy.visit('/recipes/1')
        .url().should('include', '/recipes/1')
        .get('[data-test=username-link]').first().click()
        .url().should('include', '/recipes/user-recipes?username=verifiedUser%232');
    });
  });

  describe('user signed in', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .request('POST', 'http://localhost:3000/tests/seedmeal2')
        .login('verified@email.com', 'password');
    });

    it('should save and like recipes', () => {
      cy.visit('/recipes/user-recipes?username=verifiedUser')
        .url().should('include', '/recipes/user-recipes?username=verifiedUser')
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
});