describe('Architecture Discussion Verification Test', () => {
  const TIMEOUT = {
    SHORT: 5000,
    MEDIUM: 20000,
    LONG: 50000
  };

  before(() => {
    // Load URL data from fixture
    cy.fixture('url').then(function (urlData) {
      this.urlData = urlData;
    });
  });

  it('should verify discussion in architecture requirements page', function () {
    // Use the login command instead of hardcoded credentials
    cy.login();
    cy.log('✅ Login successful');

    // Navigate to Application with proper timeout
    cy.contains('Application', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Application');

    // Click on "Test App" with proper timeout
    cy.contains('Test App', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Navigated to Test App');

    // Wait for navigation to the overview page
    // cy.url({ timeout: TIMEOUT.MEDIUM }).should('include', '/overview');
    // cy.log('✅ Verified we are on the overview page');

    // Click the "More" button to open the dropdown menu
    // cy.get('button[id*="radix"]:contains("More")', { timeout: TIMEOUT.MEDIUM })
    //   .should('be.visible')
    //   .click();
    // cy.log('✅ Clicked More button');

    // Click on "Architecture" from the dropdown
    cy.contains('Architecture', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Architecture');

    // Wait for navigation to the architecture page
    // cy.url({ timeout: TIMEOUT.MEDIUM }).should('include', '/architecture/architecture-requirement');
    // cy.log('✅ Verified we are on the architecture page');

    // Click Update Architecture Requirements button
    cy.contains('Update architecture requirement', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Update architecture requirement');

    // Capture the dynamic discussion ID
    cy.get('a[href*="discussion_id"] p', { timeout: TIMEOUT.MEDIUM })
      .invoke('text')
      .then((text) => {
        const discussionId = text.trim();
        cy.log('Captured Discussion ID:', discussionId);

        if (!discussionId) {
          throw new Error('Discussion ID is empty or invalid');
        }

        cy.wrap(discussionId).as('discussionId'); // Store discussionId as alias
      });

    // Click close icon
    cy.get('button svg[viewBox="0 0 352 512"]', { timeout: TIMEOUT.MEDIUM })
      .parent('button')
      .should('be.visible')
      .click();      
    cy.log('✅ Closed dialog');

    // Click menu button with proper timeout
    cy.get('button[aria-label="Menu"]',{timeout: TIMEOUT.SHORT}).first()
      .should('be.visible')
      .click({force: true});

    // Click "View past discussion" with proper waiting
    cy.contains('View past discussion', { timeout: TIMEOUT.LONG })
      .should('exist')
      .and('be.visible')
      .click({ force: true });
    cy.log('✅ Clicked View past discussion');
    
    // Retrieve stored discussion ID and ensure it exists before using cy.contains()
    cy.get('@discussionId').then((discussionId) => {
      cy.log('Debug: Discussion ID format:', typeof discussionId, discussionId);
     
      // Validate discussionId format
      expect(discussionId).to.match(/^[a-zA-Z0-9-_]+$/);

      // Wait for the discussion list to load and verify the discussion ID
      cy.contains(discussionId, { timeout: TIMEOUT.LONG })
        .should('exist')
        .click();
      cy.log('✅ Found and clicked on discussion ID');
    });

    cy.log('✅ TEST PASSED: Architecture Discussion ID found and clicked');
    console.log('Test Passed: Architecture Discussion ID found and clicked');
  });
});