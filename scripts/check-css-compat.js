import doiuse from "doiuse";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";

const DIST = "dist";

/*
 * Features to accept regardless of where they appear, for reasons that are not
 * about a particular declaration.
 */
const SAFE_FEATURES = {
  /*
   * ::selection has never been supported on iOS Safari, in any version to date,
   * so no floor can clear this. All uses here are CodeMirror's decorative
   * selection highlight, which falls back to the platform default.
   */
  "css-selection": true,
};

/*
 * Declarations that trip a partial-support flag while falling outside what the
 * flag actually covers. Each predicate matches only the safe subset, so a value
 * the flag does cover is still reported.
 */
const SAFE = {
  /*
   * Note 2 is that Safari and older Firefox interpolate without premultiplied
   * colours, which goes wrong for the `transparent` keyword. These gradients
   * name the transparent endpoint as the same RGB with zero alpha (`#fff0`),
   * which is the documented way round it, and the third has no transparent
   * stop at all.
   */
  "css-gradients": ({ value }) => !/\btransparent\b/u.test(value),
  /*
   * Notes 1 and 2 are the two-value `overflow` shorthand and the `clip` value.
   * Only single-value declarations ship; scripts/fix-overflow-shorthand.js
   * splits the shorthands Lightning CSS merges back into longhands.
   */
  "css-overflow": ({ value }) =>
    !/\bclip\b/u.test(value) && value.trim().split(/\s+/u).length === 1,
  /*
   * Note 1 is the `each-line` and `hanging` keywords; <length> values work.
   */
  "css-text-indent": ({ value }) => !/each-line|hanging/u.test(value),
  /*
   * Note 5 limits note 1's height restriction to `-moz-fit-content` and
   * `-moz-available`, so unprefixed intrinsic values work on height in every
   * in-range Firefox; the `-moz-` copy autoprefixer emits alongside is inert
   * rather than harmful. Safari's note 3 is `flex-basis`, which is not used.
   * `stretch` and `-moz-available` are deliberately absent, so they report.
   */
  "intrinsic-width": ({ prop, value }) =>
    [
      "height",
      "max-height",
      "max-width",
      "min-height",
      "min-width",
      "width",
    ].includes(prop) &&
    [
      "-moz-fit-content",
      "-webkit-fit-content",
      "-webkit-max-content",
      "-webkit-min-content",
      "fit-content",
      "max-content",
      "min-content",
    ].includes(value),
};

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

// Fail closed: an empty file list makes doiuse report nothing, which reads as a pass.
const files = await cssFiles(DIST).catch(() => []);
if (files.length === 0) {
  console.error(`No CSS found under ${DIST}/ - run \`npm run build\` first.`);
  process.exit(1);
}

const problems = (
  await Promise.all(
    files.map(async (file) => {
      const found = [];
      const css = await readFile(file, "utf8");
      await postcss([
        doiuse({
          onFeatureUsage: ({ feature, featureData, usage }) => {
            if (Object.hasOwn(SAFE_FEATURES, feature)) {
              return;
            }
            if (
              Object.hasOwn(SAFE, feature) &&
              usage.type === "decl" &&
              SAFE[feature](usage)
            ) {
              return;
            }
            let what = usage.selector ?? "?";
            if (usage.type === "decl") {
              what = `${usage.prop}: ${usage.value}`;
            } else if (usage.type === "atrule") {
              what = `@${usage.name} ${usage.params}`;
            }
            const { column, line } = usage.source.start;
            found.push(
              `${file}:${line}:${column}  ${what}  (${feature}: ${featureData.missing || featureData.partial})`,
            );
          },
        }),
      ]).process(css, { from: file });
      return found;
    }),
  )
).flat();

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(problem);
  }
  process.exit(1);
}
console.log(`No unsupported features in ${files.length} built CSS file(s).`);
