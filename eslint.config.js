// 🚨 Nuevo formato para ESLint v9+ (eslint.config.js)

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginHooks from "eslint-plugin-react-hooks";
import pluginA11y from "eslint-plugin-jsx-a11y";
import eslintPluginCypress from 'eslint-plugin-cypress/flat';

export default [
    // 1. Configuración Base y Globals (Browser, Node)
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                // Define aquí variables globales de Inertia si son necesarias (ej. route)
                // route: "readonly", 
                route: "readonly",

            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2021,
                sourceType: "module",
            },
        },
        // Reglas de JS recomendadas
        ...pluginJs.configs.recommended,
    },

    // 2. Configuración de Plugins (React, Hooks, A11Y)
    {
        ...eslintPluginCypress.configs.recommended,
        files: ["**/*.{js,jsx}", "!cypress/**"],
        plugins: {
            react: pluginReact,
            "react-hooks": pluginHooks,
            "jsx-a11y": pluginA11y,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        // Reglas recomendadas de los plugins
        rules: {
            ...pluginReact.configs.recommended.rules,
            ...pluginA11y.configs.recommended.rules,

            // 🟢 Reglas estrictas de React Hooks (CRÍTICAS)
            "react-hooks/rules-of-hooks": "error", // Revisa las reglas de uso de Hooks
            "react-hooks/exhaustive-deps": "warn",  // Revisa dependencias faltantes

            // 🟢 Personalizaciones de reglas
            'react/prop-types': 'off', // Deshabilitar prop-types
            'react/react-in-jsx-scope': 'off', // Deshabilitar para React v17+
            'no-unused-vars': 'warn',
            'no-debugger': 'error',
            'no-console': 'off',
        },
    },
    {
        // Solo aplica esta configuración a los archivos dentro de la carpeta cypress
        files: ['cypress/e2e/**/*.js', 'cypress/support/**/*.js'],

        // Aplica la configuración recomendada de Cypress (que incluye el entorno 'cypress/globals')
        ...eslintPluginCypress.configs.recommended,

        // Opcional: Sobreescribe las reglas específicas para tus tests E2E
        rules: {
            // Aquí puedes permitir cosas en Cypress que están prohibidas en React
            // Por ejemplo, forzar que solo se usen comandos cy. en los tests:
            'cypress/no-unnecessary-waiting': 'warn',
            'no-console': 'off', // Permitir console.log en los tests
            'no-unused-expressions': 'off' // Desactivar para las aserciones de Mocha/Chai
        }
    },
];