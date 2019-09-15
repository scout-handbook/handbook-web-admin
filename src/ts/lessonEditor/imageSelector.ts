/* global imageSelectorOpen:true */

let imageSelectorOpen = false;

function toggleImageSelector(): void
{
	if(imageSelectorOpen)
	{
		document.getElementById("imageSelector")!.style.top = "-100%";
	}
	else
	{
		document.getElementById("imageSelector")!.style.top = "-76px";
	}
	imageSelectorOpen = !imageSelectorOpen;
	refreshLogin();
}

function insertImage(event: MouseEvent): void
{
	const markdown = "![Text po najetí kurzorem](" + CONFIG.apiuri + "/image/" + (event.target as HTMLElement).dataset.id + ")"
	const doc = editor.codemirror.getDoc();
	doc.replaceRange(markdown, doc.getCursor());
	toggleImageSelector();
	refreshLogin();
}

function prepareImageSelector(page = 1 , perPage = 15): void
{
	request(CONFIG.apiuri + "/image", "GET", {}, function(response: RequestResponse): void
	{
		renderImageSelector(response as unknown as Array<string>, page, perPage); // eslint-disable-line @typescript-eslint/no-use-before-define
	}, reAuthHandler);
	refreshLogin();
}

function renderImageSelector(list: Array<string>, page: number, perPage: number): void
{
	if(!document.getElementById("imageWrapper"))
	{
		return;
	}
	let html = "";
	const start = perPage * (page - 1);
	for(let i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"></div>";
	}
	if(list.length > perPage)
	{
		const maxPage = Math.ceil(list.length / perPage);
		html += "<div id=\"pagination\">";
		if(page > 3)
		{
			html += "<div class=\"paginationButton\" data-page=\"1\">1</div> ... ";
		}
		if(page > 2)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page - 2) + "\">" + (page - 2) + "</div>";
		}
		if(page > 1)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page - 1) + "\">" + (page - 1) + "</div>";
		}
		html += "<div class=\"paginationButton active\">" + page + "</div>";
		if(page < maxPage)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page + 1) + "\">" + (page + 1) + "</div>";
		}
		if(page < maxPage - 1)
		{
			html += "<div class=\"paginationButton\" data-page=\"" + (page + 2) + "\">" + (page + 2) + "</div>";
		}
		if(page < maxPage - 2)
		{
			html += " ... <div class=\"paginationButton\" data-page=\"" + maxPage + "\">" + maxPage + "</div>";
		}
		html += "</div>";
	}
	document.getElementById("imageWrapper")!.innerHTML = html;

	const imageNodes = document.getElementById("imageWrapper")!.getElementsByTagName("img");
	for(let k = 0; k < imageNodes.length; k++)
	{
		imageNodes[k].onclick = insertImage;
	}
	const buttonNodes = getElementsByClassName("paginationButton");
	for(let l = 0; l < buttonNodes.length; l++)
	{
		(buttonNodes[l] as HTMLElement).onclick = function(event): void
		{
			prepareImageSelector(parseInt((event.target as HTMLElement).dataset.page!, 10), perPage);
		};
	}
}
