// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDataTest', (dataTestSelector) =>{
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

Cypress.Commands.add('login', () => {
  cy.visit('login'); // Visit the login page
  cy.url().should('include', 'login'); // Ensure you’re on the login page
  cy.contains(/Welcome to BusinessOS/i).should('be.visible'); // Verify the welcome message

  cy.intercept('POST', '/login').as('loginRequest'); // Intercept the login request

  // Type the login credentials and submit the form
  cy.get('[data-test="login"]').type('test@gmail.com');
  cy.get('[data-test="password"]').type('adminadmin');
  cy.get('[data-test="login-button"]').click();

  // Wait for the login request to complete
  cy.wait('@loginRequest');

  // Verify that the user has been redirected to the board
  cy.contains(/Board/i).should('be.visible');

  // Save cookies to a file
  cy.getCookies().then((cookies) => {
    cy.writeFile('cypress/fixtures/cookies.json', cookies);
  });
});


Cypress.Commands.add('restoreCookies', () => {
  cy.readFile('cypress/fixtures/cookies.json', { failOnStatusCode: false })
    .then((cookies) => {
      if (cookies && cookies.length) {
        cy.log('Restoring cookies:', cookies);
        cookies.forEach((cookie) => {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite
          });
        });
      } else {
        cy.log('No cookies to restore or file is empty.');
      }
    });
});
  
Cypress.Commands.add('isCookieExpired', (cookie) => {
  // Get the current time in seconds with fractional seconds
  const currentTime = Date.now() / 1000;
  
  // Compare with the cookie's expiry time
  return currentTime < cookie.expiry;
});
