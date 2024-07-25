describe('Test Site', () => {

  beforeEach(() => {
    cy.viewport(1920, 1080); // Set the viewport size
  
    // Restore cookies if available
    cy.restoreCookies();
  
    // Perform login if cookies are not available
    cy.getCookie('session').then((cookie) => {
      if (!cookie) {
        cy.login();
      }
    });
    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');
  });

  it('Test Tickets', () => {

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



    // Reverting to the original
    cy.getDataTest('ticket-665e9d6217c65793de59d4da').click();
    cy.contains(/Test Ticket 2/i).should('be.visible');

    cy.getDataTest('ticket-update').within(() => {
      cy.get('button[type="button"][role="combobox"]').click();
    });
    cy.getDataTest('pending-update').click();
    cy.getDataTest('update-button').click();
    cy.contains(/status update/i).should('be.visible');

    cy.visit('/');
    cy.contains(/Board/i).should('be.visible');
    cy.getDataTest('header-Pending').within(() => {
      cy.getDataTest('ticket-665e9d6217c65793de59d4da').should('be.visible');
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

  it('Test Edit Ticket', () => {

    cy.getDataTest('ticket-665e9d6217c65793de59d4da').click();
    cy.contains(/Test Ticket 2/i).should('be.visible');
    cy.getDataTest('edit-ticket-button').click();
    cy.getDataTest('add-tag-input').type('Test{enter}');
    cy.getDataTest('edit-title-input').type(' || Edited Title');
    cy.getDataTest('edit-description-input').type(" || Edited Description");
    cy.getDataTest('edit-priority').click();
    cy.getDataTest('edit-priority-medium').click();
    cy.getDataTest('save-edit-button').click();

    cy.wait(2000);

    // checks if edited and if it is medium priority
    cy.contains(/Successfully edited ticket/i);
    cy.getDataTest('665e9d6217c65793de59d4da-title').should('contain.text', '|| Edited Title'); 
    cy.getDataTest('665e9d6217c65793de59d4da-description').should('contain.text', '|| Edited Description'); 
    cy.contains(/Medium/i);

    // checks high priority
    cy.getDataTest('edit-ticket-button').click();
    cy.getDataTest('edit-priority').click();
    cy.getDataTest('edit-priority-high').click();
    cy.getDataTest('save-edit-button').click();

    cy.wait(2000);

    cy.contains(/Successfully edited ticket/i);
    cy.contains(/High/i);

    // checks low prio
    cy.getDataTest('edit-ticket-button').click();
    cy.getDataTest('edit-priority').click();
    cy.getDataTest('edit-priority-low').click();
    cy.getDataTest('save-edit-button').click();

    cy.wait(2000);

    cy.contains(/Successfully edited ticket/i);
    cy.contains(/Low/i);

    // checks if it reverted back

    cy.getDataTest('edit-ticket-button').click();
    cy.getDataTest('close-Test-tag').click();
    cy.getDataTest('edit-title-input').clear().type('Test Ticket 2')
    cy.getDataTest('edit-description-input').clear().type("Don't Change");
    cy.getDataTest('edit-priority').click();
    cy.getDataTest('edit-priority-medium').click();
    cy.getDataTest('save-edit-button').click();

    cy.wait(2000);

    
    cy.contains(/Successfully edited ticket/i);
    cy.getDataTest('665e9d6217c65793de59d4da-title').should('not.contain.text', '|| Edited Title'); 
    cy.getDataTest('665e9d6217c65793de59d4da-description').should('not.contain.text', '|| Edited Description'); 
    cy.contains(/Medium/i);




  });

});
