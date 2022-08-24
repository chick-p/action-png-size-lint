const core = require("@actions/core");
const util = require("util");
const execFileSync = require("node:child_process").execFileSync;
const glob = util.promisify(require("glob"));

async function main() {
  try {
    const { default: zopflipng } = await import("zopflipng-bin");
    const globPaths = core.getMultilineInput("image-paths");
    const limit = core.getInput("limit");

    const imagePaths = await globPaths.reduce(async (prev, globPath) => {
      const paths = await glob(globPath, {
        nodir: true,
        follow: false,
        dot: true,
      });
      return [...prev, ...paths];
    }, []);

    // find saving rate
    const regexp = /Percentage of original: ([\d.]+)%/m;

    const largeImages = imagePaths.reduce((prev, imagePath) => {
      const stdoutBuffer = execFileSync(zopflipng, [
        "-d",
        imagePath,
        "output.png",
      ]);
      const stdout = stdoutBuffer.toString();
      const matcher = stdout.match(regexp);
      if (matcher) {
        const savingRate = Number(matcher[1]);
        if (savingRate < Number(limit)) {
          prev = [...prev, imagePath];
        }
      }
      return prev;
    }, []);

    if (largeImages.length > 0) {
      throw new Error(
        `Found files to be able to be reduced size\n${largeImages.join("\n")}`
      );
    }
  } catch (error) {
    const zopflipngError = error?.stdout?.toString();
    if (zopflipngError) {
      console.error(zopflipngError);
    }
    core.setFailed(error.message);
  }
}

main();
