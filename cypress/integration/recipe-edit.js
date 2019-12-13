function createLongValue() {
  let value = '';
  for (let i = 0; i < 151; i++) {
    value = value + 'a';
  }
  return value;
}

describe('Recipe edit', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('page errors for user who is not the creator', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('unverified@email.com', 'password');
    });

    it('should show when the user is not the creator of the recipe', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .get('.message-body').should('contain', 'You do not have permission to edit this recipe.');
    });
  });

  describe('page errors for creator', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .login('verified@email.com', 'password');
    });

    it('should show when the recipe parameter is not in the url', () => {
      cy
        .visit('/create/edit')
        .url().should('include', '/create/edit')
        .get('.message-body').should('contain', 'There is no recipe selected to edit.');
    });

    it('should show when the recipe parameter in the url is not a number', () => {
      cy
        .visit('/create/edit?recipe=eggs')
        .url().should('include', '/create/edit?recipe=eggs')
        .get('.message-body').should('contain', 'There was an error getting your recipe to edit.');
    });
  });

  describe('form', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .login('verified@email.com', 'password');
    });

    it('should populate the form with the recipe to edit', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('[data-test=name]').invoke('val').should('contain', 'Chicken and fries')
        .get('[data-test=description]').invoke('val')
        .should('contain', 'A yummy fried chicken dish with hot baked fries')
        .get('#6').invoke('val').should('contain', 'oil');
    });

    it('should submit the form with the values given from the recipe', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.');
    });

    it('should show errors for inputs', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('[data-test=nameAvailable]').should('exist')
        .get('[data-test=name]').clear().type('chicken and fries')
        .wait(1000)
        .get('[data-test=nameAvailable]').should('exist')
        .get('[data-test=name]').clear()
        .get('[data-test=nameRequired]').should('exist')
        .get('[data-test=name]').clear().type('Sandwich')
        .get('[data-test=nameAvailable]').should('exist')
        .get('#description').clear()
        .get('[data-test=descriptionRequired').should('exist')
        .get('#description').type('test')
        .get('[data-test=descriptionCount]').should('contain', '4/150')
        .get('#description').clear().type(createLongValue())
        .get('[data-test=descriptionMaxLength').should('exist')
        .get('[data-test=removeIngredient]').click({ multiple: true })
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=ingredientErrorMsg]').should('contain', 'You must have at least 1 ingredient.')
        .get('[data-test=ingredient]').clear()
        .get('[data-test=ingredientRequired').should('exist')
        .get('[data-test=removeInstruction]').click({ multiple: true })
        .get('[data-test=removeInstruction]').click()
        .get('[data-test=instructionErrorMsg]').should('contain', 'You must have at least 1 instruction.')
        .get('[data-test=instruction').clear()
        .get('[data-test=instructionRequired').should('exist')
        .get('[data-test=cookTime]').clear().type('a')
        .get('[data-test=cookTimePattern]').should('exist')
        .get('[data-test=difficulty]').clear().type('a')
        .get('[data-test=difficultyPattern]').should('exist')
        .get('[data-test=difficulty]').clear().type('6')
        .get('[data-test=difficultyPattern]').should('exist')
        .get('[data-test=submit-button').click()
        .url().should('include', '/create/edit?recipe=1');
    });

    it('should submit the form with the changed values', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('#name').clear().type('Tasty food')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.')
        .get('.page-header__title').should('contain', 'Tasty food');
    });

    it('should remove the original recipe and youtube url from the database when the inputs are cleared', () => {
      cy
        .visit('/recipes/1')
        .get('.page-header__title').should('contain', 'Chicken and fries')
        .get('[data-test=originalRecipeUrl]').should('exist')
        .get('[data-test=youtubeUrl]').should('exist')
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('#originalRecipeUrl').clear()
        .get('#youtubeUrl').clear()
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.')
        .get('.page-header__title').should('contain', 'Chicken and fries')
        .get('[data-test=originalRecipeUrl]').should('not.exist')
        .get('[data-test=youtubeUrl]').should('not.exist');
    });

    it('should show an error if the youtube url is too short', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('#youtubeUrl').clear().type('www.wrongvalue.com')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/create/edit?recipe=1')
        .get('[data-test=formErrorMsg]').should('contain', 'There was an error with your YouTube link.');
    });

    it('should not add an extra http at the beginning of the originalRecipeUrl', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000)
        .get('#originalRecipeUrl').clear().type('http://example.com')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.')
        .get('.page-header__title').should('contain', 'Chicken and fries')
        .get('[data-test=originalRecipeUrl] > p > a')
        .should('contain', 'http://example.com');
    });
  });

  describe('Delete profile', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .login('verified@email.com', 'password');
    });

    it('should delete the user when clicking the delete button in the modal and the close buttons should work', () => {
      cy
        .visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .get('[data-test=delete-button]').click()
        .get('.modal').should('be.visible')
        .get('[data-test=modal-cancel]').click()
        .get('.modal').should('not.be.visible')
        .get('[data-test=delete-button]').click()
        .get('.modal').should('be.visible')
        .get('[data-test=modal-close]').click()
        .get('.modal').should('not.be.visible')
        .get('[data-test=delete-button]').click()
        .get('.modal').should('be.visible')
        .get('[data-test=modal-delete]').click()
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully deleted.')
        .url().should('include', '/recipes');
    });
  });
});