import { metadataEvent } from "../metadata";
import { MainPageTab } from "../interfaces/MainPageTab";
import { showGroupSubview } from "./mainSubviews/group";
import { showUserSubview } from "./mainSubviews/user";

export let mainPageTab: MainPageTab = "lessons";

export function setMainPageTab(val: MainPageTab): void {
  mainPageTab = val;
}

function renderMainView(noHistory: boolean): void {
  if (mainPageTab === "competences") {
    //showCompetenceSubview(noHistory);
  } else if (mainPageTab === "images") {
    //showImageSubview(noHistory);
  } else if (mainPageTab === "users") {
    showUserSubview(noHistory);
  } else if (mainPageTab === "groups") {
    showGroupSubview(noHistory);
  } else {
    //showLessonSubview(noHistory);
  }
}

export function showMainView(noHistory: boolean): void {
  metadataEvent.addCallback(function (): void {
    renderMainView(noHistory);
  });
}
