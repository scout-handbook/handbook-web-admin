/* exported refreshPreviewSetup, refreshPreview */

let converter: showdown.Converter|undefined;
let worker: Worker|undefined;
let running = false;
let queue: WorkerPayload|null;

function refreshPreviewSetup(): void
{
	if(Worker)
	{
		worker = new Worker(CONFIG['admin-uri'] + "/admin-worker.min.js"); // eslint-disable-line compat/compat
		worker.onmessage = function(payload): void
		{
			const data = payload.data as WorkerPayload;
			document.getElementById(data.id)!.innerHTML = data.body;
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
	const payload = {"id": id, "body": "# " + name + "\n" + markdown};
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
		let html = "<h1>" + name + "</h1>";
		html += filterXSS(converter!.makeHtml(payload.body), xssOptions()); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
		document.getElementById(payload.id)!.innerHTML = html;
	}
}

