import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // This should be the base URL of your app. If your app is hosted at the root, then it should be '/'
  build: {
    outDir: 'dist', // The output directory for build files, 'dist' is the default and usually doesn't need to be set
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Your main entry point
      },
    },
  },
  // This is required for single-page applications that use the history API
  server: {
    historyApiFallback: true,
  }
});
