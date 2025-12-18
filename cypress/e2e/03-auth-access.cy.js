// cypress/e2e/auth-panel-access.cy.js

describe('Flujo de Autenticación y Acceso al Panel', () => {

    const USER_EMAIL = Cypress.env('adminUser').email;
    const USER_PASSWORD = Cypress.env('adminUser').password;

    // ----------------------------------------------------------------------
    // 1. PREPARACIÓN ÚNICA (Antes de toda la suite)
    // ----------------------------------------------------------------------
    before(() => {
        // 🛑 PRE-CACHEO DE SESIÓN: Ejecuta el login UI una sola vez y guarda el estado.
        // Las pruebas subsiguientes reutilizarán este estado guardado, volviéndose rápidas.
        cy.loginUIWithCache(USER_EMAIL, USER_PASSWORD);
    });

    // ----------------------------------------------------------------------
    // 2. AISLAMIENTO (Antes de cada test)
    // ----------------------------------------------------------------------
    beforeEach(() => {
        // Limpiamos el estado global (cookies, localStorage) antes de cada test.
        // Si el test necesita estar logueado, cy.session lo restaurará en el primer cy.visit.
        cy.clearLocalStorage();
        cy.clearCookies();
    });


    // ----------------------------------------------------------------------
    // TEST 1: AUTENTICACIÓN MANUAL (Prueba la Interfaz Lenta)
    // Este test prueba que el formulario de la UI funciona.
    // ----------------------------------------------------------------------
    /** @test */
    it('Debe permitir autenticarse manualmente y verificar el éxito de la interfaz', () => {

        // Empezamos limpio en /login
        cy.visit('/login');

        // Simulación de interacción de interfaz
        cy.get('input[name="email"]').type(USER_EMAIL);
        cy.get('input[name="password"]').type(USER_PASSWORD);
        cy.get('[data-cy="login-submit-btn"]').click();

        // Verificación
        cy.url().should('include', '/panel');
    });


    // ----------------------------------------------------------------------
    // TEST 2: ACCESO RESTRINGIDO (Prueba de Seguridad)
    // Este test verifica que sin sesión, se bloquea el acceso.
    // ----------------------------------------------------------------------
    /** @test */
    it('Debe bloquear el acceso directo al panel si no está autenticado', () => {


        // Empezamos limpio (gracias al beforeEach).
        cy.visit('/panel');

        // Verificamos que fuimos redirigidos a /login
        cy.url().should('include', '/login');

        // Verificamos que el formulario de login está visible
        cy.get('[data-cy="login-submit-btn"]').should('be.visible');
    });

    it('Debe bloquear el acceso directo a la página de subir si no está autenticado', () => {

        // Empezamos limpio (gracias al beforeEach).
        cy.visit('//subir');

        // Verificamos que fuimos redirigidos a /login
        cy.url().should('include', '/login');

        // Verificamos que el formulario de login está visible
        cy.get('[data-cy="login-submit-btn"]').should('be.visible');
    });



});