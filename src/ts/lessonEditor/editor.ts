/* global editor:true, lessonSettingsCacheEvent:true */
/* exported showLessonEditor */

var changed: boolean;
var lessonSettingsCache: LessonSettingsCache = {competences: [], field: "", groups: []};
var lessonSettingsCacheEvent: AfterLoadEvent;
var editor: EasyMDE;

function populateEditorCache(id: string|null): void
{
	lessonSettingsCacheEvent = new AfterLoadEvent(1);
	if(!id)
	{
		lessonSettingsCache["field"] = "";
		lessonSettingsCache["competences"] = [];
		lessonSettingsCache["groups"] = [];
		lessonSettingsCacheEvent.trigger();
		return;
	}
	request(CONFIG.apiuri + "/lesson/" + id + "/group", "GET", {}, function(response: RequestResponse): void
	{
		lessonSettingsCache["groups"] = response as unknown as Array<string>;
		lessonSettingsCacheEvent.trigger();
	}, reAuthHandler);
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				if(FIELDS[i].id)
				{
					lessonSettingsCache["field"] = FIELDS[i].id;
				}
				else
				{
					lessonSettingsCache["field"] = "";
				}
				lessonSettingsCache["competences"] = FIELDS[i].lessons[j].competences;
				break outer;
			}
		}
	}
}

function editorDiscardNow(actionQueue: ActionQueue): void
{
	history.back();
	actionQueue.dispatch(true);
}

function editorDiscard(actionQueue: ActionQueue): void
{
	if(!changed)
	{
		editorDiscardNow(actionQueue);
	}
	else
	{
		dialog("Opravdu si přejete zahodit všechny změny?", "Ano", function(): void
		{
			editorDiscardNow(actionQueue);
		}, "Ne");
	}
	refreshLogin();
}

function editorOnChange(afterAction: () => void): void
{
	changed = true;
	refreshPreview((document.getElementById("name") as HTMLInputElement).value, editor.value(), "preview-inner");
	refreshLogin(false, afterAction);
}

function showLessonEditor(name: string, body: string, saveActionQueue: ActionQueue, id: string|null, discardActionQueue = new ActionQueue(), refreshAction = function(): void {}): void
{
	populateEditorCache(id);
	changed = false;
	var html = '\
<div id="sidePanel"></div><div id="sidePanelOverlay"></div>\
<header>\
	<div class="button yellowButton" id="discard">\
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="formText formName" id="name" value="' + name + '" autocomplete="off">\
	</form>\
	<div class="button greenButton" id="save">\
		<i class="icon-floppy"></i>Uložit\
	</div>\
	<div class="button" id="lessonSettings">\
		<i class="icon-cog"></i>Nastavení\
	</div>\
</header>\
<div id="imageSelector">\
	<div id="imageScroller">\
		<div class="button yellowButton" id="closeImageSelector">\
			<i class="icon-up-open"></i> Zavřít\
		</div>\
		<div class="button greenButton" id="imageSelectorAdd">\
			<i class="icon-plus"></i> Nahrát\
		</div>\
		<div id="imageWrapper"></div>\
	</div>\
</div>\
<div id="editor"><textarea></textarea></div><div id="preview"><div id="preview-inner"></div></div>';

	document.getElementsByTagName("main")[0].innerHTML = html;
	refreshPreview(name, body, "preview-inner");

	document.getElementById("discard")!.onclick = function(): void {editorDiscard(discardActionQueue);};
	document.getElementById("save")!.onclick = function(): void {saveActionQueue.defaultDispatch(false);}; // TODO: Check if editing, then if no change, do nothing
	document.getElementById("lessonSettings")!.onclick = function(): void {lessonSettings(id, saveActionQueue, false);};
	document.getElementById("closeImageSelector")!.onclick = toggleImageSelector;
	document.getElementById("imageSelectorAdd")!.onclick = function(): void {addImage(true);};

	editor = new EasyMDE({
		autoDownloadFontAwesome: false,
		autofocus: true,
		element: document.getElementById("editor")!.firstChild as HTMLElement,
		indentWithTabs: false,
		parsingConfig: {
			allowAtxHeaderWithoutSpace: true
		},
		spellChecker: false,
		status: false,
		tabSize: 4,
		toolbar: [{
			name: "bold",
			action: EasyMDE.toggleBold,
			className: "icon-bold",
			title: "Tučné"
		},
		{
			name: "italic",
			action: EasyMDE.toggleItalic,
			className: "icon-italic",
			title: "Kurzíva"
		},
		{
			name: "heading",
			action: EasyMDE.toggleHeadingSmaller,
			className: "icon-header",
			title: "Nadpis"
		},
		"|",
		{
			name: "unordered-list",
			action: EasyMDE.toggleUnorderedList,
			className: "icon-list-bullet",
			title: "Seznam s odrážkami"
		},
		{
			name: "ordered-list",
			action: EasyMDE.toggleOrderedList,
			className: "icon-list-numbered",
			title: "Číslovaný seznam"
		},
		"|",
		{
			name: "link",
			action: EasyMDE.drawLink,
			className: "icon-link",
			title: "Vložit odkaz"
		},
		{
			name: "image",
			action: toggleImageSelector,
			className: "icon-picture",
			title: "Vložit obrázek"
		},
		{
			name: "table",
			action: EasyMDE.drawTable,
			className: "icon-table",
			title: "Vložit tabulku"
		}
		]
	});
	editor.value(body);
	editor.codemirror.getDoc().clearHistory();
	editor.codemirror.on("change", function(): void {editorOnChange(refreshAction);});

	document.getElementById("name")!.oninput = function(): void {editorOnChange(refreshAction);};
	document.getElementById("name")!.onchange = function(): void {editorOnChange(refreshAction);};

	prepareImageSelector();
}
