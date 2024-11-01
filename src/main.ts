import path from "path";
import fs from "fs/promises";

type PluginOptions = {
  filterRegexp: RegExp;
  outDir: string;
};

type EsbuildPlugin = {
  name: string;
  setup: (build: any) => void;
};

function generateRandNameSpace() {
  return (
    Math.round(Math.random() * 1000 + 1).toString(36) +
    Math.round(Math.random() * 1000 + 1).toString(36)
  );
}

export default (options: PluginOptions): EsbuildPlugin => {
  const namespace = generateRandNameSpace();
  const { filterRegexp = /\.(png|svg|jpg|jpeg|gif)$/, outDir = "./dist" } =
    options;

  let originalDir = "";

  return {
    name: "plugin-vixen-assets",
    setup(build) {
      build.onResolve({ filter: filterRegexp }, async (args: any) => {
        originalDir = args.resolveDir;
        let cleanPath = path.resolve(args.resolveDir, args.path);

        try {
          await fs.access(cleanPath);
        } catch (_) {
          cleanPath = path.resolve(
            args.resolveDir,
            args.path.replace(filterRegexp, "")
          );
        }

        return {
          path: cleanPath,
          namespace,
        };
      });

      build.onLoad({ filter: /.*/, namespace }, async (args: any) => {
        let fileContent = await fs.readFile(args.path);
        const fileName = path.basename(args.path);
        const outPath = path.resolve(originalDir, outDir);

        try {
          await fs.access(outPath);
        } catch (_) {
          await fs.mkdir(outPath, { recursive: true });
        }

        await fs.writeFile(path.join(outPath, fileName), fileContent);
        const contents = "./" + fileName;
        return {
          contents,
          watchFiles: [args.path],
          loader: "text",
        };
      });
    },
  };
};
