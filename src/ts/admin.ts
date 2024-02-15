/// <reference types="svelte" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../d.ts/CONFIG.d.ts" />

import App from "../svelte/admin/App.svelte";
import { setupActionQueue } from "./admin/actions/ActionQueue";
import { setupSWR } from "./admin/swr";
import { checkLogin } from "./admin/utils/checkLogin";
import { compileMarkdownSetup } from "./admin/utils/compileMarkdown";
import { loginRefreshSetup } from "./admin/utils/loginRefresh";

function main(): void {
  checkLogin();
  setupSWR();
  compileMarkdownSetup();
  loginRefreshSetup();
  setupActionQueue();
  new App({
    target: document.getElementsByTagName("body")[0],
  });
}

window.onload = main;
