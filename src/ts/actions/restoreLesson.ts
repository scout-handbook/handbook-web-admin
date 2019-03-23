/* exported restoreLesson */

function restoreLessonRenderVersion(name: string, body: string): void
{
	refreshPreview(name, body, "restoreLessonPreview");
	var html = "<div class=\"button greenButton\" id=\"restoreLessonEdit\"><i class=\"icon-history\"></i>Obnovit</div>";
	document.getElementById("restoreLessonListHeader")!.innerHTML = html;
	document.getElementById("restoreLessonEdit")!.onclick = function(): void
	{
		sidePanelOpen();
		history.back();
		showLessonRestoreView(name, body);
	};
}

function restoreLessonShowVersion(id: string, event: Event): void
{
	var version = (event.target as HTMLElement).dataset.version;
	var name = (event.target as HTMLElement).dataset.name!;
	document.getElementById("restoreLessonPreview")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG.apiuri + "/deleted-lesson/" + id + "/history/" + version, "GET", {}, function(response: RequestResponse): void
	{
		restoreLessonRenderVersion(name, response as unknown as string);
	}, authFailHandler);
	document.getElementById("restoreLessonListHeader")!.innerHTML = "";

	refreshLogin();
}

function restoreLessonRenderVersionList(id: string, list: Array<LessonVersion>): void
{
	sidePanelDoubleOpen();
	var html = "<div id=\"restoreLessonVersionList\"><div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><span id=\"restoreLessonListHeader\"></span><h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<form id=\"sidePanelForm\">";
	for(var i = 0; i < list.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"restoreLessonversion\" data-name=\"" + list[i].name + "\" data-version=\"" + list[i].version + "\"><span class=\"formCustom formRadio\"></span></label><span class=\"restoreLessonVersion\">" + list[i].name + "</span> — " + parseVersion(list[i].version) + "</div>";
	}
	html += "</form>"
	html += "</div><div id=\"restoreLessonPreview\"></div>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		sidePanelOpen();
		history.back();
	};
	var nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	for(var j = 0; j < nodes.length; j++)
	{
		nodes[j].onchange = function(event): void {restoreLessonShowVersion(id, event);};
	}
}

function restoreLessonSelectVersion(): void
{
	var lessonId = parseBoolForm()[0];
	if(lessonId)
	{
		var html = "<div id=\"embeddedSpinner\"></div>";
		document.getElementById("restoreLessonList")!.innerHTML = html;
		request(CONFIG.apiuri + "/deleted-lesson/" + lessonId + "/history", "GET", {}, function(response: RequestResponse): void
		{
			restoreLessonRenderVersionList(lessonId, response as unknown as Array<LessonVersion>);
		}, reAuthHandler);
		document.getElementById("restoreLessonNext")!.onclick = function(): void {};
	}
}

function restoreLessonRenderLessonList(list: Array<DeletedLesson>): void
{
	if(list.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Nejsou žádné smazané lekce.", "OK");
		refreshMetadata();
		history.back();
	}
	var html = "<form id=\"sidePanelForm\">";
	for(var i = 0; i < list.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"lesson\" data-id=\"" + list[i].id + "\"><span class=\"formCustom formRadio\"></span></label>" + list[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("restoreLessonList")!.innerHTML = html;
	document.getElementById("restoreLessonNext")!.onclick = restoreLessonSelectVersion;
}

function restoreLesson(): void
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"restoreLessonNext\"><i class=\"icon-fast-fw\"></i>Pokračovat</div>";
	html += "<h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<div id=\"restoreLessonList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel")!.innerHTML = html;
	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	request(CONFIG.apiuri + "/deleted-lesson", "GET", {}, function(response: RequestResponse): void
	{
		restoreLessonRenderLessonList(response as unknown as Array<DeletedLesson>);
	}, reAuthHandler);

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}
