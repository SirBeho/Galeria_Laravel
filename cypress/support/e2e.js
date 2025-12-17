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


after(() => {
    cy.log('*** CLEANUP: Eliminando archivos vía cy.exec ***');

    const TEST_IMAGES = ['test_1.png', 'test_2.png', 'test_3.png'];
    const GALLERY_PATH = 'storage/app/public/gallery';
    // 1. Construimos la cadena con las rutas completas
    const filesPathString = TEST_IMAGES.map(img => `${GALLERY_PATH}/${img}`).join(' ');

    // 2. Ejecutamos el comando 'rm'
    // -f fuerza la eliminación y no da error si el archivo no existe
    cy.exec(`rm -f ${filesPathString}`, {
        failOnNonZeroExit: false // Importante: Si ya se borraron, que no falle el test
    }).then((result) => {
        cy.log('Resultado limpieza:', result.stdout);
    });
});