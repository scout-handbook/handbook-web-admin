/// <reference types="svelte" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import { ActionQueueSetup } from "./admin/tools/ActionQueue";
import { metadataSetup } from "./admin/metadata";
import { refreshPreviewSetup } from "./admin/lessonEditor/refreshPreview";
import App from "../svelte/admin/App.svelte";

function main(): void {
  refreshPreviewSetup();
  metadataSetup();
  ActionQueueSetup();
  new App({
    target: document.getElementsByTagName("body")[0],
  });
}

window.onload = main;
