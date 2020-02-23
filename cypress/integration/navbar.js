describe("Navbar", () => {
  before(() => {
    Cypress.config("baseUrl", "http://localhost:4200");
  });

  beforeEach(() => {
    cy.visit("/");
  });

  describe("a user who isn't logged in", () => {
    it("should show a link to signup", () => {
      cy.get("[data-target=navbarMenu]")
        .click()
        .get("[data-test=navbar-signup]")
        .click()
        .url()
        .should("include", "/signup");
    });

    it("should redirect to the base url when the navbar brand is clicked", () => {
      cy.get("[data-test=navbar-brand]")
        .click()
        .url()
        .should("include", "/");
    });
  });

  describe("a user who is logged in", () => {
    beforeEach(() => {
      cy.request("DELETE", "http://localhost:3000/tests/delete")
        .request("POST", "http://localhost:3000/tests/seed")
        .login("verified@email.com", "password");
    });

    it("should show a link to logout", () => {
      cy.get("[data-target=navbarMenu]")
        .click()
        .get("[data-test=navbar-logout]")
        .should("contain", "Log Out")
        .click()
        .url()
        .should("include", "/");
    });
  });

  describe("searchbar", () => {
    beforeEach(() => {
      cy.request("DELETE", "http://localhost:3000/tests/delete")
        .request("POST", "http://localhost:3000/tests/seed")
        .request("POST", "http://localhost:3000/tests/seedmeal")
        .request("POST", "http://localhost:3000/tests/seedmeal2");
    });

    it("should open and close the searchbar by clicking on the search icon", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .should("not.have.class", "search__is-open")
        .click()
        .get("#name")
        .should("exist")
        .get("[data-test=seachBarBtn]")
        .should("have.class", "search__is-open")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .should("not.have.class", "search__is-open");
    });

    it("should show a list of recipes when the user types a recipe", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get(".search__items")
        .first()
        .should("contain", "Chicken and fries")
        .get(".search__items")
        .last()
        .should("contain", "Chicken and rice");
    });

    it("should choose the option when clicked and navigate to the recipe", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get(".search__items")
        .first()
        .should("contain", "Chicken and fries")
        .get(".search__items")
        .first()
        .click()
        .get(".search__items-container")
        .should("not.exist")
        .get("[type=submit]")
        .click()
        .url()
        .should("include", "/recipes/Chicken%20and%20fries")
        .get("#name")
        .should("not.exist");
    });

    it("should choose the option with the down arrow keys and enter key", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get(".search__items")
        .first()
        .should("contain", "Chicken and fries")
        .get("#name")
        .type("{downarrow}")
        .get(".search__items")
        .first()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{downarrow}")
        .get(".search__items")
        .last()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{downarrow}")
        .get(".search__items")
        .first()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{enter}")
        .get(".search__items-container")
        .should("not.exist")
        .get("#name")
        .invoke("val")
        .should("contain", "Chicken and fries")
        .get("#name")
        .type("{enter}")
        .url()
        .should("include", "/recipes/Chicken%20and%20fries")
        .get("#name")
        .should("not.exist");
    });

    it("should choose the option with the up arrow keys and enter key", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get(".search__items")
        .first()
        .should("contain", "Chicken and fries")
        .get("#name")
        .type("{uparrow}")
        .get(".search__items")
        .last()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{uparrow}")
        .get(".search__items")
        .first()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{uparrow}")
        .get(".search__items")
        .last()
        .should("have.class", "search--highlighted")
        .get("#name")
        .type("{enter}")
        .get(".search__items-container")
        .should("not.exist")
        .get("#name")
        .invoke("val")
        .should("contain", "Chicken and rice")
        .get("#name")
        .type("{enter}")
        .url()
        .should("include", "/recipes/Chicken%20and%20rice")
        .get("#name")
        .should("not.exist");
    });

    it("should close the searchbar when the user presses the escape key twice", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get(".search__items")
        .first()
        .should("contain", "Chicken and fries")
        .get("#name")
        .type("{esc}")
        .get(".search__items-container")
        .should("not.exist")
        .get("#name")
        .should("exist")
        .get("#name")
        .type("{esc}")
        .get("#name")
        .should("not.exist");
    });

    it("should go directly to the recipe page when the user hits enter and an option is not highlighted", () => {
      cy.get("#name")
        .should("not.exist")
        .get("[data-test=seachBarBtn]")
        .click()
        .get("#name")
        .type("Chicken")
        .get("#name")
        .type("{enter}")
        .url()
        .should("include", "/recipes/Chicken")
        .get(".error-container")
        .should("exist");
    });
  });
});
