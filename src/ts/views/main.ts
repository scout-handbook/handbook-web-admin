/* exported mainPageTab, showMainView */

let mainPageTab: MainPageTab = "lessons";

function renderMainView(noHistory: boolean): void {
  if (LOGINSTATE.avatar) {
    (document.getElementById("userAvatar") as HTMLImageElement).src =
      "data:image/png;base64," + LOGINSTATE.avatar;
  }
  document.getElementById("userName")!.innerHTML = LOGINSTATE.name;

  document.getElementById("lessonManager")!.onclick = function (): void {
    showLessonSubview(false);
  };
  document.getElementById("competenceManager")!.onclick = function (): void {
    showCompetenceSubview(false);
  };
  document.getElementById("imageManager")!.onclick = function (): void {
    showImageSubview(false);
  };
  document.getElementById("userManager")!.onclick = function (): void {
    showUserSubview(false);
  };
  document.getElementById("groupManager")!.onclick = function (): void {
    showGroupSubview(false);
  };

  if (mainPageTab === "competences") {
    showCompetenceSubview(noHistory);
  } else if (mainPageTab === "images") {
    showImageSubview(noHistory);
  } else if (mainPageTab === "users") {
    showUserSubview(noHistory);
  } else if (mainPageTab === "groups") {
    showGroupSubview(noHistory);
  } else {
    showLessonSubview(noHistory);
  }
}

function showMainView(noHistory: boolean): void {
  let html = '<div id="side-panel"></div><div id="side-panel-overlay"></div>';
  html +=
    '<div id="topBar"><div id="userAccount"><img id="userAvatar" alt="Account avatar" src="' +
    CONFIG["admin-uri"] +
    '/avatar.png">';
  html += '<div id="userName">&nbsp;</div>';
  html +=
    '<div id="log-link"><a href="' +
    CONFIG["api-uri"] +
    "/v1.0/logout?redirect-uri=" +
    encodeURIComponent(CONFIG["frontend-uri"]) +
    '">Odhlásit</a><a href="/" id="frontend-link">Zpět na web</a></div></div>';
  html += '<div class="topBarTab" id="lessonManager">Lekce</div>';
  html += '<div class="topBarTab" id="competenceManager">Kompetence</div>';
  html += '<div class="topBarTab" id="imageManager">Obrázky</div>';
  html += '<div class="topBarTab" id="userManager">Uživatelé</div>';
  html += '<div class="topBarTab" id="groupManager">Uživatelské skupiny</div>';
  html += "</div>";
  html += '<div id="mainPageContainer"><div id="main-page">';
  html += "<h1>" + CONFIG["site-name"] + " - ";
  if (mainPageTab === "competences") {
    html += "Kompetence";
  } else if (mainPageTab === "images") {
    html += "Obrázky";
  } else if (mainPageTab === "users") {
    html += "Uživatelé";
  } else if (mainPageTab === "groups") {
    html += "Uživatelské skupiny";
  } else {
    html += "Lekce";
  }
  html += '</h1><div id="embeddedSpinner"></div></div></div>';
  document.getElementsByTagName("main")[0].innerHTML = html;
  document.getElementsByTagName("main")[0].scrollTop = 0;
  metadataEvent.addCallback(function (): void {
    renderMainView(noHistory);
  });
}
