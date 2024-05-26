import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // Set to false to disable the HMR overlay
    },
    watch: {
      usePolling: true
    }
  },
  
  
})
