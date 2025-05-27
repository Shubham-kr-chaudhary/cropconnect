import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      // tell it to transform .js files, not just .jsx
      include: ["src/**/*.js", "src/**/*.jsx"],
    }),
    tailwindcss(),

  ],

  server: {
    proxy: {
      // Redirect /api/* → http://localhost:5000/api/*
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // secure: false,
      },
          // Socket.IO calls
          '/socket.io': {
            target: 'ws://localhost:5000',
            ws: true,
          },
    },
  },
    // If later need `Buffer` or `process` in the browser (for ethers, etc.),
  // uncomment the below:
  /*
  resolve: {
    alias: {
      buffer: "buffer/",
      process: "process/browser",
    },
  },
  optimizeDeps: {
    // For node‑polyfills
    esbuildOptions: {
      define: { global: "globalThis" },
      plugins: [
        require("@esbuild-plugins/node-globals-polyfill").NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        require("@esbuild-plugins/node-modules-polyfill").NodeModulesPolyfillPlugin()
      ]
    }
  }
  */

})
