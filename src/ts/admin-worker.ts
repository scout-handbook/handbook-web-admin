import { Converter } from "showdown";
import { filterXSS } from "xss";

import type { WorkerPayload } from "./common/WorkerPayload";

import "./common/HandbookMarkdown";
import { xssOptions } from "./common/xssOptions";

let converter: Converter | null = null;

function convert(payload: MessageEvent): void {
  if (converter === null) {
    return;
  }
  const data = payload.data as WorkerPayload;
  const html = filterXSS(converter.makeHtml(data.body), xssOptions());
  postMessage({ body: html, id: data.id });
}

function main(): void {
  converter = new Converter({ extensions: ["HandbookMarkdown"] });
  converter.setOption("noHeaderId", "true");
  converter.setOption("tables", "true");
  converter.setOption("smoothLivePreview", "true");
  self.onmessage = convert;
}

main();
