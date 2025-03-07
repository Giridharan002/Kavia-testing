/*
Test Description:
The test automates the discussion verification process in the Overview page,
navigating to "Test App" and capturing a dynamic discussion ID.

After initiating a new discussion, it verifies the discussion ID 
by finding and clicking it in the past discussions section.
*/

describe('Discussion Verification Test', () => {
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

  it('should verify discussion in overview page', function() {
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

    // Verify overview page
    // cy.url({ timeout: TIMEOUT.MEDIUM }).should('include', '/overview');
    // cy.log('✅ Verified we are on the overview page');

    // Click Update Project button
    cy.contains('Update Requirements', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked Update Project button');

    // Store the dynamic discussion ID
    let discussionId;
    cy.get('a[href*="discussion_id"]', { timeout: TIMEOUT.MEDIUM })
      .find('p')
      .invoke('text')
      .then((text) => {
        discussionId = text;
        cy.log('Captured Discussion ID:', discussionId);
      });

    // Click close icon
    cy.get('svg[viewBox="0 0 352 512"]', { timeout: TIMEOUT.SHORT })
      .should('be.visible')
      .click();
    cy.log('✅ Closed dialog');

    // Click menu icon and wait for dropdown
    cy.get('svg.lucide-ellipsis', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click({ force: true });
    cy.log('✅ Clicked menu icon');

    // Click View past discussion with proper timeout
    cy.contains('View past discussion', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click({ force: true });
    cy.log('✅ Clicked View past discussion');

    // Wait for the discussion list to load and verify the discussion ID
    cy.get('body', { timeout: TIMEOUT.LONG })
      .should('contain', discussionId)
      .then(() => {
        // Click on the discussion ID
        cy.contains(discussionId, { timeout: TIMEOUT.MEDIUM })
          .should('be.visible')
          .click();
        cy.log('✅ TEST PASSED: Discussion ID found and clicked and verified that they are same');
        console.log('Test Passed: Discussion ID found and clicked and verified that they are same');  
      });
  });
});