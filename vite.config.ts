import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// function getPort(): number | undefined {
//   const NODE_ENV = process.env.VITE_NODE_ENV;
//   if (!NODE_ENV)
//     throw new Error(`❌ Missing required environment variable: NODE_ENV`);

//   const value = process.env.VITE_WEB_PORT;

//   if (!value && ["dev", "test"].includes(NODE_ENV))
//     throw new Error(
//       `❌ Missing required VITE_WEB_PORT when NODE_ENV is ${NODE_ENV}`,
//     );
//   if (value && isNaN(Number(value)))
//     throw new Error(
//       `❌ Invalid value for VITE_WEB_PORT: "${value}" is not a number`,
//     );

//   return Number(value) || undefined;
// }

export default () => {
  return defineConfig({
    envPrefix: "VITE_",

    plugins: [
      react(),
      tailwindcss(),
      visualizer({
        open: true, // automatically opens the report in browser
        filename: "dist/stats.html", // explicit output location
        gzipSize: true, // show gzip size (useful for actual deploy size)
        brotliSize: true, // show brotli size (useful for CDN/server compression)
      }),
    ],
    resolve: {
      // *
      alias: {
        // *
        "@": path.resolve(__dirname, "./src"), // *
      }, // *
    },

    server: {
      port: !isNaN(Number(process.env.VITE_PORT)) ? Number(process.env.VITE_PORT) : 9998,
    },
  });
};
