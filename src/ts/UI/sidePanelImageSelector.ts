function openSidePanelImageSelector(action: string, state: any, page = 1 , perPage = 15, noHistory = false): void
{
	sidePanelDoubleOpen();
	document.getElementById("sidePanel")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/image", "GET", {}, function(response: RequestResponse): void
	{
		renderSidePanelImageSelector(response as unknown as Array<string>, action, state, page, perPage, noHistory); // eslint-disable-line @typescript-eslint/no-use-before-define
	}, reAuthHandler);
	refreshLogin();
}

function renderSidePanelImageSelector(list: Array<string>, action: string, state: any, page: number, perPage: number, noHistory: boolean): void
{
	var html = "<div class=\"button yellowButton\" id=\"fieldImageCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><div class=\"fieldImageContainer\">";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"></div>";
	}
	if(list.length > perPage)
	{
		var maxPage = Math.ceil(list.length / perPage);
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

	document.getElementById("fieldImageCancel")!.onclick = function()
	{
		history.back();
	}
	var	imageNodes = document.getElementById("sidePanel")!.getElementsByTagName("img");
	for(var k = 0; k < imageNodes.length; k++)
	{
		imageNodes[k].onclick = function(event: MouseEvent)
		{
			state.image = (event.target as HTMLElement).dataset.id
			closeSidePanelImageSelector(action, state);
		};
	}
	var buttonNodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < buttonNodes.length; l++)
	{
		(buttonNodes[l] as HTMLElement).onclick = function(event): void
		{
			openSidePanelImageSelector(action, state, parseInt((event.target as HTMLElement).dataset.page!, 10), perPage, true);
		};
	}

	if(!noHistory)
	{
		history.replaceState({"sidePanelImageSelectorAction": action, "sidePanelImageSelectorState": state}, "title", "/admin/lessons");
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	}
	refreshLogin();
}

function closeSidePanelImageSelector(action: string, state: any)
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
