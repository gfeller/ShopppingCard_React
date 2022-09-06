/// <reference types="cypress" />
/* eslint-disable */
describe("shopping-list", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("http://localhost:3000");
    cy.wait(500);
    //cy.get('[data-testid="login-name"]').should('have.text')
  });


  it("add / remove new list", () => {
    cy.get(".addNewList").click();
    cy.get("input").type("Test list");
    cy.get('[data-testid="createNewList"]').click();

    cy.contains('Test list').first().should("exist");


    cy.contains('Test list').first().click();
    cy.get(`[aria-label="edit"]`).first().click();

    cy.contains("Liste löschen").click()
    cy.contains("Löschen bestätigen").click()
  });
});
