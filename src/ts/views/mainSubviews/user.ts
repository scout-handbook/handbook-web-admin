/* global mainPageTab:true */
/* exported showUserSubview */

function renderRoleSelector(): string {
  let html = "";
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html += '<select class="form-select" id="role-search-filter">';
    html +=
      '<option id="all" value="all" class="select-filter-special">Všechny role</option>';
    html += '<option id="user" value="user">Uživatel</option>';
    html += '<option id="editor" value="editor">Editor</option>';
    if (LOGINSTATE.role === "superuser") {
      html +=
        '<option id="administrator" value="administrator">Administrátor</option>';
      html += '<option id="superuser" value="superuser">Superuser</option>';
    }
    html += "</select>";
  }
  return html;
}

function renderGroupSelector(): string {
  let html = '<select class="form-select" id="group-search-filter">';
  html +=
    '<option id="00000000-0000-0000-0000-000000000000" value="00000000-0000-0000-0000-000000000000" class="select-filter-special">Všechny skupiny</option>';
  GROUPS.filter(function (id) {
    return id !== "00000000-0000-0000-0000-000000000000";
  }).iterate(function (id, group) {
    html +=
      '<option id="' + id + '" value="' + id + '">' + group.name + "</option>";
  });
  html += "</select>";
  return html;
}

function renderUserRow(user: User): string {
  let html = "<tr><td>" + user.name + "</td><td>";
  switch (user.role) {
    case "superuser":
      html += "Superuser";
      break;
    case "administrator":
      html += "Administrátor";
      break;
    case "editor":
      html += "Editor";
      break;
    default:
      html += "Uživatel";
      break;
  }
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<br><div class="button cyanButton changeUserRole" data-id="' +
      user.id.toString() +
      '" data-role="' +
      user.role +
      '" data-name="' +
      user.name +
      '"><i class="icon-pencil"></i>Upravit</div><br>';
  }
  html += "</td><td>";
  let first = true;
  GROUPS.filter(function (id) {
    return user.groups.indexOf(id) >= 0;
  }).iterate(function (_, group) {
    if (!first) {
      html += ", ";
    }
    html += group.name;
    first = false;
  });
  if (user.groups.length > 0) {
    html += "<br>";
  }
  html +=
    '<div class="button cyanButton changeUserGroups" data-id="' +
    user.id.toString() +
    "\" data-groups='" +
    JSON.stringify(user.groups) +
    "' data-name=\"" +
    user.name +
    '"><i class="icon-pencil"></i>Upravit</div>';
  html += "</td></tr>";
  return html;
}

function showUserList(
  list: UserListResponse,
  searchName: string,
  page: number,
  perPage: number,
  role: Role | "all",
  group: string
): void {
  if (mainPageTab !== "users") {
    return;
  }
  const users = list.users;
  let html =
    '<form id="user-search-form"><input type="text" class="formText" id="user-search-box" placeholder="Jméno uživatele">';
  html += renderRoleSelector();
  html += renderGroupSelector();
  html +=
    '<div class="button" id="user-search-button"><i class="icon-search"></i>Vyhledat</div>';
  if (
    searchName ||
    role !== "all" ||
    group !== "00000000-0000-0000-0000-000000000000"
  ) {
    html +=
      '<div class="button yellowButton" id="user-search-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  }
  html += "</form>";
  html +=
    '<table class="user-table"><th>Jméno</th><th>Role</th><th>Skupiny</th>';
  html += "</tr>";
  for (let i = 0; i < users.length; i++) {
    html += renderUserRow(users[i]);
  }
  html += "</table>";
  html += renderPagination(Math.ceil(list.count / perPage), page);
  document.getElementById("userList")!.innerHTML = html;

  (document.getElementById("user-search-box") as HTMLInputElement).value =
    searchName;
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    (document.getElementById("role-search-filter") as HTMLSelectElement).value =
      role;
  }
  (document.getElementById("group-search-filter") as HTMLSelectElement).value =
    group;

  const submitFn = function (): boolean {
    const roleSel = document.getElementById(
      "role-search-filter"
    ) as HTMLSelectElement;
    const groupSel = document.getElementById(
      "group-search-filter"
    ) as HTMLSelectElement;
    let newRole: Role | "all" = "all";
    if (roleSel) {
      newRole = roleSel.options[roleSel.selectedIndex].value as Role;
    }
    downloadUserList(
      (document.getElementById("user-search-box") as HTMLInputElement).value,
      1,
      perPage,
      newRole,
      groupSel.options[groupSel.selectedIndex].value
    );
    return false;
  };
  document.getElementById("user-search-form")!.onsubmit = submitFn;
  document.getElementById("user-search-button")!.onclick = submitFn;
  if (
    searchName ||
    role !== "all" ||
    group !== "00000000-0000-0000-0000-000000000000"
  ) {
    document.getElementById("user-search-cancel")!.onclick = function (): void {
      downloadUserList(undefined, 1, perPage);
    };
  }
  const nodes = getElementsByClassName("pagination-button");
  for (let i = 0; i < nodes.length; i++) {
    (nodes[i] as HTMLElement).onclick = function (event): void {
      const roleSel = document.getElementById(
        "role-search-filter"
      ) as HTMLSelectElement;
      const groupSel = document.getElementById(
        "group-search-filter"
      ) as HTMLSelectElement;
      let newRole: Role | "all" = "all";
      if (roleSel) {
        newRole = roleSel.options[roleSel.selectedIndex].value as Role;
      }
      downloadUserList(
        searchName,
        parseInt((event.target as HTMLElement).dataset.page!, 10),
        perPage,
        newRole,
        groupSel.options[groupSel.selectedIndex].value
      );
    };
  }

  addOnClicks("changeUserRole", changeUserRoleOnClick);
  addOnClicks("changeUserGroups", changeUserGroupsOnClick);
}

function downloadUserList(
  searchName = "",
  page = 1,
  perPage = 25,
  role: Role | "all" = "all",
  group = "00000000-0000-0000-0000-000000000000"
): void {
  document.getElementById("userList")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  const payload: UserSearchQuery = {
    name: searchName,
    page: page,
    "per-page": perPage,
  };
  if (role !== "all") {
    payload.role = role;
  }
  if (group !== "00000000-0000-0000-0000-000000000000") {
    payload.group = group;
  }
  request(
    CONFIG["api-uri"] + "/v1.0/user",
    "GET",
    payload as unknown as Payload,
    function (response: RequestResponse): void {
      showUserList(
        response as UserListResponse,
        searchName,
        page,
        perPage,
        role,
        group
      );
    },
    reAuthHandler
  );
  refreshLogin(true);
}

function showUserSubview(noHistory: boolean): void {
  mainPageTab = "users";
  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("user-manager")!.className += " active-top-bar-tab";
  const html =
    "<h1>" + CONFIG["site-name"] + ' - Uživatelé</h1><div id="userList"></div>';
  document.getElementById("main-page")!.innerHTML = html;

  downloadUserList();
  if (!noHistory) {
    history.pushState({ page: "users" }, "title", "/admin/users");
  }
}
