import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      useTsconfigDeclarationDir: true,
    }),
    clear({
      targets: ["./dist"],
    }),
    terser(),
  ],
  external: [
    "node:path",
    "node:perf_hooks",
    "ajv",
    "enquirer",
    "fs-extra",
    "eslint-plugin-simple-import-sort",
    "code-genius",
  ],
});
