require('cypress-file-upload');

describe('Edit profile', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  describe('First Name', () => {
    before(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should navigate to the profile after a successful update with only changing the first name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=name]').should('contain', 'John Doe')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#firstName').type('Joe')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=name]').should('contain', 'Joe Doe');
    });
  });

  describe('Last Name', () => {
    before(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should navigate to the profile after a successful update with only changing the last name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=name]').should('contain', 'John Doe')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#lastName').type('Smith')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=name]').should('contain', 'John Smith');
    });
  });

  describe('Email', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('verified@email.com', 'password');
    });

    it('should update the email and change the email to unverified', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=emailVerifyMsg]').should('not.exist')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('new@email.com')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=email]').should('contain', 'new@email.com')
        .get('[data-test=emailVerifyMsg]').should('exist');
    });

    it('should show an error message if someone is already using the email', () => {
      cy
        .visit('/profile')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('unverified@email.com')
        .get('form').submit()
        .get('.notification')
        .should('contain', 'This email account is already in use.');
    });

    it('should remove the error message on the email input after the user changes the email', () => {
      cy
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#email').type('unverified@email.com')
        .get('form').submit()
        .get('.notification')
        .should('contain', 'This email account is already in use.')
        .get('#email').clear().type('new@email.com')
        .get('[data-test=emailTaken]').should('not.exist');
    });
  });

  describe('Username', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('verified@email.com', 'password');
    });

    it('should show an error message when the username is already taken', () => {
      cy
      .visit('/profile/edit')
      .url().should('include', '/profile/edit')
      .get('#username').type('unverifiedUser')
      .wait(1000)
      .get('[data-test=usernameUnavailable]').should('exist');
    });

    it('should show a message when the username is available', () => {
      cy
      .visit('/profile/edit')
      .url().should('include', '/profile/edit')
      .get('#username').type('newUser')
      .wait(1000)
      .get('[data-test=usernameAvailable]').should('exist');
    });

    it('should navigate to the profile after a successful update with only changing the last name', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=username]').should('contain', 'verifiedUser')
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('#username').type('newUser')
        .wait(1000)
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=username]').should('contain', 'newUser');
    });
  });

  describe('Delete profile', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should delete the user when clicking the delete button in the modal and the close buttons should work', () => {
      cy
        .visit('/profile/edit')
        .url().should('include', '/profile/edit')
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
        .should('contain', 'Profile successfully deleted.')
        .url().should('include', '/');
    });
  });

  describe('image', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .login('verified@email.com', 'password');
    });

    it('should update the user with only changing the image', () => {
      cy.visit('/profile/edit')
        .url().should('include', '/profile/edit')

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
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=profilePic]').should('have.attr', 'src', 'https://url');
    });

    it('should update the user after removing the uploaded image and not change the image url', () => {
      cy.visit('/profile/edit')
        .url().should('include', '/profile/edit');

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
        .get('#firstName').type('James')
        .get('form').submit()
        .url().should('include', '/profile')
        .get('.notification').invoke('text')
        .should('contain', 'Profile successfully updated.')
        .get('[data-test=profilePic]')
        .should('have.attr', 'src', '../../../assets/images/default-img/default-profile-pic.jpg');
    });

    it('should show an error if the image is not jpeg', () => {
      cy.visit('/profile/edit')
        .url().should('include', '/profile/edit');
  
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

  describe('empty form', () => {
    beforeEach(() => {
      cy.request('DELETE', 'http://localhost:3000/tests/delete')
        .request('POST', 'http://localhost:3000/tests/seed')
        .request('POST', 'http://localhost:3000/tests/seedunverified')
        .login('verified@email.com', 'password');
    });

    it('should not submit an empty form that also does not have an image', () => {
      cy.visit('/profile/edit')
        .url().should('include', '/profile/edit')
        .get('form').submit()
        .url().should('include', '/profile/edit')
        .get('.notification').should('contain', 'You must enter information to change your profile.');
    });
  });
});