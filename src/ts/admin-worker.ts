/* eslint-env worker */

import "./common/HandbookMarkdown";

import { Converter } from "showdown";
import { filterXSS } from "xss";

import { WorkerPayload } from "./common/WorkerPayload";
import { xssOptions } from "./common/xssOptions";

let converter: Converter;

function convert(payload: MessageEvent): void {
  const data = payload.data as WorkerPayload;
  const html = filterXSS(converter.makeHtml(data.body), xssOptions());
  postMessage({ id: data.id, body: html });
}

function main(): void {
  self.onmessage = convert;
  converter = new Converter({ extensions: ["HandbookMarkdown"] });
  converter.setOption("noHeaderId", "true");
  converter.setOption("tables", "true");
  converter.setOption("smoothLivePreview", "true");
}

main();
