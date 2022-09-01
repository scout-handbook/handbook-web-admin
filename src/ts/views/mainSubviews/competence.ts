/* global mainPageTab:true */
/* exported mainPageTab, showCompetenceSubview */

function renderCompetenceList(): string {
  let html = "";
  COMPETENCES.iterate(function (id, competence) {
    html +=
      '<h3 class = "main-page">' +
      competence.number.toString() +
      ": " +
      competence.name +
      "</h3><br>";
    if (
      LOGINSTATE.role === "administrator" ||
      LOGINSTATE.role === "superuser"
    ) {
      html +=
        '<div class="button cyanButton change-competence" data-id="' +
        id +
        '"><i class="icon-pencil"></i>Upravit</div>';
      html +=
        '<div class="button redButton delete-competence" data-id="' +
        id +
        '"><i class="icon-trash-empty"></i>Smazat</div><br>';
    }
    html +=
      '<span class="main-page competenceDescription">' +
      competence.description +
      "</span><br>";
  });
  return html;
}

function showCompetenceSubview(noHistory: boolean): void {
  mainPageTab = "competences";
  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("competence-manager")!.className += " active-top-bar-tab";
  let html = "<h1>" + CONFIG["site-name"] + " - Kompetence</h1>";
  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    html +=
      '<div class="button greenButton" id="addCompetence"><i class="icon-plus"></i>Přidat</div><br>';
  }
  html += renderCompetenceList();
  document.getElementById("main-page")!.innerHTML = html;
  document.getElementById("main-page-container")!.scrollTop = 0;

  if (LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser") {
    document.getElementById("addCompetence")!.onclick = addCompetence;
  }

  addOnClicks("change-competence", changeCompetenceOnClick);
  addOnClicks("delete-competence", deleteCompetenceOnClick);
  if (!noHistory) {
    history.pushState({ page: "competences" }, "title", "/admin/competences");
  }
  refreshLogin(true);
}
