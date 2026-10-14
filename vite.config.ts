import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        target: "es2022",
        lib: {
            entry: {
                index: "src/index.ts",
                button: "src/components/button/index.ts",
                input: "src/components/input/index.ts",
                icon: "src/components/icon/index.ts",
                "color-mode-button": "src/components/color-mode-button/index.ts",
            },
            formats: ["es"],
            fileName: (_format, name) => `${name}.js`,
        },
        rollupOptions: {
            external: [/^lit(\/.*)?$/, /^lucide(\/.*)?$/],
        },
    },
});
