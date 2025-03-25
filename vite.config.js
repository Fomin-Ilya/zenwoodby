import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";

function getPages() {
  const pagesDir = resolve(__dirname, "");
  const files = fs.readdirSync(pagesDir);
  return files
    .filter((file) => file.endsWith(".html"))
    .reduce((acc, file) => {
      const name = file.replace(".html", "");
      // Возвращаем правильный путь для вывода
      acc[name] = resolve(pagesDir, file);
      return acc;
    }, {});
}

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...getPages(),
      },
    },
  },
});
