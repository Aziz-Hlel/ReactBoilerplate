import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

function getPort(): number | undefined {
  const NODE_ENV = process.env.VITE_NODE_ENV;
  if (!NODE_ENV)
    throw new Error(`❌ Missing required environment variable: NODE_ENV`);

  const value = process.env.VITE_WEB_PORT;

  if (!value && ["dev", "test"].includes(NODE_ENV))
    throw new Error(
      `❌ Missing required VITE_WEB_PORT when NODE_ENV is ${NODE_ENV}`,
    );
  if (value && isNaN(Number(value)))
    throw new Error(
      `❌ Invalid value for VITE_WEB_PORT: "${value}" is not a number`,
    );

  return Number(value) || undefined;
}

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Load env file based on `mode` in the current working directory

  return defineConfig({
    envPrefix: "VITE_",

    plugins: [react(), tailwindcss()],
    resolve: {
      // *
      alias: {
        // *
        "@": path.resolve(__dirname, "./src"), // *
      }, // *
    },

    server: {
      port: 9999,
    },
  });
};
