/*
Test Description:
The test automates the login process to the Kavia AI platform using specific credentials, 
then navigates to the Application section and selects "Test App".

After navigation, it extracts and logs two key pieces of information: 
1. The "Last Update" timestamp
2. The "Created by" user details from the application interface.
*/

describe('Login and Print Last Update and Created by Information', () => {
  const TIMEOUT = {
    SHORT: 5000,
    MEDIUM: 20000,
    LONG: 50000
  };
  
  before(() => {
    cy.fixture('url').then(function(urlData) {
      this.urlData = urlData;
    });
  });

  it('should log in and print the last update and created by information', function() {
    // Use the login command instead of hardcoded credentials
    cy.login();
    cy.log('✅ Login successful');

    // Navigate to Application with proper timeout
    cy.contains('Application', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Application');
    
    // Navigate to Test App with proper timeout
    cy.contains('Test App', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Navigated to Test App');

    // Extract "Last Update" value with proper timeout
    cy.get('span.text-gray-500', { timeout: TIMEOUT.MEDIUM })
      .contains('Last Update:')
      .next()
      .invoke('text')
      .then((text) => {
        cy.log('Last Update:', text.trim());
        console.log('Last Update:', text.trim());
      });
    cy.log('✅ Retrieved Last Update information');

    // Extract "Created by" value with proper timeout
    cy.get('span.text-gray-500', { timeout: TIMEOUT.MEDIUM })
      .contains('Created by:')
      .next()
      .invoke('text')
      .then((text) => {
        cy.log('Created by:', text.trim());
        console.log('Created by:', text.trim());
      });
    cy.log('✅ Retrieved Created by information');
    
    cy.log('✅ TEST PASSED: Successfully retrieved app metadata');
  });
});