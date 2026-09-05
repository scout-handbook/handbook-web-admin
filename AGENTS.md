# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Overview

Web administration interface for the Skaut (Scout) handbook. A SvelteKit single-page app (Svelte 5, TypeScript) built as a fully static bundle that is deployed behind PHP. It manages lessons, competences, fields, groups, images and users, talking to an external REST API.

## Commands

- `npm start` — dev server (Vite). Alias for `vite`.
- `npm run build` — production build. Runs `clean` (prebuild), `vite build`, then `scripts/fix-overflow-shorthand.js` (postbuild).
- `npm run lint` — runs all linters in parallel: ESLint, Stylelint (CSS), `svelte-check`, and `tsc --noEmit`.
- `npm run check` — CSS and JS browser-compatibility checks against the build output (`dist/`), so run `build` first.
- Individual linters: `npm run lint:eslint`, `npm run lint:css:stylelint`, `npm run lint:svelte:svelte-check`, `npm run lint:ts:typecheck`.

There is no test suite. Correctness is enforced by the linters, type checker and compatibility checks. Always run `npm run lint` before considering a change complete.

Browser target is `es2021` / `baseline 2020` (browserslist) — the `check:*` scripts enforce this, so avoid newer JS/CSS features.

## Architecture

### Build pipeline (static → PHP)
The app is built with `@sveltejs/adapter-static` into `dist/`, then post-processed by two custom Vite/Rollup plugins in `vite.config.ts`:
- `rollup-plugin-html-to-php.ts` renames every emitted `.html` to `.php` so the host can inject runtime config.
- `rollup-plugin-htaccess` writes an `.htaccess` (see `rollup-plugin-htaccess.config.ts`).

Runtime config is **not** baked in at build time. `src/lib/config.ts` reads it from `document.documentElement.dataset.config` (a JSON blob the PHP host sets): `admin-uri`, `api-uri`, `frontend-uri`, `site-name`. The base path defaults to `/admin` (`VITE_BASEPATH`, in `svelte.config.js`). A strict CSP is configured there too.

### Data layer
- **`@tanstack/svelte-query`** is the data-fetching backbone. `src/lib/utils/queryClient.ts` defines the global `queryClient`; query keys are arrays that get joined into a URL path plus an optional payload object turned into a query string.
- **`src/lib/utils/request.ts`** wraps a raw `XMLHttpRequest` (not fetch, for compat). It normalizes the API's `{status, response, type, message}` envelope and dispatches to per-call `ExceptionHandler` maps keyed by exception type (e.g. `AuthenticationException`) or `"401"`. On auth failure it redirects to the API's `/v1.0/login` endpoint (`reAuth`). User-facing error/dialog strings are in Czech.
- **`src/lib/utils/Resource.svelte.ts`** wraps a query result into a reactive, comparator-sorted `SvelteMap`. The four core resources (competences, fields, groups, lessons) are provided via Svelte context — see `getResourceContext`/`setResourceContext` and the comparators in `src/lib/resources.ts`.

### Mutations: the Action queue
Writes go through an offline-tolerant queue rather than direct calls. `src/lib/actions/`:
- An `Action` is a serializable `{url, method, payload, callbacks, exceptionHandler}`.
- `ActionQueue` dispatches actions sequentially, persisting itself to `localStorage` so it survives a re-login redirect. If an action hits `AuthenticationException`, the user is sent to log in and the queue resumes afterward (`setupActionQueue` / `isRetryAfterLogin`).
- `ActionCallback` handles cross-action effects like `fillID` (feed a created resource's id into later actions) and `removeBeacon`.

### UI structure
- Routes live in `src/routes/` (SvelteKit file-based): `lessons` (with `[id]`, `add`), `competences`, `groups`, `images`, `users`. The app is client-rendered SPA-style.
- Shared UI is in `src/lib/components/`: generic widgets at the top level, `forms/` inputs, `action-modals/` (Add/Edit/Delete panels that enqueue Actions), and `LessonEditor/` (the markdown lesson editor with split editor/preview panes).
- Global UI state (`dialogMessage`, `loadingIndicator`) is a `$state` singleton in `src/lib/globalUI.svelte.ts`.
- Uses Svelte 5 runes (`$state`, `$derived`); `.svelte.ts` files hold runes-using module logic.

### Markdown
Lessons are Markdown. Compilation uses `showdown` with `xss` sanitization (`src/lib/common/xssOptions.ts`) and runs in a Web Worker (`src/lib/markdown-compilation-worker.ts`, `compileMarkdown.ts`, `WorkerPayload.ts`). `easymde` provides the editor.

## Conventions
- ESLint config (`eslint.config.js`) is strict and includes `perfectionist` (enforced import/member sorting — run `lint:eslint` to auto-surface), `prefer-arrow-functions`, and type-aware rules. Prettier + Stylelint are wired through ESLint too.
- Path alias `$lib` → `src/lib` (SvelteKit standard).
