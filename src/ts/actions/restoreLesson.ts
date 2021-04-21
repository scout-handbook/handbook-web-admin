/* exported restoreLesson */

function restoreLessonRenderVersion(name: string, body: string): void
{
	refreshPreview(name, body, "restoreLessonPreview");
	const html = "<div class=\"button greenButton\" id=\"restoreLessonEdit\"><i class=\"icon-history\"></i>Obnovit</div>";
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
	const version = (event.target as HTMLElement).dataset.version as string;
	const name = (event.target as HTMLElement).dataset.name!;
	document.getElementById("restoreLessonPreview")!.innerHTML = "<div id=\"embeddedSpinner\"></div>";
	request(CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + id + "/history/" + version, "GET", {}, function(response: RequestResponse): void
	{
		restoreLessonRenderVersion(name, response as unknown as string);
	}, authFailHandler);
	document.getElementById("restoreLessonListHeader")!.innerHTML = "";

	refreshLogin();
}

function restoreLessonRenderVersionList(id: string, list: Array<LessonVersion>): void
{
	sidePanelDoubleOpen();
	let html = "<div id=\"restoreLessonVersionList\"><div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div><span id=\"restoreLessonListHeader\"></span><h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<form id=\"sidePanelForm\">";
	for(let i = 0; i < list.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"restoreLessonversion\" data-name=\"" + list[i].name + "\" data-version=\"" + list[i].version.toString() + "\"><span class=\"formCustom formRadio\"></span></label><span class=\"restoreLessonVersion\">" + list[i].name + "</span> — " + parseVersion(list[i].version) + "</div>";
	}
	html += "</form>"
	html += "</div><div id=\"restoreLessonPreview\"></div>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		sidePanelOpen();
		history.back();
	};
	const nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	for(let i = 0; i < nodes.length; i++)
	{
		nodes[i].onchange = function(event): void {restoreLessonShowVersion(id, event);};
	}
}

function restoreLessonSelectVersion(): void
{
	const lessonId = parseBoolForm()[0];
	if(lessonId)
	{
		const html = "<div id=\"embeddedSpinner\"></div>";
		document.getElementById("restoreLessonList")!.innerHTML = html;
		request(CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + lessonId + "/history", "GET", {}, function(response: RequestResponse): void
		{
			restoreLessonRenderVersionList(lessonId, response as unknown as Array<LessonVersion>);
		}, reAuthHandler);
		document.getElementById("restoreLessonNext")!.removeAttribute("onclick");
	}
}

function restoreLessonRenderLessonList(list: IDList<DeletedLesson>): void
{
	if(list.empty())
	{
		sidePanelClose();
		spinner();
		dialog("Nejsou žádné smazané lekce.", "OK");
		refreshMetadata();
		history.back();
	}
	let html = "<form id=\"sidePanelForm\">";
	list.iterate(function(id, deletedLesson)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"lesson\" data-id=\"" + id + "\"><span class=\"formCustom formRadio\"></span></label>" + deletedLesson.name + "</div>";
	});
	html += "</form>";
	document.getElementById("restoreLessonList")!.innerHTML = html;
	document.getElementById("restoreLessonNext")!.onclick = restoreLessonSelectVersion;
}

function restoreLesson(): void
{
	sidePanelOpen();
	let html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"restoreLessonNext\"><i class=\"icon-fast-fw\"></i>Pokračovat</div>";
	html += "<h3 class=\"sidePanelTitle\">Obnovit smazanou lekci</h3>";
	html += "<div id=\"restoreLessonList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel")!.innerHTML = html;
	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	request(CONFIG["api-uri"] + "/v1.0/deleted-lesson", "GET", {}, function(response: RequestResponse): void
	{
		restoreLessonRenderLessonList(new IDList<DeletedLesson>(response as IDListItems<DeletedLesson>));
	}, reAuthHandler);

	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}
