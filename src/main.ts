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

const defaultValues = {
  filterRegexp: /\.(png|svg|jpg|jpeg|gif)/,
  outDir: "./dist",
};

export default (options: PluginOptions = defaultValues): EsbuildPlugin => {
  options = { ...defaultValues, ...options };
  const namespace = generateRandNameSpace();

  return {
    name: "plugin-vixen-assets",
    setup(build) {
      build.onResolve({ filter: options.filterRegexp }, async (args: any) => {
        let cleanPath = path.resolve(args.resolveDir, args.path);

        try {
          await fs.access(cleanPath);
        } catch (_) {
          cleanPath = path.resolve(
            args.resolveDir,
            args.path.replace(options.filterRegexp, "")
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
        const outPath = path.resolve(process.cwd(), options.outDir);

        try {
          await fs.access(outPath);
        } catch (_) {
          await fs.mkdir(outPath, { recursive: true });
        }

        await fs.writeFile(path.join(outPath, fileName), fileContent);
        const contents = path.join(options.outDir, fileName);
        return {
          contents,
          watchFiles: [args.path],
          loader: "text",
        };
      });
    },
  };
};
