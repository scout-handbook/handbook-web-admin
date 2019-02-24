/* exported addField */

function openFieldImageSelector(name: string, description: string, image: string, page = 1 , perPage = 15): void
{
	sidePanelDoubleOpen();
	document.getElementById("sidePanel")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/image", "GET", {}, function(response: RequestResponse): void
	{
		renderFieldImageSelector(response as unknown as Array<string>, name, description, image, page, perPage); // eslint-disable-line @typescript-eslint/no-use-before-define
	}, reAuthHandler);
	refreshLogin();
}

function renderFieldImageSelector(list: Array<string>, name: string, description: string, image: string, page: number, perPage: number): void
{
	var html = "";
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
	document.getElementById("sidePanel")!.innerHTML = html;

	var	imageNodes = document.getElementById("sidePanel")!.getElementsByTagName("img");
	for(var k = 0; k < imageNodes.length; k++)
	{
		imageNodes[k].onclick = function(event: MouseEvent)
		{
			addField(name, description, (event.target as HTMLElement).dataset.id); // eslint-disable-line @typescript-eslint/no-use-before-define
		};
	}
	var buttonNodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < buttonNodes.length; l++)
	{
		(buttonNodes[l] as HTMLElement).onclick = function(event): void
		{
			openFieldImageSelector(name, description, image, parseInt((event.target as HTMLElement).dataset.page!, 10), perPage);
		};
	}
}

function addFiledPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("fieldName") as HTMLInputElement).value), "description": encodeURIComponent((document.getElementById("fieldDescription") as HTMLInputElement).value), "image": encodeURIComponent((document.getElementById("fieldImage") as HTMLInputElement).value)};
}

function addField(name = "Nová oblast", description = "Popis nové oblasti", image = "00000000-0000-0000-0000-000000000000"): void
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat oblast</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"" + name + "\" autocomplete=\"off\">";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"fieldDescription\" autocomplete=\"off\">" + description + "</textarea>";
	html += "<legend for=\"fieldImage\">Náhledový obrázek:</legend>";
	html += "<input type=\"hidden\" id=\"fieldImage\" value=\"" + image + "\">";
	html += "<image src=\"" + CONFIG.apiuri + "/image/" + image + "?quality=thumbnail\">";
	html += "<br><div class=\"button\" id=\"fieldImageChange\"><i class=\"icon-pencil\"></i>Změnit</div>"
	html += "</form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	document.getElementById("fieldImageChange")!.onclick = function(): void
	{
		openFieldImageSelector((document.getElementById("fieldName") as HTMLInputElement).value, (document.getElementById("fieldDescription") as HTMLInputElement).value, image);
	};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field", "POST", addFiledPayloadBuilder)]);
	document.getElementById("addFieldSave")!.onclick = aq.closeDispatch;

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	refreshLogin();
}
