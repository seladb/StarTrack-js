describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/#/");

    cy.get("input").eq(0).as("userInput");
    cy.get("input").eq(1).as("repoInput");
    cy.get("button").contains("Go!").as("goButton");

    cy.get("@userInput").type("seladb");
    cy.get("@repoInput").type("startrack-js");

    cy.get("@goButton").click();

    cy.get("@userInput").clear().type("seladb");
    cy.get("@repoInput").clear().type("pickledb-rs");

    cy.get("@goButton").click();
  });
});
