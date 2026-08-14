import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { devApiPlugin } from "./vite.dev-api";

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars via import.meta.env. The dev-only
  // API middleware below runs api/*.ts handlers in-process and needs the
  // server-only R2_* secrets on process.env, same as they'd be on Vercel.
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), devApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          },
        },
      },
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
  };
});
