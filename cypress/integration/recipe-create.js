require('cypress-file-upload');

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
    it('should show in the appropriate fields', () => {
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
        .get('[data-test=name]').type('Chicken and fries')
        .wait(1000)
        .get('[data-test=nameUnavailable]').should('exist')
        .get('[data-test=name]').clear().type('chicken and fries')
        .wait(1000)
        .get('[data-test=nameUnavailable]').should('exist')
        .get('[data-test=removeIngredient]').click()
        .get('[data-test=ingredientErrorMsg]').should('contain', 'You must have at least 1 ingredient. ')
        .get('[data-test=removeInstruction]').click()
        .get('[data-test=instructionErrorMsg]').should('contain', 'You must have at least 1 instruction. ')
        .get('[data-test=cookTime]').type('a')
        .get('[data-test=cookTimePattern]').should('exist')
        .get('[data-test=difficulty]').type('a')
        .get('[data-test=difficultyPattern]').should('exist')
        .get('[data-test=difficulty]').clear().type('6')
        .get('[data-test=difficultyPattern]').should('exist')
        .get('textarea').type(createLongValue())
        .get('[data-test=descriptionMaxLength]').should('exist');
    });
  });

  describe('image', () => {
    it('should create the recipe with the image', () => {
      cy.visit('/create')
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
        .get('[data-test=difficulty]').type('1');

      // stub calls to cloudinary
      cy.server();
      cy.fixture('uploadedPicResponse.json').then(uploadedPicResponse => {
        cy.route({
          method: 'POST',      // Route all POST requests
          url: 'https://api.cloudinary.com/v1_1/**',    // that have a URL that matches this
          response: uploadedPicResponse // and force the response to be this
        });
      });

      cy.fixture('testImg.jpg').then(fileContent => {
        cy.get('[type=file]').upload({ fileContent, fileName: 'testImg.jpg', mimeType: 'image/jpeg' });
      });

      cy.get('[data-test=upload-btn]').click()
        .get('[data-test=uploading-complete]').should('contain', 'Upload complete')
        .get('.file-name').should('contain', 'testImg.jpg')
        .get('[data-test=submit-button]').click()
        .url().should('include', '/recipes/2')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully created.')
        .get('.center-img').should('have.attr', 'src', 'https://url');
    });

    it('should create the recipe after removing the uploaded image and not change the image url', () => {
      cy.visit('/create')
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
        .get('[data-test=difficulty]').type('1');

      // stub calls to cloudinary. This will be fine for the delete call because it 
      // only requires a successful response
      cy.server();
      cy.fixture('uploadedPicResponse.json').then(uploadedPicResponse => {
        cy.route({
          method: 'POST',      // Route all POST requests
          url: 'https://api.cloudinary.com/v1_1/**',    // that have a URL that matches this
          response: uploadedPicResponse // and force the response to be this
        });
      });

      cy.fixture('testImg.jpg').then(fileContent => {
        cy.get('[type=file]').upload({ fileContent, fileName: 'testImg.jpg', mimeType: 'image/jpeg' });
      });

      cy.get('[data-test=upload-btn]').click()
        .get('[data-test=uploading-complete]').should('contain', 'Upload complete')
        .get('.file-name').should('contain', 'testImg.jpg')
        .get('[data-test=remove-img-btn]').click()
        .get('.notification').invoke('text')
        .should('contain', 'Image was successfully removed.')
        .get('.notification > .delete').click()
        .get('.file-name').should('contain', 'example.jpeg')
        .get('form').submit()
        .url().should('include', '/recipes/2')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully created.')
        .get('.center-img')
        .should('have.attr', 'src', '../../../../assets/images/default-img/default-meal-pic.jpg');
    });

    it('should show an error if the image is not jpeg', () => {
      cy.visit('/create')
        .url().should('include', '/create');
  
      cy.fixture('testImagePng.png').then(fileContent => {
        cy.get('[type=file]').upload({ fileContent, fileName: 'testImagePng.png', mimeType: 'image/png' });
      });
  
      cy.get('[data-test=image-err-msg]')
        .should('contain', 'Your picture must be a JPEG image.')
        .get('[data-test=clear-img-err-msg]').click()
        .get('[data-test=image-err-msg]').should('not.exist')
        .get('.file-name').should('contain', 'testImagePng.png')
        .get('[data-test=remove-img-btn]').click()
        .get('.file-name').should('contain', 'example.jpeg');
    });
  });

});