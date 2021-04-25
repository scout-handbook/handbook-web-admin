/* global changed:true */
/* exported changed, changeLessonGroupsOnClick */

let lessonGroupsChanged = false;

function changeLessonGroupsSave(
  id: string | null,
  actionQueue: ActionQueue
): void {
  id = id !== null ? id : "{id}";
  if (lessonGroupsChanged) {
    changed = true;
    const groups = parseBoolForm();
    const encodedGroups: Array<string> = [];
    for (let i = 0; i < groups.length; i++) {
      encodedGroups.push(encodeURIComponent(groups[i]));
    }
    actionQueue.actions.push(
      new Action(
        CONFIG["api-uri"] + "/v1.0/lesson/" + id + "/group",
        "PUT",
        function (): Payload {
          return { group: encodedGroups };
        }
      )
    );
    lessonSettingsCache.groups = groups;
    lessonSettings(id, actionQueue, true);
  } else {
    lessonSettings(id, actionQueue, true);
  }
}

function lessonGroupsOnclick(): void {
  lessonGroupsChanged = true;
}

function changeLessonGroupsOnClick(
  id: string | null,
  actionQueue: ActionQueue
): void {
  lessonGroupsChanged = false;
  let html =
    '<div class="button yellowButton" id="cancelEditorAction"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeLessonGroupsSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="sidePanelTitle">Změnit skupiny</h3><form id="sidePanelForm">';
  let publicName = "";
  GROUPS.iterate(function (groupId, group) {
    html +=
      '<div class="formRow"><label class="formSwitch"><input type="checkbox"';
    if (lessonSettingsCache.groups.indexOf(groupId) >= 0) {
      html += " checked";
    }
    html += ' data-id="' + groupId + '"';
    html += '><span class="formCustom formCheckbox"></span></label>';
    if (groupId === "00000000-0000-0000-0000-000000000000") {
      html += '<span class="publicGroup">' + group.name + "</span></div>";
      publicName = group.name;
    } else {
      html += group.name + "</div>";
    }
  });
  html += "</form>";
  html +=
    '<div class="groupHelp"><i class="icon-info-circled"></i> U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele vůbec přístupná (pouze v administraci). Pokud je vybrána skupina "<span class="publicGroup">' +
    publicName +
    '</span>", bude lekce přístupná všem uživatelům (i nepřihlášeným návštěvníkům webu) bez ohledu na skupiny.</div>';
  document.getElementById("sidePanel")!.innerHTML = html;

  document.getElementById("cancelEditorAction")!.onclick = function (): void {
    lessonSettings(id, actionQueue, true);
  };
  document.getElementById(
    "changeLessonGroupsSave"
  )!.onclick = function (): void {
    changeLessonGroupsSave(id, actionQueue);
  };

  const nodes = document
    .getElementById("sidePanelForm")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onchange = lessonGroupsOnclick;
  }

  refreshLogin();
}
