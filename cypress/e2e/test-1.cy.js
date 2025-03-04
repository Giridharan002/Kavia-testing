describe('Login and Print Last Update and Created by Information', () => {
  it('should log in and print the last update and created by information', () => {
    
    cy.visit('https://qa.worktool.kavia.ai/users/login?tenant_id=T0002');

    cy.get('#username').type('derrick@kavia.ai');
    cy.get('[placeholder="Password"]').type('Samuel@1996');
    cy.get('button[type="submit"]').click();

    
    cy.url({ timeout: 10000 }).should('include', '/dashboard/groups');

    cy.contains('Application').click();
    cy.wait(3000);
    cy.contains('Test App').click();

    cy.wait(5000);

    // Extract "Last Update" value
    cy.get('span.text-gray-500')
      .contains('Last Update:')
      .next()
      .invoke('text')
      .then((text) => {
        cy.log('Last Update:', text.trim());
        console.log('Last Update:', text.trim());
      });

    // Extract "Created by" value
    cy.get('span.text-gray-500')
      .contains('Created by:')
      .next()
      .invoke('text')
      .then((text) => {
        cy.log('Created by:', text.trim());
        console.log('Created by:', text.trim());
      });
  });
});
