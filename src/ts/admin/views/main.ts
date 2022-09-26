import { LOGINSTATE, metadataEvent } from "../metadata";
import { MainPageTab } from "../interfaces/MainPageTab";
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
  metadataEvent.addCallback(function (): void {
    renderMainView(noHistory);
  });
}
