function openSidePanelImageSelector(action: string, state: SidePanelImageSelectorState, page = 1 , perPage = 15, noHistory = false): void
{
	sidePanelDoubleOpen();
	document.getElementById("sidePanel")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/image", "GET", {}, function(response: RequestResponse): void
	{
		renderSidePanelImageSelector(response as unknown as Array<string>, action, state, page, perPage, noHistory); // eslint-disable-line @typescript-eslint/no-use-before-define
	}, reAuthHandler);
	refreshLogin();
}

function closeSidePanelImageSelector(action: string, state: SidePanelImageSelectorState): void
{
	switch(action)
	{
		case "addField":
			addField(state, true);
			break;
		case "changeField":
			changeField(state, true);
			break;
	}
}

function renderSidePanelImageSelector(list: Array<string>, action: string, state: SidePanelImageSelectorState, page: number, perPage: number, noHistory: boolean): void
{
	let html = "<div class=\"button yellowButton\" id=\"fieldImageCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"fieldImageContainer\">";
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
	html += "</div>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("fieldImageCancel")!.onclick = function(): void
	{
		history.back();
	}
	const imageNodes = document.getElementById("sidePanel")!.getElementsByTagName("img");
	for(let k = 0; k < imageNodes.length; k++)
	{
		imageNodes[k].onclick = function(event: MouseEvent): void
		{
			state.image = (event.target as HTMLElement).dataset.id!;
			history.back();
			closeSidePanelImageSelector(action, state);
		};
	}
	const buttonNodes = getElementsByClassName("paginationButton");
	for(let l = 0; l < buttonNodes.length; l++)
	{
		(buttonNodes[l] as HTMLElement).onclick = function(event): void
		{
			openSidePanelImageSelector(action, state, parseInt((event.target as HTMLElement).dataset.page!, 10), perPage, true);
		};
	}

	if(!noHistory)
	{
		history.replaceState({"sidePanelImageSelectorAction": action, "sidePanelImageSelectorState": state}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	}
	refreshLogin();
}
