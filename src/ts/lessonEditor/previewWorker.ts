/* eslint-env worker */

var converter: showdown.Converter;

function process(payload: MessageEvent): void
{
	var html = filterXSS(converter.makeHtml(payload.data.body), xssOptions());
	postMessage({"id": payload.data.id, "body": html});
}

function main(): void
{
	(self as DedicatedWorkerGlobalScope).onmessage = process;
	importScripts('showdown.min.js');
	importScripts('xss.min.js');
	importScripts('admin-worker-deps.min.js');
	converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
	converter.setOption("noHeaderId", "true");
	converter.setOption("tables", "true");
	converter.setOption("smoothLivePreview", "true");
}

main();
