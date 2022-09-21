/// <reference types="svelte" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import { ActionQueueSetup } from "./admin/tools/ActionQueue";
//import { historySetup } from "./admin/history";
import { metadataSetup } from "./admin/metadata";
import { refreshPreviewSetup } from "./admin/lessonEditor/refreshPreview";
import App from "./admin/App.svelte";

function main(): void {
  refreshPreviewSetup();
  metadataSetup();
  //historySetup();
  ActionQueueSetup();
  new App({
    target: document.body,
  });
}

window.onload = main;
