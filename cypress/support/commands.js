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

// cypress/support/commands.js

// cypress/support/commands.js

// En cypress/support/commands.js
// En cypress/support/commands.js

Cypress.Commands.add('loginUIWithCache', (email, password) => {
    
    // Usamos cy.session. Si la sesión ya existe, Cypress saltará el callback
    // y restaurará las cookies y localStorage guardados.
    cy.session([email, password], () => { 
        
        // 1. Navegar a la página de login
        cy.visit('/login'); 
        
        // 2. Simular la interacción con el UI (Esto es lento, pero solo se hará una vez)
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('[data-cy="login-submit-btn"]').click(); 

        // 3. Verificar que el login fue exitoso y estamos en /panel
        cy.url().should('include', '/panel'); 
        
        // 4. (Opcional) Guardar el estado actual del DOM para la sesión
       

    }, {
        // Aseguramos que el login se guarda solo si el test fue exitoso
        cacheAcrossSpecs: true,
    });
});