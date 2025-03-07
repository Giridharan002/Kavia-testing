// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.fixture('url.json').then((urlData) => {
    cy.visit(`${urlData.baseUrl}${urlData.loginUrl}`);
    
    // Use Cypress.env() instead of process.env
    // Or use hardcoded values as fallback
    const username = Cypress.env('USERNAME') || 'derrick@kavia.ai';
    const password = Cypress.env('PASSWORD') || 'Samuel@1996';
    
    cy.get('#username').type(username);
    cy.get('[placeholder="Password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 100000 }).should('include', urlData.dashboardUrl);
  });
});
