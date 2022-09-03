/// <reference path="../d.ts/admin.d.ts" />

import { ActionQueueSetup } from "./tools/ActionQueue";
import { historySetup } from "./history";
import { metadataSetup } from "./metadata";
import { refreshPreviewSetup } from "./lessonEditor/refreshPreview";

function main(): void {
  refreshPreviewSetup();
  metadataSetup();
  historySetup();
  ActionQueueSetup();
}

window.onload = main;
