import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: { enabled: false },
            includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
            manifest: {
                name: "IQRA'NOW",
                short_name: "IQRA'NOW",
                description: 'Learn Quranic recitation with real-time feedback and accessibility.',
                theme_color: '#0ea5e9',
                background_color: '#0b1220',
                display: 'standalone',
                icons: [
                    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
                ]
            }
        })
    ],
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': 'http://localhost:5000',
        }
    }
});
