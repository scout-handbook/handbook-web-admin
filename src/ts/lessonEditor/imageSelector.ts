"use strict";
/* global imageSelectorOpen:true */

var imageSelectorOpen = false;

function prepareImageSelector(page = 1 , perPage = 15): void
{
	request(CONFIG.apiuri + "/image", "GET", undefined, function(response: RequestResponse): void
		{
			renderImageSelector(response as unknown as Array<string>, page, perPage);
		}, reAuthHandler);
	refreshLogin();
}

function renderImageSelector(list: Array<string>, page: number, perPage: number): void
{
	if(!document.getElementById("imageWrapper"))
	{
		return;
	}
	var html = "";
	var start = perPage * (page - 1);
	for(var i = start; i < Math.min(list.length, start + perPage); i++)
	{
		html += "<div class=\"thumbnailContainer\"><div class=\"buttonContainer\"><img src=\"" + CONFIG.apiuri + "/image/" + list[i] + "?quality=thumbnail\" class=\"thumbnailImage\" data-id=\"" + list[i] + "\"></div></div>";
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
	document.getElementById("imageWrapper")!.innerHTML = html;

	var	imageNodes = document.getElementById("imageWrapper")!.getElementsByTagName("img");
	for(var k = 0; k < imageNodes.length; k++)
	{
		imageNodes[k].onclick = insertImage;
	}
	var buttonNodes = document.getElementsByClassName("paginationButton");
	for(var l = 0; l < buttonNodes.length; l++)
	{
		(buttonNodes[l] as HTMLElement).onclick = function(event): void
			{
				prepareImageSelector(parseInt((event.target as HTMLElement).dataset.page!, 10), perPage);
			};
	}
}

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
	var markdown = "![Text po najetí kurzorem](" + CONFIG.apiuri + "/image/" + (event.target as HTMLElement).dataset.id + ")"
	var doc = editor.codemirror.getDoc();
	doc.replaceRange(markdown, doc.getCursor());
	toggleImageSelector();
	refreshLogin();
}
