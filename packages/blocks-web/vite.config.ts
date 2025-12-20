import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "SoustackBlocksWeb",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["lit", "@soustack/blocks-core"],
      output: {
        assetFileNames: "styles/[name][extname]"
      }
    }
  }
});
