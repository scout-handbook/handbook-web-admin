import "../../common/HandbookMarkdown";

import { Converter } from "showdown";
import { filterXSS } from "xss";

import type { WorkerPayload } from "../../common/WorkerPayload";
import { xssOptions } from "../../common/xssOptions";

let converter: showdown.Converter | null = null;
let worker: Worker | null = null;
let workerRunning = false;
let nextPayload: WorkerPayload | null = null;
const promiseResolvers: Record<string, (value: string) => void> = {};

export function compileMarkdownSetup(): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Worker isn't present in older browsers
  if (Worker) {
    worker = new Worker(new URL("../../admin-worker.ts", import.meta.url));
    worker.onmessage = (payload): void => {
      const data = payload.data as WorkerPayload;
      promiseResolvers[data.id](data.body);
      if (nextPayload) {
        worker!.postMessage(nextPayload);
        nextPayload = null;
      } else {
        workerRunning = false;
      }
    };
  } else {
    converter = new Converter({ extensions: ["HandbookMarkdown"] });
    converter.setOption("noHeaderId", "true");
    converter.setOption("tables", "true");
    converter.setOption("smoothLivePreview", "true");
  }
}

export async function compileMarkdown(markdown: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Worker isn't present in older browsers
  if (Worker) {
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
      nextPayload = { id, body: markdown };
    } else {
      workerRunning = true;
      worker!.postMessage({ id, body: markdown });
    }
    return promise;
  } else {
    return filterXSS(converter!.makeHtml(markdown), xssOptions());
  }
}
