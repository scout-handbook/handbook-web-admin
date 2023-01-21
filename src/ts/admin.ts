/// <reference types="svelte" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import App from "../svelte/admin/App.svelte";
import { metadataSetup } from "./admin/metadata";
import { SWRSetup } from "./admin/swr";
import { ActionQueueSetup } from "./admin/tools/ActionQueue";
import { compileMarkdownSetup } from "./admin/tools/compileMarkdown";

function main(): void {
  compileMarkdownSetup();
  metadataSetup();
  SWRSetup();
  ActionQueueSetup();
  new App({
    target: document.getElementsByTagName("body")[0],
  });
}

window.onload = main;
