// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import { historySetup } from "./admin/history";
import { refreshPreviewSetup } from "./admin/lessonEditor/refreshPreview";
import { metadataSetup } from "./admin/metadata";
import { ActionQueueSetup } from "./admin/tools/ActionQueue";

function main(): void {
  refreshPreviewSetup();
  metadataSetup();
  historySetup();
  ActionQueueSetup();
}

window.onload = main;
