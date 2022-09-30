import { MainPageTab } from "../interfaces/MainPageTab";

export let mainPageTab: MainPageTab = "lessons";

export function setMainPageTab(val: MainPageTab): void {
  mainPageTab = val;
}
