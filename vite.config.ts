import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

function getPort(mode: string): number | undefined {
  const env = loadEnv(mode, process.cwd());

  const NODE_ENV = env.VITE_NODE_ENV;
  if (!NODE_ENV) throw new Error(`❌ Missing required environment variable: NODE_ENV`);

  const value = env.VITE_PORT;

  if (!value && ['dev', 'test'].includes(NODE_ENV))
    throw new Error(`❌ Missing required VITE_PORT when NODE_ENV is ${NODE_ENV}`);
  if (value && isNaN(Number(value))) throw new Error(`❌ Invalid value for VITE_PORT: "${value}" is not a number`);

  return Number(value) || undefined;
}

export default ({ mode }: { mode: string }) => {
  return defineConfig({
    envPrefix: 'VITE_',

    plugins: [
      react(),
      tailwindcss(),
      visualizer({
        open: true, // automatically opens the report in browser
        filename: 'dist/stats.html', // explicit output location
        gzipSize: true, // show gzip size (useful for actual deploy size)
        brotliSize: true, // show brotli size (useful for CDN/server compression)
      }),
    ],
    resolve: {
      // *
      alias: {
        // *
        '@': path.resolve(__dirname, './src'), // *
      }, // *
    },

    server: {
      port: getPort(mode),
    },
  });
};
