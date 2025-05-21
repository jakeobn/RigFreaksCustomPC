import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'path';
import { readdirSync } from 'fs';

/**
 * Client-specific Vite configuration optimized for Vercel deployment
 */
export default defineConfig({
  plugins: [react()],
  
  // Resolve aliases for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, '../assets'),
      '@shared': path.resolve(__dirname, './src'), // Redirect shared imports to local version
      '@lib': path.resolve(__dirname, './src/lib'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  
  // Dev server configuration
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      port: 3000
    }
  },
  
  // Build options
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ]
        }
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@tanstack/react-query',
      'react-hook-form',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'zod'
    ]
  }
});
