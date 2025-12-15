// cypress/e2e/cart-persistence.cy.js

describe('Persistencia de Datos Críticos', () => {

    /** @test */
    it('Debe mantener los artículos del carrito después de recargar la página', () => {

        cy.visit('/');

        // 1. 🛒 Añadir un artículo al carrito
        // Usaremos el primer ítem, asumimos que se añade y el modal se cierra.
        cy.get('[data-cy="gallery-item"]').first().click();
        cy.get('[data-cy="increment-cantidad-btn"]').click().click(); // Incrementar cantidad a 3
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click();

        cy.get('[data-cy="gallery-item"]').eq(1).click();
        cy.get('[data-cy="input-comentario"]').type('Tres Azules');
        cy.get('[data-cy="add-to-cart-btn"]').click();
        cy.get('[data-cy="modal-added-close-btn"]').click();


        cy.get('[data-cy="cart-count-badge"]').should('have.text', '2');

        // 2. 🔄 Recargar la página
        cy.reload();

        // 3. ✅ Verificar el estado después de recargar
        // El contador del carrito debe seguir mostrando el ítem.
        cy.get('[data-cy="cart-count-badge"]').should('be.visible').and('have.text', '2');

        // 4. Abrir el modal de Checkout para verificar el contenido interno
        cy.get('[data-cy="cart-button"]').click();

        cy.get('[data-cy="cart-item-list"]')
            .children('[data-cy="cart-item-row"]') // Obtenemos la colección de filas
            .as('itemRows');

        // Aserción: Debe haber exactamente 2 filas
        cy.get('@itemRows').should('have.length', 2);

        // 🟢 Verificar el PRIMER ÍTEM (Cantidad 3)
        // Usamos .first() sobre la colección de filas de ítems (itemRows)
        cy.get('@itemRows').first()
            .should('be.visible')
            .find('[data-cy="cart-item-quantity"]')
            .should('contain', '3');

        // 🟢 Verificar el SEGUNDO ÍTEM (Comentario 'Tres Azules')
        // Usamos el alias '@itemRows'
        cy.get('@itemRows').eq(1)
            .should('be.visible')
            .find('[data-cy="cart-item-comment"]')
            .should('contain', 'Tres Azules');
        // Cerrar el modal para limpiar el estado
        cy.get('[data-cy="modal-close-btn"]').click();
    });

    /** @test */
    it('Debe mantener el estado visual de la galería después de recargar la página', () => {

        // 1. Visitar la página
        cy.visit('/');

        const TOGGLE_BTN = '[data-cy="toggle-view-btn"]';

        // 1. PRE-CONDICIÓN: Verificar el estado inicial (estadoVisual === 0)
        // La imagen 'tres.svg' (alt="grande") debe ser visible.
        cy.get(TOGGLE_BTN).find('img[alt="grande"]').should('be.visible');
        cy.get(TOGGLE_BTN).find('img[alt="mediano"]').should('not.exist');
        cy.get(TOGGLE_BTN).find('img[alt="pequeno"]').should('not.exist');

        // 2. 🖱️ CLIC: Cambiar el Estado Visual (de 0 a 1)
        cy.get(TOGGLE_BTN).click();

        // 3. ✅ Verificar el cambio de estado (estadoVisual === 1)
        // 'mediano' (dos.svg) debe ser visible.
        cy.get(TOGGLE_BTN).find('img[alt="mediano"]').should('be.visible');
        cy.get(TOGGLE_BTN).find('img[alt="grande"]').should('not.exist');
        cy.get(TOGGLE_BTN).find('img[alt="pequeno"]').should('not.exist');

        // 4. 🔄 Recargar la página
        cy.reload();

        // 5. 🛑 VERIFICACIÓN FINAL: El estado visual debe persistir (estadoVisual === 1)
        // La imagen 'mediano' (dos.svg) DEBE seguir siendo visible después de la recarga.
        cy.get(TOGGLE_BTN).find('img[alt="mediano"]').should('be.visible');
        cy.get(TOGGLE_BTN).find('img[alt="grande"]').should('not.exist');
        cy.get(TOGGLE_BTN).find('img[alt="pequeno"]').should('not.exist');

        cy.get(TOGGLE_BTN).click();

        // Cambiar a estadoVisual === 2
        cy.get(TOGGLE_BTN).find('img[alt="pequeno"]').should('be.visible');
        cy.get(TOGGLE_BTN).find('img[alt="grande"]').should('not.exist');
        cy.get(TOGGLE_BTN).find('img[alt="mediano"]').should('not.exist');


    });


});