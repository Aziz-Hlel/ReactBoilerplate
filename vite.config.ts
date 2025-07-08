import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"  
import tailwindcss from '@tailwindcss/vite'


export default ({ mode }: { mode: string }) => {

  const env = loadEnv(mode, process.cwd(), '') // Load env file based on `mode` in the current working directory

  return defineConfig({
    envPrefix: 'VITE_',

    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {                                                // *                
      alias: {                                                // *                
        "@": path.resolve(__dirname, "./src"),                // *                                                
      },                                                      // *        
    },

    server: {
      port: parseInt(env.VITE_PORT || '9999'), 
    }
  })
}
