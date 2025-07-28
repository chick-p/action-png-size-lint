const core = require("@actions/core");
const execFileSync = require("node:child_process").execFileSync;
const { glob } = require("glob");

async function main() {
  try {
    const { default: zopflipng } = await import("zopflipng-bin");
    const paths = core.getMultilineInput("image-paths");
    const globPaths = paths.filter((path) =>
      path.toLowerCase().endsWith(".png"),
    );
    const limit = core.getInput("limit");

    const globPromises = globPaths.map((globPath) =>
      glob(globPath, {
        nodir: true,
        follow: false,
      }),
    );
    const results = await Promise.all(globPromises);
    const imagePaths = results.flat();
    if (imagePaths.length === 0) {
      console.log("Files are not found.");
      return;
    }

    // find saving rate
    const regexp = /Percentage of original: ([\d.]+)%/m;

    const largeImages = imagePaths.reduce((prev, imagePath) => {
      console.log(`Check ${imagePath}`);
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
      for (const imagePath of largeImages) {
        core.error(`${imagePath} is too large.`);
      }
      core.setFailed("Found files to be able to be reduced size.");
    }
  } catch (error) {
    const zopflipngError = error?.stdout?.toString();
    if (zopflipngError) {
      core.error(zopflipngError);
    }
    core.setFailed(error.message);
  }
}

main();
