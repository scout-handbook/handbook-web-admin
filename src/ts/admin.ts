// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import { ActionQueueSetup } from "./admin/tools/ActionQueue";
import { historySetup } from "./admin/history";
import { metadataSetup } from "./admin/metadata";
import { refreshPreviewSetup } from "./admin/lessonEditor/refreshPreview";

function main(): void {
  refreshPreviewSetup();
  metadataSetup();
  historySetup();
  ActionQueueSetup();
}

window.onload = main;
