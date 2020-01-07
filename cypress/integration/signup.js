require('cypress-file-upload');

describe('Signup', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
  });

  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seed');
  });

  it('should navigate to the profile with valid credentials without a profile image', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('example@email.com')
      .get('#username').type('myUser').wait(1000)
      .get('#password').type('password')
      .get('#passwordConfirmation').type('password')
      .get('form').submit()
      .url().should('include', '/profile');
  });

  it('should show an error if a username is already taken', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('example@email.com')
      .get('#username').type('verifiedUser').wait(1000)
      .get('[data-test=usernameUnavailable]').should('contain', 'This username is already taken');
  });

  it('should show an error if an email is already taken', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('verified@email.com')
      .get('#username').type('newUser').wait(1000)
      .get('#password').type('password')
      .get('#passwordConfirmation').type('password')
      .get('form').submit().wait(1000)
      .get('.notification').should('contain', 'This email account is already in use.')
      .get('[data-test=emailTaken]').should('contain', 'This email account is already in use.')
      .get('#email').clear().type('new@email.com')
      .get('[data-test=emailTaken]').should('not.exist')
      .get('form').submit().wait(1000)
      .url().should('include', '/profile');
  });

  it('should upload a profile image and submit the form', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup')
      .get('#firstName').type('John')
      .get('#lastName').type('Doe')
      .get('#email').type('example@email.com')
      .get('#username').type('myUser').wait(1000)
      .get('#password').type('password')
      .get('#passwordConfirmation').type('password');

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
      .get('form').submit()
      .url().should('include', '/profile')
      .get('[data-test=profilePic]').should('have.attr', 'src', 'https://url');
  });

  it('should show an error if the image is not jpeg', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup');

    // stub calls to cloudinary
    cy.server();
    cy.fixture('uploadedPicResponse.json').then(uploadedPicResponse => {
      cy.route({
        method: 'POST',      // Route all POST requests
        url: 'https://api.cloudinary.com/v1_1/**',    // that have a URL that matches this
        response: uploadedPicResponse // and force the response to be this
      });
    });

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

  it('should show an error from cloudinary', () => {
    cy
      .visit('/signup')
      .url().should('include', '/signup');

    // stub calls to cloudinary
    cy.server();
    cy.route({
      method: 'POST',      // Route all POST requests
      url: 'https://api.cloudinary.com/v1_1/**',    // that have a URL that matches this
      response: {message: 'Oops! Server error!'}, // and force the response to be this
      status: 500
    });

    cy.fixture('testImg.jpg').then(fileContent => {
      cy.get('[type=file]').upload({ fileContent, fileName: 'testImg.jpg', mimeType: 'image/jpeg' });
    });

    cy.get('.file-name').should('contain', 'testImg.jpg')
      .get('[data-test=upload-btn]').click().wait(1000)
      .get('[data-test=image-err-msg]')
      .should('contain', 'Error uploading your picture.')
      .get('[data-test=clear-img-err-msg]').click()
      .get('[data-test=image-err-msg]').should('not.exist')
      .get('.file-name').should('contain', 'testImg.jpg')
      .get('[data-test=remove-img-btn]').click()
      .get('.file-name').should('contain', 'example.jpeg');
  });
});