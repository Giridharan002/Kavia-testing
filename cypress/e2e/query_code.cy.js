describe('Query Code Analysis Test', () => {
    const TIMEOUT = {
      SHORT: 5000,
      MEDIUM: 20000,
      LONG: 50000,
      VERY_LONG: 90000
    };
  
    before(() => {
      cy.fixture('url').then(function (urlData) {
        this.urlData = urlData;
      });
    });
  
    it('should verify code analysis query functionality', function () {
      // Use the login command to authenticate
      cy.login();
      cy.log('✅ Login successful');
      
      cy.contains('Application').click();
      cy.wait(TIMEOUT.SHORT);
      
      cy.contains('Test App')
        .should('be.visible')
        .click();
      cy.log('✅ Navigated to Test App');
  
      // Navigate to Query section
      cy.contains('span', 'Query')
        .should('be.visible')
        .click();
      cy.log('✅ Navigated to Query section');
      
      cy.wait(TIMEOUT.MEDIUM);
  
      // Click the checkbox
      cy.get('input[aria-label="Select all repositories"]', {timeout: TIMEOUT.SHORT})
        .click();
      cy.log('✅ Checkbox selected');
      
      // Begin a new code analysis query
      cy.get('button[aria-label="Begin a new code analysis query"]')
        .should('be.visible')
        .click({ force: true });
      cy.log('✅ Started new code analysis query');
      
      // Select Basic Query option
      cy.contains('button', 'Basic Query')
        .should('be.visible')
        .click();
      cy.log('✅ Selected Basic Query option');
      
      cy.wait(TIMEOUT.MEDIUM);
      
      // Type query in the text area
      cy.get('textarea#chat-input')
        .should('be.visible')
        .type('analyze and explain the structure of this application');
      cy.log('✅ Entered analysis prompt');
      
      cy.wait(TIMEOUT.SHORT / 5); // Short wait before clicking submit
      
      // Click send button
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click();
      cy.log('✅ Submitted query - waiting for response (this may take a while)...');
      
      // Wait for response generation (long wait as this may take time)
      cy.wait(TIMEOUT.VERY_LONG);
      cy.log('✅ Response generation time completed');
      
      // Verify an overview heading exists (using a case-insensitive check for flexibility)
      cy.get('h2', { timeout: TIMEOUT.MEDIUM })
        .should('be.visible')
        .should(($headings) => {
          const headingsText = $headings.map((i, el) => Cypress.$(el).text().toLowerCase()).get();
          const hasOverview = headingsText.some(text => text.includes('overview'));
          expect(hasOverview).to.be.true;
        });
      cy.log('✅ Verified the architecture report is generated successfully 🎉');
      
      // Verify that a Mermaid diagram is rendered
      cy.get('div[id*="mermaid"]', { timeout: TIMEOUT.MEDIUM })
        .should('be.visible')
        .should('have.attr', 'id')
        .and('include', 'mermaid');
      cy.log('✅ Verified Mermaid diagram is rendered');
      
      // Additional verification that the diagram contains SVG elements
      cy.get('div[id*="mermaid"] svg', { timeout: TIMEOUT.MEDIUM })
        .should('exist');
      cy.log('✅ TEST PASSED: Code analysis query functionality works as expected');
    });
  });