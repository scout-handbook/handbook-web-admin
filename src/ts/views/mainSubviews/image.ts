/* global mainPageTab:true */
/* exported showImageSubview */

function showImagePreview(event: MouseEvent): void
{
	var overlay = document.getElementById("overlay")!;
	overlay.style.display = "inline";
	overlay.style.cursor = "pointer";
	var html = "<img src=\"" + CONFIG.apiuri + "/image/" + (event.target as HTMLElement).dataset.id + "\" class=\"previewImage\">";
	overlay.innerHTML = html;
	overlay.onclick = function(): void
	{
		overlay.style.display = "none";
		overlay.style.cursor = "auto";
		overlay.innerHTML = "";
		overlay.onclick = null;
	};
}

function showImageList(list: Array<string>, page: number, perPage: number): void
{
	if(mainPageTab !== "images")
	{
		return;
	}
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><div class=\"buttonContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"><div class=\"button redButton deleteImage\" data-id=\"" + list[i] + "\"><i class=\"icon-trash-empty\"></i>Smazat</div></div></div>";
	}
	html += renderPagination(Math.ceil(list.length / perPage), page);
	document.getElementById("imageList")!.innerHTML = html;

	var	ImageNodes = document.getElementById("imageList")!.getElementsByTagName("img");
	for(var j = 0; j < ImageNodes.length; j++)
	{
		ImageNodes[j].onclick = showImagePreview;
	}
	var deleteNodes = getElementsByClassName("deleteImage");
	for(var k = 0; k < deleteNodes.length; k++)
	{
		(deleteNodes[k] as HTMLElement).onclick = deleteImageOnClick;
	}
	var paginationNodes = getElementsByClassName("paginationButton");
	for(var l = 0; l < paginationNodes.length; l++)
	{
		(paginationNodes[l] as HTMLElement).onclick = function(event): void
		{
			downloadImageList(parseInt((event.target as HTMLElement).dataset.page!, 10), perPage); // eslint-disable-line @typescript-eslint/no-use-before-define
		};
	}
}

function downloadImageList(page: number, perPage: number): void
{
	document.getElementById("imageList")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/image", "GET", {}, function(response: RequestResponse): void
	{
		showImageList(response as unknown as Array<string>, page, perPage);
	}, reAuthHandler);
	refreshLogin(true);
}

function showImageSubview(noHistory: boolean): void
{
	mainPageTab = "images";
	var nodes = getElementsByClassName("topBarTab");
	for(var i = 0; i < nodes.length; i++)
	{
		nodes[i].className = "topBarTab";
	}
	document.getElementById("imageManager")!.className += " activeTopBarTab";
	var html = "<h1>" + CONFIG["site-name"] + " - Obrázky</h1>";
	html += "<div class=\"button greenButton\" id=\"addImage\"><i class=\"icon-plus\"></i>Nahrát</div>";
	html += "<div id=\"imageList\"></div>";
	document.getElementById("mainPage")!.innerHTML = html;

	document.getElementById("addImage")!.onclick = function(): void {addImage(false);};
	downloadImageList(1, 15);
	if(!noHistory)
	{
		history.pushState({"page": "images"}, "title", "/admin/images"); // eslint-disable-line compat/compat
	}
}
