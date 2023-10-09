import { defineConfig } from "code-genius";
import { gitInitSimpleHooksInstaller } from "@codegenius/hooks-plugin";

export default defineConfig({
  plugins: [
    gitInitSimpleHooksInstaller(),
  ],
});
