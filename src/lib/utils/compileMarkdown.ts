import type { WorkerPayload } from "$lib/common/WorkerPayload";

import { xssOptions } from "$lib/common/xssOptions";
import showdown from "showdown";
import "$lib/common/HandbookMarkdown";
import { filterXSS } from "xss";

let converter: showdown.Converter | null = null;
let worker: Worker | null = null;
let workerRunning = false;
let nextPayload: WorkerPayload | null = null;
const promiseResolvers: Record<string, (value: string) => void> = {};

export async function compileMarkdown(markdown: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Worker isn't present in older browsers
  if (Worker && worker !== null) {
    let id = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const promise = new Promise<string>((resolve) => {
      promiseResolvers[id] = resolve;
    });
    if (workerRunning) {
      nextPayload = { body: markdown, id };
    } else {
      workerRunning = true;
      worker.postMessage({ body: markdown, id });
    }
    return promise;
  }
  if (converter === null) {
    return "";
  }
  return filterXSS(converter.makeHtml(markdown), xssOptions());
}

export function compileMarkdownSetup(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Worker isn't present in older browsers
  if (Worker) {
    worker = new Worker(
      new URL("$lib/markdown-compilation-worker.ts", import.meta.url),
    );
    worker.onmessage = (payload): void => {
      if (worker === null) {
        return;
      }
      const data = payload.data as WorkerPayload;
      promiseResolvers[data.id](data.body);
      if (nextPayload) {
        worker.postMessage(nextPayload);
        nextPayload = null;
      } else {
        workerRunning = false;
      }
    };
  } else {
    converter = new showdown.Converter({ extensions: ["HandbookMarkdown"] });
    converter.setOption("noHeaderId", "true");
    converter.setOption("tables", "true");
    converter.setOption("smoothLivePreview", "true");
  }
}
