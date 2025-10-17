import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  outDir: "dist",
  clean: true,
  target: "es2022",
  treeshake: true,
  skipNodeModulesBundle: true,
  external: [
    "react",
    "react-dom",
    /^@radix-ui\//, 
    /^@tanstack\//,
    "clsx",
    "class-variance-authority",
    "lucide-react",
  ],
});
