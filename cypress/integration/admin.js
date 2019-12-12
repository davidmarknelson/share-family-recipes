import { get } from "selenium-webdriver/http";

describe('Admin Page', () => {
  before(() => {
    Cypress.config('baseUrl', 'http://localhost:4200');
    cy.request('DELETE', 'http://localhost:3000/tests/delete')
      .request('POST', 'http://localhost:3000/tests/seedmultipleusers')
      .request('POST', 'http://localhost:3000/tests/seed')
      .request('POST', 'http://localhost:3000/tests/seedunverified');
  });

  describe('non-admin user', () => {
    beforeEach(() => {
      cy.login('unverified@email.com', 'password');
    });

    it('should not show the admin button to the admin page for a non-admin user', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=admin-link]').should('not.exist');
    });

    it('should navigate to the admin page for an admin user', () => {
      cy
        .visit('/profile/admin')
        .url().should('not.include', 'admin')
        .url().should('include', '/')
        .get('.notification').invoke('text')
        .should('include', 'You must be an admin to view that page.');
    });
  });

  describe('admin user', () => {
    beforeEach(() => {
      cy.login('verified@email.com', 'password');
    });

    it('should navigate to the admin page for an admin user', () => {
      cy
        .visit('/profile')
        .url().should('include', '/profile')
        .get('[data-test=admin-link]').should('exist')
        .click()
        .url().should('include', '/profile/admin');
    });

    it('should populate the table by newest users', () => {
      cy
        .visit('/profile/admin')
        .url().should('include', '/profile/admin')
        .get('[data-test=headerSignedUp]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('include', 'verifiedUser');
    });

    it('should change order of users when each header is clicked', () => {
      cy
        .visit('/profile/admin')
        .url().should('include', '/profile/admin')
        // sort by date
        .get('[data-test=headerSignedUp]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('include', 'verifiedUser')
        .get('[data-test=headerSignedUp]')
        .click().wait(1000)
        .get('[data-test=headerSignedUp]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('not.include', 'verifiedUser')
        // sort by username
        .get('[data-test=headerUsername]')
        .click().wait(1000)
        .get('[data-test=headerUsername]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('include', '0user')
        .get('[data-test=headerUsername]')
        .click().wait(1000)
        .get('[data-test=headerUsername]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('include', 'verifiedUser')
        // sort by first name
        .get('[data-test=headerFirstName]')
        .click().wait(1000)
        .get('[data-test=headerFirstName]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(2)').invoke('text').should('include', '0user')
        .get('[data-test=headerFirstName]')
        .click().wait(1000)
        .get('[data-test=headerFirstName]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(2)').invoke('text').should('include', 'John')
        // sort by last name
        .get('[data-test=headerLastName]')
        .click().wait(1000)
        .get('[data-test=headerLastName]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(3)').invoke('text').should('include', '0user')
        .get('[data-test=headerLastName]')
        .click().wait(1000)
        .get('[data-test=headerLastName]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(3)').invoke('text').should('include', 'Doe');
    });

    it('should change the number of users shown when the option is changed', () => {
      cy
        .visit('/profile/admin')
        .url().should('include', '/profile/admin')
        .get('select').select('Show 20').wait(1000)
        .get('tbody tr').should('be.length', 20)
        .get('select').select('Show 5').wait(1000)
        .get('tbody tr').should('be.length', 5)
        .get('select').select('Show 10').wait(1000)
        .get('tbody tr').should('be.length', 10);
    });
  });

  describe('admin pagination', () => {
    beforeEach(() => {
      cy.login('verified@email.com', 'password');
    });

    it('should change the page when clicking on the page numbers', () => {
      cy
        .visit('/profile/admin')
        .url().should('include', '/profile/admin')
        .get('[data-test=first-ellipsis]').should('not.exist')
        .get('[data-test=second-ellipsis]').should('not.exist')
        .get('.pagination-previous').should('not.exist')
        .get('.pagination-next').should('exist')
        .get('.pagination > ul > li:nth-child(3)').click().wait(1000)
        .get('.pagination-previous').should('exist')
        .get('.pagination-next').should('exist')
        .get('[data-test=headerSignedUp]')
        .should('have.class', 'table__sorted-column')
        .get('tbody tr:nth-child(1) td:nth-child(1)').invoke('text').should('not.include', 'verifiedUser')
        .get('.pagination > ul > li:nth-child(5)').click().wait(1000)
        .get('tbody tr').should('be.length', 7)
        .get('.pagination-previous').should('exist')
        .get('.pagination-next').should('not.exist');
    });
  });
});