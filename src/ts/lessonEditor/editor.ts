/* global changed:true, editor:true, lessonSettingsCacheEvent:true */
/* exported showLessonEditor */

let changed: boolean;
const lessonSettingsCache: LessonSettingsCache = {
  competences: [],
  field: "",
  groups: [],
};
let lessonSettingsCacheEvent: AfterLoadEvent;
let editor: EasyMDE;

function populateEditorCache(id: string | null): void {
  lessonSettingsCacheEvent = new AfterLoadEvent(1);
  if (!id) {
    lessonSettingsCache["field"] = "";
    lessonSettingsCache["competences"] = [];
    lessonSettingsCache["groups"] = [];
    lessonSettingsCacheEvent.trigger();
    return;
  }
  request(
    CONFIG["api-uri"] + "/v1.0/lesson/" + id + "/group",
    "GET",
    {},
    function (response: RequestResponse): void {
      lessonSettingsCache["groups"] = response as Array<string>;
      lessonSettingsCacheEvent.trigger();
    },
    reAuthHandler
  );
  FIELDS.filter(function (_, field): boolean {
    return field.lessons.indexOf(id) >= 0;
  }).iterate(function (fieldId) {
    lessonSettingsCache["field"] = fieldId;
  });
  lessonSettingsCache["competences"] = LESSONS.get(id)!.competences;
}

function editorDiscardNow(actionQueue: ActionQueue): void {
  history.back();
  actionQueue.dispatch(true);
}

function editorDiscard(actionQueue: ActionQueue): void {
  if (!changed) {
    editorDiscardNow(actionQueue);
  } else {
    dialog(
      "Opravdu si přejete zahodit všechny změny?",
      "Ano",
      function (): void {
        editorDiscardNow(actionQueue);
      },
      "Ne"
    );
  }
  refreshLogin();
}

function editorOnChange(afterAction: (() => void) | null): void {
  changed = true;
  refreshPreview(
    (document.getElementById("name") as HTMLInputElement).value,
    editor.value(),
    "preview-inner"
  );
  refreshLogin(false, afterAction);
}

function showLessonEditor(
  name: string,
  body: string,
  saveActionQueue: ActionQueue,
  id: string | null,
  discardActionQueue = new ActionQueue(),
  refreshAction: (() => void) | null = null
): void {
  populateEditorCache(id);
  changed = false;
  const html =
    '\
<div id="side-panel"></div><div id="side-panel-overlay"></div>\
<header>\
	<div class="button yellow-button" id="discard">\
		<i class="icon-cancel"></i>Zrušit\
	</div>\
	<form>\
		<input type="text" class="form-text form-name" id="name" value="' +
    name +
    '" autocomplete="off">\
	</form>\
	<div class="button green-button" id="save">\
		<i class="icon-floppy"></i>Uložit\
	</div>\
	<div class="button" id="lesson-settings">\
		<i class="icon-cog"></i>Nastavení\
	</div>\
</header>\
<div id="image-selector">\
	<div id="image-scroller">\
		<div class="button yellow-button" id="close-image-selector">\
			<i class="icon-up-open"></i> Zavřít\
		</div>\
		<div class="button green-button" id="imageSelectorAdd">\
			<i class="icon-plus"></i> Nahrát\
		</div>\
		<div id="image-wrapper"></div>\
	</div>\
</div>\
<div id="editor"><textarea></textarea></div><div id="preview"><div id="preview-inner"></div></div>';

  document.getElementsByTagName("main")[0].innerHTML = html;
  refreshPreview(name, body, "preview-inner");

  document.getElementById("discard")!.onclick = function (): void {
    editorDiscard(discardActionQueue);
  };
  document.getElementById("save")!.onclick = function (): void {
    if (changed) {
      saveActionQueue.defaultDispatch(false);
    } else {
      history.back();
      discardActionQueue.defaultDispatch(false);
    }
  };
  document.getElementById("lesson-settings")!.onclick = function (): void {
    lessonSettings(id, saveActionQueue, false);
  };
  document.getElementById("close-image-selector")!.onclick =
    toggleImageSelector;
  //document.getElementById("imageSelectorAdd")!.onclick = function(): void {addImage(true);};
  document.getElementById("imageSelectorAdd")!.style.display = "none"; // TODO: Re-enable uploads in editor without discarding its contents

  editor = new EasyMDE({
    autoDownloadFontAwesome: false,
    autofocus: true,
    element: document.getElementById("editor")!.firstChild as HTMLElement,
    indentWithTabs: false,
    parsingConfig: {
      allowAtxHeaderWithoutSpace: true,
    },
    spellChecker: false,
    status: false,
    tabSize: 4,
    toolbar: [
      {
        name: "bold",
        action: EasyMDE.toggleBold,
        className: "icon-bold",
        title: "Tučné",
      },
      {
        name: "italic",
        action: EasyMDE.toggleItalic,
        className: "icon-italic",
        title: "Kurzíva",
      },
      {
        name: "heading",
        action: EasyMDE.toggleHeadingSmaller,
        className: "icon-header",
        title: "Nadpis",
      },
      "|",
      {
        name: "unordered-list",
        action: EasyMDE.toggleUnorderedList,
        className: "icon-list-bullet",
        title: "Seznam s odrážkami",
      },
      {
        name: "ordered-list",
        action: EasyMDE.toggleOrderedList,
        className: "icon-list-numbered",
        title: "Číslovaný seznam",
      },
      "|",
      {
        name: "link",
        action: EasyMDE.drawLink,
        className: "icon-link",
        title: "Vložit odkaz",
      },
      {
        name: "image",
        action: toggleImageSelector,
        className: "icon-picture",
        title: "Vložit obrázek",
      },
      {
        name: "table",
        action: EasyMDE.drawTable,
        className: "icon-table",
        title: "Vložit tabulku",
      },
    ],
  });
  editor.value(body);
  editor.codemirror.getDoc().clearHistory();
  editor.codemirror.on("change", function (): void {
    editorOnChange(refreshAction);
  });

  document.getElementById("name")!.oninput = function (): void {
    editorOnChange(refreshAction);
  };
  document.getElementById("name")!.onchange = function (): void {
    editorOnChange(refreshAction);
  };

  prepareImageSelector();
}
