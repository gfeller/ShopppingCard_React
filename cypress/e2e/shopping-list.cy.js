/// <reference types="cypress" />
/* eslint-disable */
describe("shopping-list", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit("http://localhost:3000");
  });

  it("open add new list dialog", () => {
    cy.get(".addNewList").click();
    cy.get("h2").should("have.text", "Neue Liste erfassen");
  });

  it("add new list", () => {
    cy.get(".addNewList").click();
    cy.get("input").type("Test list");
    cy.get('[data-testid="createNewList"]').click();
    cy.get('[data-testid="Test list"]').should("exist");
  });

  it("edit list", () => {
    cy.get('[data-testid="Test list"]').click();
    cy.get(`[aria-label="edit"]`).click();
  });
});
