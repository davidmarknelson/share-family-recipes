function createLongValue() {
  let value = '';
  for (let i = 0; i < 151; i++) {
    value = value + 'a';
  }
  return value;
}

describe('Recipe Create', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed')
      .request('POST', 'http://localhost:3000/tests/seedmeal')
      .login('verified@email.com', 'password');
  });

  describe('new recipe', () => {
    it('should create and navigate to the recipe view page', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=name]').type('Eggs and Rice')
        .get('[data-test=description]').type(`
          A simple and delicious dish that can easily be seasoned to taste.
        `)
        .get('[data-test=ingredient]').type('3 eggs')
        .get('[data-test=addIngredientInput]').click()
        .get('#1').type('rice')
        .get('[data-test=instruction]').type('Cook eggs how you like.')
        .get('[data-test=cookTime]').type('10')
        .get('[data-test=difficulty]').type('1')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/2');
    });
  });

  describe('errors', () => {
    it('should show required fields and stop the form from submitting', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/create')
        .get('[data-test=nameRequired]').should('exist')
        .get('[data-test=descriptionRequired]').should('exist')
        .get('[data-test=ingredientRequired]').should('exist')
        .get('[data-test=instructionRequired]').should('exist')
        .get('[data-test=cookTimeRequired]').should('exist')
        .get('[data-test=difficultyRequired]').should('exist')
    });

    it('should show when the name is unavailable', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=name]').type('Chicken and fries')
        .wait(1000)
        .get('[data-test=nameUnavailable]').should('exist');
    });

    it('should show when the name is unavailable regardless of capitalization', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=name]').type('chicken and fries')
        .wait(1000)
        .get('[data-test=nameUnavailable]').should('exist');
    });

    it('should show when the tries to delete the only ingredient input', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=ingredientErrorMsg]').should('contain', 'You must have at least 1 ingredient. ');
    });

    it('should show when the tries to delete the only ingredient input', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=removeInstruction]').click()
        .get('[data-test=instructionErrorMsg]').should('contain', 'You must have at least 1 instruction. ');
    });

    it('should show a number is required for the cookTime input', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=cookTime]').type('a')
        .get('[data-test=cookTimePattern]').should('exist');
    });

    it('should show a number between 1-5 is required for the difficulty input', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('[data-test=difficulty]').type('a')
        .get('[data-test=difficultyPattern]').should('exist')
        .get('[data-test=difficulty]').clear().type('6')
        .get('[data-test=difficultyPattern]').should('exist');
    });

    it('should show when the description is more that 150 characters', () => {
      cy
        .visit('/create')
        .url().should('include', '/create')
        .get('textarea').type(createLongValue())
        .get('[data-test=descriptionMaxLength]').should('exist');
    });
  });

});