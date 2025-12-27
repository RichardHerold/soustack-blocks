import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "SoustackEmbed",
      fileName: (format) => {
        if (format === "es") return "embed.es.js";
        if (format === "umd") return "embed.umd.js";
        return `embed.${format}.js`;
      },
      formats: ["es", "umd"]
    },
    rollupOptions: {
      // Don't externalize anything - bundle everything for self-contained UMD
      output: {
        globals: {}
      }
    }
  }
});

