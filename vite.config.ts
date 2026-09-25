import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    // Fast Refresh is enabled by default in @vitejs/plugin-react; the explicit
    // `fastRefresh` option was removed from its types, so we no longer pass it.
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      // Force single React copy to avoid runtime bundle initialization issues
      react: path.resolve(import.meta.dirname, "node_modules", "react"),
      "react-dom": path.resolve(import.meta.dirname, "node_modules", "react-dom"),
    },
    // Ensure only one copy of React is bundled
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  css: {
    postcss: {
      plugins: [],
    },
    // Minify CSS in production
    devSourcemap: !isProduction,
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Production optimizations
    minify: isProduction ? "terser" : false,
    sourcemap: !isProduction,
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    // Terser options for maximum compression
    terserOptions: isProduction ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    } : undefined,
    rollupOptions: {
      output: {
        // Better chunking strategy
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Heavy libraries get their own chunks
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('framer-motion') || id.includes('@motionone')) return 'vendor-motion';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('cobe')) return 'vendor-globe';
            // Group Radix UI components
            if (id.includes('@radix-ui')) return 'vendor-radix';
            // Group Lucide icons
            if (id.includes('lucide-react')) return 'vendor-icons';
            // Default vendor chunk
            return 'vendor';
          }
        },
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Inline small assets
    assetsInlineLimit: 4096,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Preview server for production testing
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  // Enable esbuild optimizations
  esbuild: {
    // Remove console in production
    drop: isProduction ? ["console", "debugger"] : [],
    // Use modern syntax
    target: "es2020",
  },
});
