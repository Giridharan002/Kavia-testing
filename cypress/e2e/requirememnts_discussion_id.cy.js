/*
Test Description:
The test automates the discussion verification process in the Requirements section,
navigating to "Test App" and capturing a dynamic discussion ID.

After initiating a new requirement discussion, it verifies the discussion ID 
by finding and clicking it in the past discussions section.
*/

describe('Requirements Discussion Verification Test', () => {
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

  it('should verify discussion in requirements page', function () {
    // Use the login command instead of hardcoded credentials
    cy.login();
    cy.log('✅ Login successful');

    // Navigate to Application with proper timeout
    cy.contains('Application', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Application');

    // Click on "Test App" with proper timeout
    cy.contains('Test App', { timeout: TIMEOUT.LONG })
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

    // Click on "Requirements" from the dropdown
    cy.contains('Requirements', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Requirements');

    // Wait for navigation to the requirements page
    // cy.url({ timeout: TIMEOUT.MEDIUM })
    //   .should('not.include', '/overview')
    //   .and('include', '/requirements');
    // cy.log('✅ Verified we are on the requirements page');

    // Click Update Requirements button
    cy.get('button[aria-label="Update an existing requirement"]', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible')
      .click();
    cy.log('✅ Clicked on Update Requirements');

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
    cy.get('svg[viewBox="0 0 352 512"]', { timeout: TIMEOUT.SHORT })
      .should('be.visible')
      .click();
    cy.log('✅ Closed dialog');

    // Scroll the ellipsis menu into view and ensure it is visible
    cy.log('Scrolling ellipsis menu into view...');
    cy.get('svg.lucide-ellipsis', { timeout: TIMEOUT.MEDIUM })
      .should('be.visible');
    cy.log('✅ Found menu icon');

    // Requery the ellipsis menu to handle potential DOM updates
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
      
      // Validate discussionId format before using it
      expect(discussionId).to.match(/^[a-zA-Z0-9-_]+$/);

      // Wait for the discussion list to load and verify the discussion ID
      cy.contains(discussionId, { timeout: TIMEOUT.LONG })
        .should('exist')
        .click();
      cy.log('✅ Found and clicked on discussion ID');
    });

    cy.log('✅ TEST PASSED: Requirements Discussion ID found and clicked');
  });
});