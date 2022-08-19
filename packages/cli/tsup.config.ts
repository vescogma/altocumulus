import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["esm"],
  target: "node16",
  splitting: false,
  clean: true,
  dts: {
    resolve: true,
  },
});
