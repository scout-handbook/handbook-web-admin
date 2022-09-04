/* eslint-env worker */

let converter: showdown.Converter;

function convert(payload: MessageEvent): void {
  const data = payload.data as WorkerPayload;
  const html = filterXSS(converter.makeHtml(data.body), xssOptions());
  postMessage({ id: data.id, body: html });
}

function main(): void {
  self.onmessage = convert;
  importScripts("showdown.min.js");
  importScripts("xss.min.js");
  importScripts("admin-worker-deps.min.js");
  converter = new showdown.Converter({ extensions: ["HandbookMarkdown"] });
  converter.setOption("noHeaderId", "true");
  converter.setOption("tables", "true");
  converter.setOption("smoothLivePreview", "true");
}

main();
