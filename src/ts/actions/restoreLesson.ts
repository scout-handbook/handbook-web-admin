/* exported restoreLesson */

function restoreLessonRenderVersion(name: string, body: string): void {
  refreshPreview(name, body, "restore-lesson-preview");
  const html =
    '<div class="button green-button" id="restoreLessonEdit"><i class="icon-history"></i>Obnovit</div>';
  document.getElementById("restoreLessonListHeader")!.innerHTML = html;
  document.getElementById("restoreLessonEdit")!.onclick = function (): void {
    sidePanelOpen();
    history.back();
    showLessonRestoreView(name, body);
  };
}

function restoreLessonShowVersion(id: string, event: Event): void {
  const version = (event.target as HTMLElement).dataset.version as string;
  const name = (event.target as HTMLElement).dataset.name!;
  document.getElementById("restore-lesson-preview")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  request(
    CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + id + "/history/" + version,
    "GET",
    {},
    function (response: RequestResponse): void {
      restoreLessonRenderVersion(name, response as string);
    },
    authFailHandler
  );
  document.getElementById("restoreLessonListHeader")!.innerHTML = "";

  refreshLogin();
}

function restoreLessonRenderVersionList(
  id: string,
  list: Array<LessonVersion>
): void {
  sidePanelDoubleOpen();
  let html =
    '<div id="restore-lesson-version-list"><div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div><span id="restoreLessonListHeader"></span><h3 class="side-panel-title">Obnovit smazanou lekci</h3>';
  html += '<form id="side-panel-form">';
  for (let i = 0; i < list.length; i++) {
    html +=
      '<div class="form-row"><label class="form-switch"><input type="radio" name="restoreLessonversion" data-name="' +
      list[i].name +
      '" data-version="' +
      list[i].version.toString() +
      '"><span class="form-custom form-radio"></span></label><span class="restore-lesson-version">' +
      list[i].name +
      "</span> — " +
      parseVersion(list[i].version) +
      "</div>";
  }
  html += "</form>";
  html += '</div><div id="restore-lesson-preview"></div>';
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    sidePanelOpen();
    history.back();
  };
  const nodes = document
    .getElementById("side-panel-form")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onchange = function (event): void {
      restoreLessonShowVersion(id, event);
    };
  }
}

function restoreLessonSelectVersion(): void {
  const lessonId = parseBoolForm()[0];
  if (lessonId) {
    const html = '<div id="embedded-spinner"></div>';
    document.getElementById("restoreLessonList")!.innerHTML = html;
    request(
      CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + lessonId + "/history",
      "GET",
      {},
      function (response: RequestResponse): void {
        restoreLessonRenderVersionList(
          lessonId,
          response as Array<LessonVersion>
        );
      },
      reAuthHandler
    );
    document.getElementById("restoreLessonNext")!.removeAttribute("onclick");
  }
}

function restoreLessonRenderLessonList(list: IDList<DeletedLesson>): void {
  if (list.empty()) {
    sidePanelClose();
    spinner();
    dialog("Nejsou žádné smazané lekce.", "OK");
    refreshMetadata();
    history.back();
  }
  let html = '<form id="side-panel-form">';
  list.iterate(function (id, deletedLesson) {
    html +=
      '<div class="form-row"><label class="form-switch"><input type="radio" name="lesson" data-id="' +
      id +
      '"><span class="form-custom form-radio"></span></label>' +
      deletedLesson.name +
      "</div>";
  });
  html += "</form>";
  document.getElementById("restoreLessonList")!.innerHTML = html;
  document.getElementById("restoreLessonNext")!.onclick =
    restoreLessonSelectVersion;
}

function restoreLesson(): void {
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button green-button" id="restoreLessonNext"><i class="icon-fast-fw"></i>Pokračovat</div>';
  html += '<h3 class="side-panel-title">Obnovit smazanou lekci</h3>';
  html += '<div id="restoreLessonList"><div id="embedded-spinner"></div></div>';
  document.getElementById("side-panel")!.innerHTML = html;
  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };
  request(
    CONFIG["api-uri"] + "/v1.0/deleted-lesson",
    "GET",
    {},
    function (response: RequestResponse): void {
      restoreLessonRenderLessonList(
        new IDList<DeletedLesson>(response as Record<string, DeletedLesson>)
      );
    },
    reAuthHandler
  );

  history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  refreshLogin();
}
