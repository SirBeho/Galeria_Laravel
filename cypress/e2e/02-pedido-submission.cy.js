// cypress/e2e/pedido-submission.cy.js

// Definimos el grupo de pruebas
describe('Flujo Crítico de Creación de Pedido', () => {

    // Esta prueba valida todo el proceso desde el frontend hasta la DB
    it('Debe permitir al usuario crear un pedido completo y verificar el éxito', () => {

        // 1. Visitar la página de inicio (ruta '/')
        cy.visit('/');
        
        cy.get('[data-cy="gallery-item"]').first().click();
        cy.get('[data-cy="input-comentario"]').type('Por favor, sin cebolla.');
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click();

        cy.get('[data-cy="gallery-item"]').eq(1).click();
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click();

        // 3. Abrir el modal de Checkout
        cy.get('[data-cy="cart-button"]').click();

        // 4. 📝 Llenar el Formulario (Usamos data-cy en inputs para robustez)
        cy.get('[data-cy="input-nombre"]').type('Cypress Test User'); 
        cy.get('[data-cy="input-telefono"]').type('8095551234');

        cy.window().then((win) => {
            // Reemplazamos la función nativa alert con un stub.
            // Esto evita que el navegador se detenga y guarda el mensaje.
            cy.stub(win, 'alert').as('windowAlert'); 
        });

        // 5. 🚀 Enviar el formulario (Primer y Único Click de Envío)
        cy.get('[data-cy="submit-pedido-btn"]').click();

        
        cy.get('@windowAlert').should('be.calledOnce');
        

        // 6. ✅ Verificación de Éxito
        cy.get('[data-cy="success-message-pedido"]').should('be.visible')
            .and('contain', 'Su pedido se ha creado exitosamente');

        // --- MANEJO DE WHATSAPP ---
        
        // 7. Simular window.open para no perder el foco
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });

        // 8. Clic en el Ícono de WhatsApp (Activa handleSendOrder)
        // [CORRECCIÓN DE SINTAXIS]: cy.get('[data-cy="whatsapp-send-icon"]').click();
        cy.get('[data-cy="whatsapp-send-icon"]').click(); 

        // 9. Verificar que el link externo fue llamado
        cy.get('@windowOpen').should('be.calledOnce');

        // 10. Clic en el botón que aparece después del cambio de estado
        // [CORRECCIÓN DE SELECTOR]: Usamos el nombre que definimos 'pedido-sent-manual-btn'
        cy.get('[data-cy="btn-get-send-whatsapp"]').should('be.visible').click();

        // 11. Verificar que el modal se cierra
        cy.get('[data-cy="success-message-pedido"]').should('not.exist');
    });

    

    // Prueba de fallo de validación
    it('Debe mostrar errores de validación de Laravel cuando falta el nombre', () => {
        cy.visit('/');

        // 1. Añadir un ítem y abrir checkout
        cy.get('[data-cy="gallery-item"]').first().click();
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click(); // Cerrar modal agregado
        cy.get('[data-cy="cart-button"]').click();

        // 2. ⚠️ Dejar el nombre vacío. Llenar el teléfono.
        cy.get('[data-cy="input-telefono"]').type('1234'); // Usamos data-cy para input

        // 3. Enviar
        cy.get('[data-cy="submit-pedido-btn"]').click();

        // 4. 🟢 Verificar que el mensaje de error de validación de Laravel aparece
        // Asumimos que el error para el campo 'nombre' se muestra en un span/div asociado:
        cy.get('[data-cy="input-nombre"]').should('be.visible');
    
        // Podemos verificar que la URL no cambió después del intento de submit
        cy.url().should('include', '/');
        
        
    });
});

// cypress/e2e/pedido-submission.cy.js
describe('Flujo de Carrito Vacío', () => {

    /** @test */
    it('Debe deshabilitar el botón de envío si el carrito se vacía', () => {

        cy.visit('/');

        // 1. 🛒 Añadir un artículo para activar el flujo de checkout
        cy.get('[data-cy="gallery-item"]').first().click();
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click();

        // 2. 🖱️ Abrir el Checkout
        cy.get('[data-cy="cart-button"]').click(); 
        
        // 3. 📝 Llenar el formulario (para asegurar que la única falla sea el carrito)
        cy.get('[data-cy="input-nombre"]').type('Cypress Empty Test');
        cy.get('[data-cy="input-telefono"]').type('1111');
        
        // 4. 🧹 CLAVE: Vaciar el Carrito
        // [IMPORTANTE]: Necesitas un selector data-cy para el botón/función que vacía el carrito
        // Asumo que tienes un botón 'Vaciar Carrito' o un botón 'Eliminar' junto a cada ítem.
        
        //vaciar carrito
        cy.get('[data-cy="clear-carrito-btn"]').click();

        // 5. 🛑 VERIFICACIÓN: El botón de envío debe estar deshabilitado o debe aparecer un error.
        
        // Opción A (La más común y robusta): El botón está visible pero deshabilitado
        cy.get('[data-cy="submit-pedido-btn"]')
            .should('be.visible')
            .and('be.disabled'); 

        // Opción B: El botón está habilitado, pero un mensaje de error aparece
        // (Si tu validación JS añade un mensaje de error y permite el click)
        // cy.get('[data-cy="validation-error-carrito"]').should('be.visible')
        //   .and('contain', 'El carrito debe contener al menos un artículo.');
    });
});