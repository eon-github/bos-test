describe('Test Site', () => {

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('login');
    cy.url().should('include', 'login');
    cy.contains(/Welcome to BusinessOS/i).should('be.visible');
    cy.intercept('POST', '/login').as('loginRequest');

    cy.get('[data-test="login"]').type('test@gmail.com');
    cy.get('[data-test="password"]').type('adminadmin');
    cy.get('[data-test="login-button"]').click();


    cy.wait('@loginRequest');


    cy.contains(/Board/i).should('be.visible');
  });

  it('Test Tickets', () => {
    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');

    // Interact with the ticket
    cy.getDataTest('ticket-665e9d6217c65793de59d4da').click();
    cy.contains(/Test Ticket 2/i).should('be.visible');

    // Update to self ticket
    cy.getDataTest('ticket-update').within(() => {
      cy.get('button[type="button"][role="combobox"]').click();
    });
    cy.getDataTest('pending-update').click();
    cy.getDataTest('update-button').click();
    cy.contains(/Nothing to update/i).should('be.visible');

    // Check if ticket moved to pending/stayed
    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');
    cy.getDataTest('header-Pending').within(() => {
      cy.getDataTest('ticket-665e9d6217c65793de59d4da').should('be.visible');
    });

    // Update to open ticket
    cy.getDataTest('ticket-665e9d6217c65793de59d4da').click();
    cy.contains(/Test Ticket 2/i).should('be.visible');
    cy.getDataTest('ticket-update').within(() => {
      cy.get('button[type="button"][role="combobox"]').click();
    });
    cy.getDataTest('open-update').click();
    cy.getDataTest('update-button').click();
    cy.contains(/status updated/i).should('be.visible');

    // Check if ticket moved to open
    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');
    cy.getDataTest('scrollarea-Open').scrollIntoView().within(() => {
      cy.getDataTest('ticket-665e9d6217c65793de59d4da').scrollIntoView().should('be.visible');
    });

    // Update to closed ticket
    cy.getDataTest('ticket-665e9d6217c65793de59d4da').click();
    cy.contains(/Test Ticket 2/i).should('be.visible');
    cy.getDataTest('ticket-update').within(() => {
      cy.get('button[type="button"][role="combobox"]').click();
    });
    cy.getDataTest('closed-update').click();
    cy.getDataTest('update-button').click();
    cy.contains(/status updated/i).should('be.visible');

    // Check if ticket moved to closed
    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');
    cy.getDataTest('scrollarea-Closed').scrollIntoView().within(() => {
      cy.getDataTest('ticket-665e9d6217c65793de59d4da').scrollIntoView().should('be.visible');
    });

    // end of test ticket
  });

  it('Test Ticket Filters', () => {

  cy.intercept('GET', '/?filters=*').as('getFilters');

  // Check high priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-High').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  cy.contains('body', 'High').should('be.visible');
  cy.contains('body', 'Medium').should('not.exist');  
  cy.contains('body', 'Low').should('not.exist');     

  // Check high and medium priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-Medium').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  
  cy.contains('body', 'High').should('be.visible');
  cy.contains('body', 'Medium').should('be.visible');
  cy.contains('body', 'Low').should('not.exist');     

  // Check high, medium, and low priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-Low').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  
  cy.contains('body', 'High').should('be.visible');
  cy.contains('body', 'Medium').should('be.visible');
  cy.contains('body', 'Low').should('be.visible');

  // Check medium and low priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-High').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  
  cy.contains('body', 'High').should('not.exist');  
  cy.contains('body', 'Medium').should('be.visible');
  cy.contains('body', 'Low').should('be.visible');

  // Check medium priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-Low').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  
  cy.contains('body', 'High').should('not.exist');  
  cy.contains('body', 'Medium').should('be.visible');
  cy.contains('body', 'Low').should('not.exist');

  // Check low priority tickets
  cy.getDataTest('priority-button').click();
  cy.getDataTest('filter-Medium').click();
  cy.getDataTest('filter-Low').click();
  cy.getDataTest('priority-button').click();
  
  // Wait for the intercept to complete
  cy.wait('@getFilters');
  cy.wait(5000);
  
  cy.contains('body', 'High').should('not.exist');  
  cy.contains('body', 'Medium').should('not.exist');
  cy.contains('body', 'Low').should('be.visible');


  //end of test ticket filter
  })


});
