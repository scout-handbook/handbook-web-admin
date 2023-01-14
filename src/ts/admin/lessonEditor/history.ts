import { LessonVersion } from "../interfaces/LessonVersion";
import { RequestResponse } from "../interfaces/RequestResponse";
import { LESSONS } from "../metadata";
import { ActionQueue } from "../tools/ActionQueue";
import { parseVersion } from "../tools/parseVersion";
import { refreshLogin } from "../tools/refreshLogin";
import { authFailHandler, request } from "../tools/request";
import { sidePanelDoubleOpen } from "../UI/sidePanel";
import { editor } from "./editor";
import { setChanged } from "./editor";
import { refreshPreview } from "./refreshPreview";
import { lessonSettings } from "./settings";

function lessonHistoryPreviewShowCurrent(): void {
  document.getElementById("lesson-history-preview")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  refreshPreview(
    (document.getElementById("name") as HTMLInputElement).value,
    editor.value(),
    "lesson-history-preview"
  );

  document.getElementById("lessonHistoryListHeader")!.innerHTML = "";

  refreshLogin();
}

function lessonHistoryPreviewRenderVersion(
  id: string,
  name: string,
  body: string,
  actionQueue: ActionQueue
): void {
  refreshPreview(name, body, "lesson-history-preview");
  const html =
    '<div class="button green-button" id="lessonHistoryRevert"><i class="icon-history"></i>Obnovit</div>';
  document.getElementById("lessonHistoryListHeader")!.innerHTML = html;

  document.getElementById("lessonHistoryRevert")!.onclick = function (): void {
    (document.getElementById("name") as HTMLInputElement).value = name;
    editor.value(body);
    setChanged();
    lessonSettings(id, actionQueue, true);
  };
}

function lessonHistoryPreviewShowVersion(
  id: string,
  actionQueue: ActionQueue,
  event: Event
): void {
  document.getElementById("lesson-history-preview")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  request(
    CONFIG["api-uri"] +
      "/v1.0/lesson/" +
      id +
      "/history/" +
      ((event.target as HTMLElement).dataset.version as string),
    "GET",
    {},
    function (response: RequestResponse): void {
      lessonHistoryPreviewRenderVersion(
        id,
        (event.target as HTMLElement).dataset.name!,
        response as string,
        actionQueue
      );
    },
    authFailHandler
  );

  document.getElementById("lessonHistoryListHeader")!.innerHTML = "";

  refreshLogin();
}

function lessonHistoryListRender(
  id: string,
  actionQueue: ActionQueue,
  list: Array<LessonVersion>
): void {
  let html = '<form id="side-panel-form">';
  html +=
    '<div class="form-row"><label class="form-switch"><input type="radio" name="version" checked><span class="form-custom form-radio"></span></label><span class="lesson-history-current">Současná verze</span> — ' +
    parseVersion(LESSONS.get(id)!.version) +
    "</div>";
  for (let i = 0; i < list.length; i++) {
    html +=
      '<div class="form-row"><label class="form-switch"><input type="radio" name="version" data-name="' +
      list[i].name +
      '" data-version="' +
      list[i].version.toString() +
      '"><span class="form-custom form-radio"></span></label><span class="lesson-history-version">' +
      list[i].name +
      "</span> — " +
      parseVersion(list[i].version) +
      "</div>";
  }
  html += "</form>";
  document.getElementById("lessonHistoryForm")!.innerHTML = html;

  const nodes = document
    .getElementById("side-panel-form")!
    .getElementsByTagName("input");
  nodes[0].onchange = function (): void {
    lessonHistoryPreviewShowCurrent();
  };
  if (nodes.length > 1) {
    for (let i = 1; i < nodes.length; i++) {
      nodes[i].onchange = function (event): void {
        lessonHistoryPreviewShowVersion(id, actionQueue, event);
      };
    }
  }
}

export function lessonHistoryOpen(id: string, actionQueue: ActionQueue): void {
  sidePanelDoubleOpen();
  const html =
    '<div id="lesson-history-list"><div class="button yellow-button" id="cancelEditorAction"><i class="icon-cancel"></i>Zrušit</div><span id="lessonHistoryListHeader"></span><h3 class="side-panel-title">Historie lekce</h3><div id="lessonHistoryForm"><div id="embedded-spinner"></div></div></div><div id="lesson-history-preview"></div>';
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("cancelEditorAction")!.onclick = function (): void {
    lessonSettings(id, actionQueue, true);
  };

  request(
    CONFIG["api-uri"] + "/v1.0/lesson/" + id + "/history",
    "GET",
    {},
    function (response: RequestResponse): void {
      lessonHistoryListRender(
        id,
        actionQueue,
        response as Array<LessonVersion>
      );
    },
    authFailHandler
  );
  lessonHistoryPreviewShowCurrent();
}
