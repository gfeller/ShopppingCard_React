/// <reference types="cypress" />

describe("home", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("http://localhost:3000");
  });

  it("no list selected", () => {
    cy.get("p").should(
      "have.text",
      "Keine Liste ausgewählt. Erstellen Sie doch eine neue!"
    );
  });
});
