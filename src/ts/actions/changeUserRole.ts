/* exported changeUserRoleOnClick */

let roleChanged = false;

function changeUserRolePayloadBuilder(): Payload {
  const sel = document.getElementById("role-select") as HTMLSelectElement;
  return { role: encodeURIComponent(sel.options[sel.selectedIndex].value) };
}

function changeUserRoleOnClick(event: MouseEvent): void {
  roleChanged = false;
  sidePanelOpen();
  let html =
    '<div class="button yellowButton" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="changeUserRoleSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Změnit roli: ' +
    getAttribute(event, "name") +
    '</h3><form id="side-panel-form">';
  html +=
    '<span class="role-text">Role: </span><select class="form-select" id="role-select">';
  html += '<option id="user" value="user">Uživatel</option>';
  html += '<option id="editor" value="editor">Editor</option>';
  if (LOGINSTATE.role === "superuser") {
    html +=
      '<option id="administrator" value="administrator">Administrátor</option>';
    html += '<option id="superuser" value="superuser">Superuser</option>';
  }
  html += "</select>";
  html += "</form>";
  html +=
    '<div class="role-help"><i class="icon-info-circled"></i><span class="role-help-name">Uživatel</span> - Kdokoliv, kdo se někdy přihlásil pomocí skautISu. Nemá žádná oprávnění navíc oproti nepřihlášeným návštěvníkům.</div>';
  html +=
    '<div class="role-help"><i class="icon-info-circled"></i><span class="role-help-name">Editor</span> - Instruktor, který má základní přístup ke správě. Může přidávat lekce, měnit jejich obsah, kompetence a přesouvat je mezi oblastmi. Editor má přístup ke správě uživatelů, avšak může prohlížet a měnit pouze hosty a uživatele.</div>';
  if (LOGINSTATE.role === "superuser") {
    html +=
      '<div class="role-help"><i class="icon-info-circled"></i><span class="role-help-name">Administrátor</span> - Instruktor, mající všechna práva editora. Navíc může i mazat lekce a přidávat, upravovat a mazat oblasti a kompetence. Administrátor může navíc přidělovat a odebírat práva editorů.</div>';
    html +=
      '<div class="role-help"><i class="icon-info-circled"></i><span class="role-help-name">Superuser</span> - Uživatel-polobůh.</div>';
  }
  document.getElementById("side-panel")!.innerHTML = html;

  (
    document.getElementById("role-select") as HTMLSelectElement
  ).options.namedItem(getAttribute(event, "role"))!.selected = true;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };

  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] +
        "/v1.0/user/" +
        encodeURIComponent(getAttribute(event, "id")) +
        "/role",
      "PUT",
      changeUserRolePayloadBuilder
    ),
  ]);
  document.getElementById("changeUserRoleSave")!.onclick = function (): void {
    dispatchIfChanged(aq, roleChanged);
  };

  document.getElementById("role-select")!.onchange = function (): void {
    roleChanged = true;
  };

  history.pushState({ sidePanel: "open" }, "title", "/admin/users");
  refreshLogin();
}
