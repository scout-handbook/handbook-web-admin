/* global mainPageTab:true */
/* exported mainPageTab, showGroupSubview */

function renderGroupList(): string {
  let html = "";
  GROUPS.iterate(function (id, group) {
    if (id === "00000000-0000-0000-0000-000000000000") {
      html += '<br><h3 class = "main-page public-group">' + group.name + "</h3>";
    } else {
      html += '<br><h3 class = "main-page">' + group.name + "</h3>";
    }
    if (
      LOGINSTATE.role === "administrator" ||
      LOGINSTATE.role === "superuser"
    ) {
      html +=
        '<div class="button cyan-button changeGroup" data-id="' +
        id +
        '"><i class="icon-pencil"></i>Upravit</div>';
      if (id !== "00000000-0000-0000-0000-000000000000") {
        html +=
          '<div class="button red-button deleteGroup" data-id="' +
          id +
          '"><i class="icon-trash-empty"></i>Smazat</div>';
        html +=
          '<div class="button importGroup" data-id="' +
          id +
          '"><i class="icon-user-plus"></i> Importovat ze SkautISu</div>';
      }
    }
    if (id !== "00000000-0000-0000-0000-000000000000") {
      html +=
        '<br><span class="main-page">Uživatelů: ' +
        group.count.toString() +
        "</span>";
    }
  });
  return html;
}

function showGroupSubview(noHistory: boolean): void {
  mainPageTab = "groups";
  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("group-manager")!.className += " active-top-bar-tab";
  let html = "<h1>" + CONFIG["site-name"] + " - Uživatelské skupiny</h1>";
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<div class="button green-button" id="addGroup"><i class="icon-plus"></i>Přidat</div>';
  }
  html += renderGroupList();
  document.getElementById("main-page")!.innerHTML = html;
  document.getElementById("main-page-container")!.scrollTop = 0;

  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    document.getElementById("addGroup")!.onclick = addGroup;
  }

  addOnClicks("changeGroup", changeGroupOnClick);
  addOnClicks("importGroup", importGroupOnClick);
  addOnClicks("deleteGroup", deleteGroupOnClick);
  if (!noHistory) {
    history.pushState({ page: "groups" }, "title", "/admin/groups");
  }
  refreshLogin(true);
}
