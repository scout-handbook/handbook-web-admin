import type { Plugin } from "vite";

import { existsSync } from "fs";
import { readdir, rename } from "fs/promises";
import { join } from "path";

export function htmlToPhp(outputDir: string): Plugin {
  return {
    // SvelteKit writes prerendered HTML in a post buildApp hook, after closeBundle has already run.
    buildApp: {
      handler: async (): Promise<void> => {
        const htmlFiles = (
          existsSync(outputDir)
            ? await readdir(outputDir, { recursive: true })
            : []
        ).filter((filename) => filename.endsWith(".html"));
        await Promise.all(
          htmlFiles.map(async (file) =>
            rename(
              join(outputDir, file),
              join(outputDir, file.replace(/\.html$/u, ".php")),
            ),
          ),
        );
      },
      order: "post",
    },
    name: "html-to-php",
  };
}
