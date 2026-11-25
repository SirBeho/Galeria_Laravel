// cypress/e2e/admin-dashboard.cy.js
// Suite dedicada a verificar el contenido y la funcionalidad del Dashboard (Panel)

const { select } = require("@material-tailwind/react");

describe('Verificación de Contenido y Datos del Panel de Administración', () => {

    const USER_EMAIL = Cypress.expose('adminUser').email;
    const USER_PASSWORD = Cypress.expose('adminUser').password;

    // ----------------------------------------------------------------------
    // 1. ANTES DE CADA TEST: Autenticación Rápida
    // ----------------------------------------------------------------------
    beforeEach(() => {

        // Asumimos que el PedidoSeeder ya se ejecutó en la suite de auth-access.
        cy.loginUIWithCache(USER_EMAIL, USER_PASSWORD);

        // Navega al panel con la sesión ya activa
        cy.visit('/panel');
    });


    // ----------------------------------------------------------------------
    // TEST 1: RENDERIZADO DE TABLA (Verificación de Contenido y Datos)
    // ----------------------------------------------------------------------
    /** @test */
    it('Debe renderizar la tabla con los datos correctos de los pedidos', () => {
        cy.loginUIWithCache(USER_EMAIL, USER_PASSWORD);
        // 🛑 Restauramos la sesión cacheada y navegamos al /panel
        // (Esto es rápido ya que la sesión está guardada por cy.session)
        cy.visit('/panel');

        cy.url().should('include', '/panel');

        // 1. ✅ Verificación de Título (Actúa como espera para la carga de Inertia)
        cy.get('[data-cy="page-title"]').should('be.visible').and('contain', 'Pedido');

        const TABLE_SELECTOR = '[data-cy="pedidos-data-table"]';

        // 2. 🛑 Verificación de la Tabla de Datos
        cy.get(TABLE_SELECTOR).should('be.visible');

        cy.get(TABLE_SELECTOR)
            .find('[data-cy="pedido-row"]')
            .should('have.length.at.least', 2);


        // 3. 📋 Verificar que los datos de un pedido específico están visibles
        cy.get(TABLE_SELECTOR).contains('10000').should('be.visible');

        // Obtenemos la fila que contiene el pedido 1001
        const PEDIDO_ROW_1001 = cy.get(TABLE_SELECTOR).contains('10000').parents('[data-cy="pedido-row"]');

        PEDIDO_ROW_1001.should('contain', 'Juan Perez');
        PEDIDO_ROW_1001.should('contain', '(809) 597-2637');
        PEDIDO_ROW_1001.should('contain', '2');
        PEDIDO_ROW_1001.should('contain', 'Pendiente');

        //click al boton del pedido ver pedido-row
        PEDIDO_ROW_1001.find('[data-cy="ver-pedido-button"]').click();

        // Verificar que la URL contiene el número de pedido
        cy.url().should('include', 'p=10000');

        // Verificar que el detalle del pedido se muestra correctamente
        cy.get('[data-cy="detalle-data-table"]').should('be.visible');

        // Verificar que la tabla de detalle contiene los datos correctos
        cy.get('[data-cy="detalle-row"]').should('have.length.at.least', 2);

        cy.get('[data-cy="detalle-row"]').first().find('[data-cy="detalle-Quantity"]').should('contain', '10');
        cy.get('[data-cy="detalle-row"]').eq(1).find('[data-cy="detalle-Quantity"]').should('contain', '5');
    }
    );

    /** @test */
    it('Debe permitir cambiar el estado de un pedido', () => {
        cy.loginUIWithCache(USER_EMAIL, USER_PASSWORD);
        // 🛑 Restauramos la sesión cacheada y navegamos al /panel
        // (Esto es rápido ya que la sesión está guardada por cy.session)
        cy.visit('/panel');

        cy.url().should('include', '/panel');

        // 1. ✅ Verificación de Título (Actúa como espera para la carga de Inertia)
        cy.get('[data-cy="page-title"]').should('be.visible').and('contain', 'Pedido');



        cy.get('[data-cy="pedidos-data-table"]').should('be.visible')
            .find('[data-cy="pedido-row"]').first().find('[data-cy="ver-pedido-button"]').click();


        cy.url().should('include', 'p=10001');

        // Confirmar el cambio de estado en el modal
        const NEW_STATUS = '2';

        cy.get('[data-cy="status-select"]').should('have.value', '1');

        cy.get('[data-cy="detalle-data-table"]')
            .invoke('attr', 'data-pedido-id')
            .as('dbID');

        cy.intercept('POST', '/estado**').as('updateStatus');

        cy.get('[data-cy="status-select"]').select(NEW_STATUS); // Cambiar a "Completado"

        cy.wait('@updateStatus').then((interception) => {
            cy.get('@dbID').then((dbId) => {

                // 🛑 ASERCIONES CON EL VALOR REAL (dbId)
                expect(interception.request.query.id).to.equal(dbId, 'Verificación de ID de Pedido en Query');
                expect(interception.request.query.status).to.equal(NEW_STATUS, 'Verificación del nuevo Status en Query');
            });

            // Verificaciones del Servidor (no requieren el ID)
            expect(interception.response.statusCode).to.be.oneOf([200, 302], 'Verificación de Status Code Exitoso');
        });

        cy.get('[data-cy="status-select"]').should('have.value', NEW_STATUS);

        cy.reload();

        // Verificar que el estado se mantuvo después de la recarga
        cy.get('[data-cy="status-select"]').should('have.value', NEW_STATUS);

    });

});