describe('Requirements Chat Interaction and Verification Test', () => {
  const TIMEOUT = {
    SHORT: 5000,
    MEDIUM: 20000,
    LONG: 50000
  };

  before(() => {
    cy.fixture('url').then(function (urlData) {
      this.urlData = urlData;
    });
  });

  it('should verify chat interaction and discussion results', function () {
    // Login using custom command
    cy.login();
    
    cy.contains('Application', { timeout: TIMEOUT.SHORT }).click();
    
    cy.contains('Test App', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    
    cy.contains('Requirements', { timeout: TIMEOUT.SHORT })
      .should('be.visible')
      .click();

    cy.url({ timeout: TIMEOUT.SHORT }).should('include', '/requirements');
    
    cy.get('button[aria-label="Update an existing requirement"]', { timeout: TIMEOUT.SHORT })
      .should('be.visible')
      .click();
    cy.wait(TIMEOUT.LONG);
    // Chat interaction with response validation
    cy.get('#chat-input', { timeout: TIMEOUT.LONG })
      .should('be.visible')
      .type('make assumptions', { force: true });

    cy.get('button[type="submit"]', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click({ force: true });
    cy.wait(TIMEOUT.LONG);
    // Get complete response text
    cy.get('.project-panel-content.break-words', { timeout: TIMEOUT.LONG })
      .invoke('text')
      .then((responseText) => {
        expect(responseText.length).to.be.greaterThan(100);
        cy.wrap(responseText).as('originalResponse');
      });

    // Capture discussion ID
    cy.get('a[href*="discussion_id"] p', { timeout: TIMEOUT.SHORT })
      .invoke('text')
      .then((text) => {
        const discussionId = text.trim();
        cy.wrap(discussionId).as('discussionId');
      });

    // Close the window
    cy.get('button[aria-label="Click here to close this window"]', { timeout: TIMEOUT.SHORT })
      .click({ force: true });
  
    // Open past discussions
    cy.get('button[aria-label="Menu"]', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click({ force: true });

    cy.contains('View past discussion', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click({ force: true });

    // Click on the latest discussion
    cy.get('@discussionId').then((discussionId) => {
      cy.contains(discussionId, { timeout: TIMEOUT.MEDIUM })
        .should('exist')
        .click();
    });

    // Verify the content matches
    cy.get('.project-panel-content.break-words', { timeout: TIMEOUT.LONG })
      .should('be.visible')
      .should('not.contain', 'Setting up your discussion…')
      .invoke('text')
      .then((pastText) => {
        cy.get('@originalResponse').then((originalText) => {
          const pastResponse = pastText.split('make assumptions')[1];
          const originalResponse = originalText.split('make assumptions')[1];
          
          expect(pastResponse.trim()).to.equal(originalResponse.trim());
          cy.log('Content verification successful - Response content matches');
        });
      });
  });
});
