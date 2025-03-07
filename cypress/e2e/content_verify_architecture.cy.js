describe('Architecture Chat Interaction and Verification Test', () => {
  before(() => {
    cy.fixture('url').then(function (urlData) {
      this.urlData = urlData;
    });
  });

  it('should verify chat interaction and discussion results', function () {
    // Login and navigation
    cy.visit(this.urlData.baseUrl + this.urlData.loginUrl);
    cy.get('#username').type('derrick@kavia.ai');
    cy.get('[placeholder="Password"]').type('Samuel@1996');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 150000 }).should('include', this.urlData.dashboardUrl);
    
    cy.contains('Application').click();
    cy.wait(3000);
    
    cy.contains('Test App')
      .should('be.visible')
      .click();

    // cy.url().should('include', '/overview');
    // cy.wait(5000);
    
    // cy.get('button[id*="radix"]:contains("More")')
    //   .should('be.visible')
    //   .click();
    
    cy.contains('Architecture')
      .should('be.visible')
      .click();
    
    cy.url().should('include', '/architecture/architecture-requirement');
    
    // Click Update Architecture Requirements
    cy.contains('Update architecture requirement')
      .should('be.visible')
      .click();

    cy.wait(100000);

    // Chat interaction with response validation
    cy.get('#chat-input')
      .should('be.visible')
      .type('make assumptions', { force: true });

    cy.wait(10000);
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click({multiple: true, force: true});

    // Wait for response generation
    cy.wait(70000);

    // Get complete response text
    cy.get('.project-panel-content.break-words')
      .invoke('text')
      .then((responseText) => {
        // Verify response is not empty and contains meaningful content
        expect(responseText.length).to.be.greaterThan(100);
        // Store for later comparison
        cy.wrap(responseText).as('originalResponse');
      });

    cy.wait(5000);

    // Capture discussion ID
    cy.get('a[href*="discussion_id"] p')
      .invoke('text')
      .then((text) => {
        const discussionId = text.trim();
        cy.wrap(discussionId).as('discussionId');
      });

    // Close the window
    cy.get('button[aria-label="Click here to close this window"]').click({force: true});

    // Open past discussions
    cy.get('button[aria-label="Menu"]', {timeout: 10000})
      .should('be.visible')
      .click({force: true});

    cy.contains('View previous discussions about this requirement', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });

    // Click on the latest discussion
    cy.get('@discussionId').then((discussionId) => {
      cy.contains(discussionId, { timeout: 10000 })
        .should('exist')
        .click();
    });

    // Verify the content matches with retries
    cy.get('.project-panel-content.break-words')
      .should('be.visible')
      .should('not.contain', 'Setting up your discussion…')
      .wait(5000)
      .invoke('text')
      .then((pastText) => {
        cy.get('@originalResponse').then((originalText) => {
          // Extract the response part after "make assumptions" from both texts
          const pastResponse = pastText.split('make assumptions')[1];
          const originalResponse = originalText.split('make assumptions')[1];
          
          // Compare only the actual response portions
          expect(pastResponse.trim()).to.equal(originalResponse.trim());
          cy.log('Content verification successful - Response content matches');
        });
      });
  });
});
