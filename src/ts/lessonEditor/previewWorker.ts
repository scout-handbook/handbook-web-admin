"use strict";
/* eslint-env worker */

var converter: Converter;

function main()
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

function process(payload: MessageEvent)
{
	var html = filterXSS(converter.makeHtml(payload.data.body), xssOptions());
	postMessage({"id": payload.data.id, "body": html});
}

main();
