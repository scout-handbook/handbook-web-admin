"use strict";
/* exported refreshPreviewSetup, refreshPreview */

var converter: Converter|undefined;
var worker: Worker|undefined;
var running = false;
var queue: WorkerPayload|undefined;

function refreshPreviewSetup()
{
	if(Worker)
	{
		worker = new Worker(CONFIG['admin-uri'] + "/admin-worker.min.js");
		worker.onmessage = function(payload)
		{
			document.getElementById(payload.data.id)!.innerHTML = payload.data.body;
			if(queue)
			{
				worker!.postMessage(queue);
				queue = undefined;
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

function refreshPreview(name: string, markdown: string, id: string)
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

