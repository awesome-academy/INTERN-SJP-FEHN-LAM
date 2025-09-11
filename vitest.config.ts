import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
export default defineConfig({
    plugins: [react()],

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/lib/test/setup.ts',
        env: {
            NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

});
