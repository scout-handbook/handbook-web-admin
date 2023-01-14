import { MainPageTab } from "../interfaces/MainPageTab";
import { LOGINSTATE, metadataEvent } from "../metadata";
import { showCompetenceSubview } from "./mainSubviews/competence";
import { showGroupSubview } from "./mainSubviews/group";
import { showImageSubview } from "./mainSubviews/image";
import { showLessonSubview } from "./mainSubviews/lesson";
import { showUserSubview } from "./mainSubviews/user";

export let mainPageTab: MainPageTab = "lessons";

export function setMainPageTab(val: MainPageTab): void {
  mainPageTab = val;
}

function renderMainView(noHistory: boolean): void {
  if (LOGINSTATE.avatar) {
    (document.getElementById("user-avatar") as HTMLImageElement).src =
      "data:image/png;base64," + LOGINSTATE.avatar;
  }
  document.getElementById("user-name")!.innerHTML = LOGINSTATE.name;

  document.getElementById("lesson-manager")!.onclick = function (): void {
    showLessonSubview(false);
  };
  document.getElementById("competence-manager")!.onclick = function (): void {
    showCompetenceSubview(false);
  };
  document.getElementById("image-manager")!.onclick = function (): void {
    showImageSubview(false);
  };
  document.getElementById("user-manager")!.onclick = function (): void {
    showUserSubview(false);
  };
  document.getElementById("group-manager")!.onclick = function (): void {
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

export function showMainView(noHistory: boolean): void {
  let html = '<div id="side-panel"></div><div id="side-panel-overlay"></div>';
  html +=
    '<div id="top-bar"><div id="user-account"><img id="user-avatar" alt="Account avatar" src="' +
    CONFIG["admin-uri"] +
    '/avatar.png">';
  html += '<div id="user-name">&nbsp;</div>';
  html +=
    '<div id="log-link"><a href="' +
    CONFIG["api-uri"] +
    "/v1.0/logout?redirect-uri=" +
    encodeURIComponent(CONFIG["frontend-uri"]) +
    '">Odhlásit</a><a href="/" id="frontend-link">Zpět na web</a></div></div>';
  html += '<div class="top-bar-tab" id="lesson-manager">Lekce</div>';
  html += '<div class="top-bar-tab" id="competence-manager">Kompetence</div>';
  html += '<div class="top-bar-tab" id="image-manager">Obrázky</div>';
  html += '<div class="top-bar-tab" id="user-manager">Uživatelé</div>';
  html +=
    '<div class="top-bar-tab" id="group-manager">Uživatelské skupiny</div>';
  html += "</div>";
  html += '<div id="main-page-container"><div id="main-page">';
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
  html += '</h1><div id="embedded-spinner"></div></div></div>';
  document.getElementsByTagName("main")[0].innerHTML = html;
  document.getElementsByTagName("main")[0].scrollTop = 0;
  metadataEvent.addCallback(function (): void {
    renderMainView(noHistory);
  });
}
