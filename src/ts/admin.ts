/// <reference types="svelte" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import App from "../svelte/admin/App.svelte";
import { ActionQueueSetup } from "./admin/actions/ActionQueue";
import { SWRSetup } from "./admin/swr";
import { checkLogin } from "./admin/utils/checkLogin";
import { compileMarkdownSetup } from "./admin/utils/compileMarkdown";
import { loginRefreshSetup } from "./admin/utils/loginRefresh";

function main(): void {
  checkLogin();
  SWRSetup();
  compileMarkdownSetup();
  loginRefreshSetup();
  ActionQueueSetup();
  new App({
    target: document.getElementsByTagName("body")[0],
  });
}

window.onload = main;
