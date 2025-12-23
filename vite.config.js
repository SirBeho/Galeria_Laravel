import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Esto carga las variables del .env de la raíz
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            host: '0.0.0.0', // Permite conexiones externas
            port: 5173,
            strictPort: true,
            cors: true,
            hmr: {
                // Si la variable existe, extrae solo el nombre del host (la IP)
                host: env.VITE_DEV_SERVER_URL
                    ? env.VITE_DEV_SERVER_URL.replace('http://', '').split(':')[0]
                    : 'localhost',
            },
        },
        plugins: [
            laravel({
                input: ['resources/js/app.jsx', 'resources/css/app.css'],
                refresh: true,
            }),
            react(),
        ],
    };
});