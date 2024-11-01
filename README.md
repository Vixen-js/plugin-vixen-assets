# Esbuild Plugin Vixen Assets plugin

This plugin is used to copy vixen assets into the output directory.

## Usage

```ts
import vixenAssets from "@vixen-js/plugin-vixen-assets";
import * as esbuild from "esbuild";

esbuild.build({
    ...
    plugins: [vixenAssets({outDir: "./customDist"})],
    ...
})
```

## Options

- `outDir` - `string` - The output directory. Defaults to `./dist`.

## License

[AGPL 3](LICENSE)