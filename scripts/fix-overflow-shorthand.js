/**
 * Splits two-value `overflow` shorthands in the built CSS back into longhands.
 *
 * Lightning CSS is Vite's CSS minifier, and it merges `overflow-x`/`overflow-y`
 * into the two-value shorthand regardless of its targets -- it does so even for
 * `safari 14` alone, and even with minification disabled. The shorthand needs
 * Chrome 90 and Safari 15.4, above this repo's floor, so the merge introduces an
 * incompatibility that is not present in any source file. SvelteKit derives
 * `build.cssMinify` from `build.minify`, so CSS minification cannot be turned
 * off on its own, which leaves post-processing as the only in-repo fix.
 *
 * Remove this once Lightning CSS respects its targets here; see the tracking
 * issue referenced in the README of this directory.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";
import overflowShorthand from "postcss-overflow-shorthand";

const DIST = "dist";

/**
 * @param {string} dir
 * @returns {Promise<Array<string>>} every .css file below dir, recursively
 */
const cssFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return cssFiles(path);
      }
      return entry.name.endsWith(".css") ? [path] : [];
    }),
  );
  return nested.flat();
};

const files = await cssFiles(DIST).catch(() => []);
if (files.length === 0) {
  console.error(`No CSS found under ${DIST}/ - run \`npm run build\` first.`);
  process.exit(1);
}

let changed = 0;
await Promise.all(
  files.map(async (file) => {
    const css = await readFile(file, "utf8");
    const { css: fixed } = await postcss([
      overflowShorthand({ preserve: false }),
    ]).process(css, { from: file });
    if (fixed !== css) {
      await writeFile(file, fixed);
      changed += 1;
    }
  }),
);
console.log(`Split two-value overflow shorthands in ${changed} file(s).`);
