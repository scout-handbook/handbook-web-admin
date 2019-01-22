"use strict";
/* exported refreshPreviewSetup, refreshPreview */

var converter: showdown.Converter|undefined;
var worker: Worker|undefined;
var running = false;
var queue: WorkerPayload|null;

function refreshPreviewSetup(): void
{
	if(Worker)
	{
		worker = new Worker(CONFIG['admin-uri'] + "/admin-worker.min.js");
		worker.onmessage = function(payload): void
		{
			document.getElementById(payload.data.id)!.innerHTML = payload.data.body;
			if(queue)
			{
				worker!.postMessage(queue);
				queue = null;
			}
			else
			{
				running = false;
			}
		}
	}
	else
	{
		converter = new showdown.Converter({extensions: ["HandbookMarkdown"]});
		converter.setOption("noHeaderId", "true");
		converter.setOption("tables", "true");
		converter.setOption("smoothLivePreview", "true");
	}
}

function refreshPreview(name: string, markdown: string, id: string): void
{
	var payload = {"id": id, "body": "# " + name + "\n" + markdown};
	if(Worker)
	{
		if(running)
		{
			queue = payload;
		}
		else
		{
			running = true;
			worker!.postMessage(payload);
		}
	}
	else
	{
		var html = "<h1>" + name + "</h1>";
		html += filterXSS(converter!.makeHtml(payload.body), xssOptions());
		document.getElementById(payload.id)!.innerHTML = html;
	}
}

