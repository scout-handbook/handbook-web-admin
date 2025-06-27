import type { Plugin } from "vite";

import { existsSync, readdirSync, renameSync } from "fs";
import { join } from "path";

export function htmlToPhp(outputDir: string): Plugin {
  return {
    closeBundle: (): void => {
      const htmlFiles = (
        existsSync(outputDir)
          ? (readdirSync(outputDir, { recursive: true }) as Array<string>)
          : []
      ).filter((filename) => filename.endsWith(".html"));
      for (const file of htmlFiles) {
        renameSync(
          join(outputDir, file),
          join(outputDir, file.replace(/\.html$/u, ".php")),
        );
      }
    },
    name: "html-to-php",
  };
}
