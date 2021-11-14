import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
//TODO: Look back into this and figure out why it isn't working...
// import { ViteAliases } from 'vite-aliases'
// import path from 'path';

export default defineConfig({
  plugins: [
    createVuePlugin(),
    // ViteAliases()
  ],
  server: {
    port: 8080
  },
  // resolve: {
  //   //TODO: This doesn't seem to be working....
  //   alias: [
  //     {
  //       find: '@',
  //       replacement: path.resolve(__dirname, 'src')
  //     }
  //   ]
  // },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@cloud-platform/vue2-components-plugin/src/styles/_variables.scss";`
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  },
  define: {
    'process.env': process.env
  }
});