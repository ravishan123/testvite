/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin(), visualizer() as PluginOption],
  /**
   * Paste the following code snippet from the Amplify UI docs
   * to overcome the "global is not defined" error:
   * https://ui.docs.amplify.aws/react/getting-started/troubleshooting#uncaught-referenceerror-global-is-not-defined-1
   */
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser', // ensures browser compatible version of AWS JS SDK is used
      },
    ],
  },
  server: {
    host: true,
    port: 3000,
  },
  envDir: './environments',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@aws-amplify')) {
              return 'vendor_aws';
            } else if (id.includes('@mui')) {
              return 'vendor_mui';
            } else if (id.includes('react-router-dom') || id.includes('@remix-run') || id.includes('react-router')) {
              return 'vendor_react_router';
            } else if (id.includes('react-google-places-autocomplete')) {
              return 'vendor_google_places_autocomplete';
            } else if (id.includes('zod')) {
              return 'vendor_zod';
            } else if (id.includes('jotai')) {
              return 'vendor_jotai';
            } else if (id.includes('react-redux')) {
              return 'vendor_react-redux';
            }

            return 'vendor'; // all other package goes here
          }
        },
      },
    },
  },
});
