import * as esbuild from "esbuild";
import vixenAssets from "../dist/main.js";

await esbuild.build({
  entryPoints: ["./index.ts"],
  outdir: "./dist",
  outExtension: {
    ".js": ".cjs",
  },
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  minify: true,
  tsconfig: "../tsconfig.json",
  packages: "external",
  plugins: [vixenAssets()],
});
