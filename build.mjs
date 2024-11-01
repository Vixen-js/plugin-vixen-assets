import * as esbuild from "esbuild";
import vixenAssets from "./dist/main.js";

await esbuild.build({
  entryPoints: ["./test/index.ts"],
  outdir: "./distCustom",
  outExtension: {
    ".js": ".cjs",
  },
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  minify: true,
  tsconfig: "tsconfig.json",
  packages: "external",
  plugins: [vixenAssets({ outDir: "./distCustom" })],
});
