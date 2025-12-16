// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

before(() => {
    // 🛑 CLAVE: Limpiar, Migrar y Seedear.
    // Usamos el entorno 'testing' o un entorno personalizado que use 'config/testing/cypress.php'.
    cy.exec('php artisan migrate:fresh --seed --env=testing', {
        failOnNonZeroExit: false,
        timeout: 60000 // Aumentar el timeout si la siembra es lenta
    });
});