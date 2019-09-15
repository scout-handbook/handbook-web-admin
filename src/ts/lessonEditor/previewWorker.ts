/* eslint-env worker */

let converter: showdown.Converter;

function convert(payload: MessageEvent): void
{
	const html = filterXSS(converter.makeHtml(payload.data.body), xssOptions());
	postMessage({"id": payload.data.id, "body": html});
}

function main(): void
{
	(self as DedicatedWorkerGlobalScope).onmessage = convert;
	importScripts('showdown.min.js');
	importScripts('xss.min.js');
	importScripts('admin-worker-deps.min.js');
	converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	converter.setOption("smoothLivePreview", "true");
}

main();
