/* global changed:true */
/* exported changed, lessonHistoryOpen */

function lessonHistoryPreviewShowCurrent(): void
{
	document.getElementById("lessonHistoryPreview")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	refreshPreview((document.getElementById("name") as HTMLInputElement).value, editor.value(), "lessonHistoryPreview");

	document.getElementById("lessonHistoryListHeader")!.innerHTML = "";

	refreshLogin();
}

function lessonHistoryPreviewRenderVersion(id: string, name: string, body: string, actionQueue: ActionQueue): void
{
	refreshPreview(name, body, "lessonHistoryPreview");
	var html = "<div class=\"button greenButton\" id=\"lessonHistoryRevert\"><i class=\"icon-history\"></i>Obnovit</div>";
	document.getElementById("lessonHistoryListHeader")!.innerHTML = html;

	document.getElementById("lessonHistoryRevert")!.onclick = function(): void
	{
		(document.getElementById("name") as HTMLInputElement).value = name;
		editor.value(body);
		changed = true;
		lessonSettings(id, actionQueue, true);
	};
}

function lessonHistoryPreviewShowVersion(id: string, actionQueue: ActionQueue, event: Event): void
{
	document.getElementById("lessonHistoryPreview")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/lesson/" + id + "/history/" + (event.target as HTMLElement).dataset.version, "GET", {}, function(response: RequestResponse): void
	{
		lessonHistoryPreviewRenderVersion(id, (event.target as HTMLElement).dataset.name!, response as unknown as string, actionQueue);
	}, authFailHandler);

	document.getElementById("lessonHistoryListHeader")!.innerHTML = "";

	refreshLogin();
}

function lessonHistoryListRender(id: string, actionQueue: ActionQueue, list: Array<LessonVersion>): void
{
	var html = "<form id=\"sidePanelForm\">";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" checked><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryCurrent\">Současná verze</span> — " + parseVersion(FIELDS[i].lessons[j].version) + "</div>";
				break outer;
			}
		}
	}
	for(var k = 0; k < list.length; k++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"version\" data-name=\"" + list[k].name + "\" data-version=\"" + list[k].version + "\"><span class=\"formCustom formRadio\"></span></label><span class=\"lessonHistoryVersion\">" + list[k].name + "</span> — " + parseVersion(list[k].version) + "</div>";
	}
	html += "</form>";
	document.getElementById("lessonHistoryForm")!.innerHTML = html;

	var nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	nodes[0].onchange = function(): void {lessonHistoryPreviewShowCurrent();};
	if(nodes.length > 1)
	{
		for(var l = 1; l < nodes.length; l++)
		{
			nodes[l].onchange = function(event): void {lessonHistoryPreviewShowVersion(id, actionQueue, event);};
		}
	}
}

function lessonHistoryOpen(id: string, actionQueue: ActionQueue): void
{
	sidePanelDoubleOpen();
	var html = "<div id=\"lessonHistoryList\"><div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div><span id=\"lessonHistoryListHeader\"></span><h3 class=\"sidePanelTitle\">Historie lekce</h3><div id=\"lessonHistoryForm\"><div id=\"embeddedSpinner\"></div></div></div><div id=\"lessonHistoryPreview\"></div>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("cancelEditorAction")!.onclick = function(): void
	{
		lessonSettings(id, actionQueue, true);
	};

	request(CONFIG.apiuri + "/lesson/" + id + "/history", "GET", {}, function(response: RequestResponse): void
	{
		lessonHistoryListRender(id, actionQueue, response as unknown as Array<LessonVersion>);
	}, authFailHandler);
	lessonHistoryPreviewShowCurrent();
}
