require('cypress-file-upload');

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

    it('should remove the youtube url from the database when the inputs are cleared', () => {
      cy
        .visit('/recipes/1')
        .get('.page-header__title').should('contain', 'Chicken and fries')
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
  });

  describe('image', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedmeal')
        .login('verified@email.com', 'password');
    });

    it('should update the recipe with the image', () => {
      cy.visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000);

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
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.')
        .get('.center-img').should('have.attr', 'src', 'https://url');
    });

    it('should update the recipe after removing the uploaded image and not change the image url', () => {
      cy.visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000);

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
        .url().should('include', '/recipes/1')
        .get('.notification').invoke('text')
        .should('contain', 'Recipe successfully updated.')
        .get('.center-img')
        .should('have.attr', 'src', '../../../../assets/images/default-img/default-meal-pic.jpg');
    });

    it('should show an error if the image is not jpeg', () => {
      cy.visit('/create/edit?recipe=1')
        .url().should('include', '/create/edit?recipe=1')
        .wait(1000);
  
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

  describe('Delete recipe', () => {
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