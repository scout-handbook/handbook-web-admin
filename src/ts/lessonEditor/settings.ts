/* exported lessonSettings */

function renderField(): string {
  let html = '<br><h3 class="sidePanelTitle noNewline">Oblast</h3>';
  html +=
    '<div class="button cyanButton" id="changeField"><i class="icon-pencil"></i>Upravit</div><br>';
  if (!lessonSettingsCache.field) {
    html += '<span class="anonymousField">Nezařazeno</span>';
  } else {
    html += FIELDS.get(lessonSettingsCache.field)!.name;
  }
  return html;
}

function renderCompetences(): string {
  let html = '<br><h3 class="sidePanelTitle noNewline">Kompetence</h3>';
  html +=
    '<div class="button cyanButton" id="changeCompetences"><i class="icon-pencil"></i>Upravit</div>';
  COMPETENCES.filter(function (id) {
    return lessonSettingsCache.competences.indexOf(id) >= 0;
  }).iterate(function (_, competence) {
    html +=
      '<br><span class="competenceNumber">' +
      competence.number.toString() +
      ":</span> " +
      competence.name;
  });
  return html;
}

function prerenderGroups(): string {
  let html = '<br><h3 class="sidePanelTitle noNewline">Skupiny</h3>';
  html +=
    '<div class="button cyanButton" id="changeGroups"><i class="icon-pencil"></i>Upravit</div><br><div id="settingsGroupList"><div id="embeddedSpinner"></div></div>';
  return html;
}

function renderGroups(): void {
  document.getElementById("changeGroups")!.style.display = "inline-block";
  let html = "";
  GROUPS.filter(function (id) {
    return lessonSettingsCache.groups.indexOf(id) >= 0;
  }).iterate(function (id, group) {
    if (id === "00000000-0000-0000-0000-000000000000") {
      html += '<span class="publicGroup">' + group.name + "</span><br>";
    } else {
      html += group.name + "<br>";
    }
  });
  document.getElementById("settingsGroupList")!.innerHTML = html;
}

function lessonSettings(
  id: string | null,
  actionQueue: ActionQueue,
  noHistory: boolean
): void {
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="sidePanelCancel"><i class="icon-right-open"></i>Zavřít</div>';
  if (id != null) {
    html +=
      '<div class="button" id="lessonHistoryOpen"><i class="icon-history"></i>Historie lekce</div>';
  }
  html += renderField();
  html += renderCompetences();
  html += prerenderGroups();
  document.getElementById("sidePanel")!.innerHTML = html;
  lessonSettingsCacheEvent.addCallback(renderGroups);

  document.getElementById("sidePanelCancel")!.onclick = function (): void {
    history.back();
  };
  if (id != null) {
    document.getElementById("lessonHistoryOpen")!.onclick = function (): void {
      lessonHistoryOpen(id, actionQueue);
    };
  }
  document.getElementById("changeField")!.onclick = function (): void {
    changeLessonFieldOnClick(id, actionQueue);
  };
  document.getElementById("changeCompetences")!.onclick = function (): void {
    changeLessonCompetencesOnClick(id, actionQueue);
  };
  document.getElementById("changeGroups")!.onclick = function (): void {
    changeLessonGroupsOnClick(id, actionQueue);
  };
  if (!noHistory) {
    history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  }
  refreshLogin();
}
