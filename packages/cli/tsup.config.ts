import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/!(*.test).(ts|js)"],
  format: ["esm"],
  target: "node16",
  tsconfig: "./tsconfig.json",
  splitting: false,
  clean: true,
  dts: { resolve: true },
});
