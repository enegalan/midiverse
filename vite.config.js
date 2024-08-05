import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    alias: {
        images: "/images"
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'nginx/nginx.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'nginx/nginx.crt')),
        },
        strictPort: true,
    },
});
