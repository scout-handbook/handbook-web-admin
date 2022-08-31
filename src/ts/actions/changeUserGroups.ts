/* exported changeUserGroupsOnClick */

let groupsChanged = false;

function changeUserPayloadBuilder(): Payload {
  const groups = parseBoolForm();
  const encodedGroups = [];
  for (let i = 0; i < groups.length; i++) {
    encodedGroups.push(encodeURIComponent(groups[i]));
  }
  return { group: encodedGroups };
}

function userGroupsOnclick(): void {
  groupsChanged = true;
}

function changeUserGroupsOnClick(event: MouseEvent): void {
  groupsChanged = false;
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="sidePanelCancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeUserGroupsSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="sidePanelTitle">Změnit skupiny: ' +
    getAttribute(event, "name") +
    '</h3><form id="sidePanelForm">';
  const currentGroups = JSON.parse(
    getAttribute(event, "groups")
  ) as Array<string>;
  let publicName = "";
  GROUPS.iterate(function (id, group) {
    if (id === "00000000-0000-0000-0000-000000000000") {
      publicName = group.name;
    } else {
      html +=
        '<div class="formRow"><label class="formSwitch"><input type="checkbox"';
      if (currentGroups.indexOf(id) >= 0) {
        html += " checked";
      }
      html += ' data-id="' + id + '"';
      html += '><span class="formCustom formCheckbox"></span></label>';
      html += group.name + "</div>";
    }
  });
  html += "</form>";
  html +=
    '<div class="group-help"><i class="icon-info-circled"></i> Každého uživatele lze zařadit do několika skupin (nebo i žádné). Podle toho poté tento uživatel bude moct zobrazit pouze lekce, které byly těmto skupiným zveřejněny. Lekce ve skupině "<span class="publicGroup">' +
    publicName +
    '</span>" uvidí všichni uživatelé bez ohledu na jejich skupiny. </div>';
  document.getElementById("sidePanel")!.innerHTML = html;

  document.getElementById("sidePanelCancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] +
        "/v1.0/user/" +
        encodeURIComponent(getAttribute(event, "id")) +
        "/group",
      "PUT",
      changeUserPayloadBuilder
    ),
  ]);
  document.getElementById("changeUserGroupsSave")!.onclick = function (): void {
    dispatchIfChanged(aq, groupsChanged);
  };

  const nodes = document
    .getElementById("sidePanelForm")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onchange = userGroupsOnclick;
  }

  history.pushState({ sidePanel: "open" }, "title", "/admin/users");
  refreshLogin();
}
