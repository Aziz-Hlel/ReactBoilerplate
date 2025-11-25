## Init Vite React Ts

- npm create vite@latest .

## Install Tailwind

- npm install tailwindcss @tailwindcss/vite

```js
//  vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite"; // *
export default defineConfig({
  plugins: [
    tailwindcss(), // *
  ],
});
```

```js
//  index.css
@import "tailwindcss";

```

## ShadCn

```json
//  tsconfig.json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    // *
    "baseUrl": ".", // *
    "paths": {
      // *
      "@/*": ["./src/*"] // *
    } // *
  } // *
}
```

```json
//  tsconfig.app.json

{
  "compilerOptions": {
    // ...
    "baseUrl": ".", // *
    "paths": {
      // *
      "@/*": [
        // *
        "./src/*" // *
      ] // *
    } // *
    // ...
  }
}
```

- npm install -D @types/node

```js
//  vite.config.ts

import path from "path"; // *
import tailwindcss from "@tailwindcss/vite"; // *
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // *
  resolve: {
    // *
    alias: {
      // *
      "@": path.resolve(__dirname, "./src"), // *
    }, // *
  }, // *
});
```

- npx shadcn@latest init

- npx shadcn@latest add button

- npm i lucide-react // optional
