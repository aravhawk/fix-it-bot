import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false, // dist is cleaned in the build script before CSS compilation
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
})
