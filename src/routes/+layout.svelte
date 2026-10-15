<script lang="ts">
  import "#lib/font/fontello.css";
  import "@fontsource/open-sans/400.css";
  import "@fontsource/open-sans/400-italic.css";
  import "@fontsource/open-sans/700.css";
  import "@fontsource/open-sans/700-italic.css";

  import type { Snippet } from "svelte";

  import { asset } from "$app/paths";
  import { createQuery, QueryClientProvider } from "@tanstack/svelte-query";

  import type { Competence } from "#lib/interfaces/Competence.js";
  import type { Field } from "#lib/interfaces/Field.js";
  import type { Group } from "#lib/interfaces/Group.js";
  import type { Lesson } from "#lib/interfaces/Lesson.js";

  import { setupActionQueue } from "#lib/actions/ActionQueue.js";
  import Dialog from "#lib/components/Dialog.svelte";
  import LoadingIndicator from "#lib/components/LoadingIndicator.svelte";
  import Overlay from "#lib/components/Overlay.svelte";
  import { siteName } from "#lib/config.js";
  import { globalUI } from "#lib/globalUI.svelte.js";
  import {
    competenceComparator,
    fieldComparator,
    groupComparator,
    lessonComparator,
    setResourceContext,
  } from "#lib/resources.js";
  import { checkLogin } from "#lib/utils/checkLogin.js";
  import { compileMarkdownSetup } from "#lib/utils/compileMarkdown.js";
  import { loginRefreshSetup } from "#lib/utils/loginRefresh.svelte.js";
  import { queryClient } from "#lib/utils/queryClient.js";
  import { Resource } from "#lib/utils/Resource.svelte.js";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  checkLogin();
  compileMarkdownSetup();
  loginRefreshSetup();
  setupActionQueue();

  const competences = new Resource<Competence>(
    createQuery<Record<string, Competence>>(
      () => ({
        queryKey: ["v1.0", "competence"],
      }),
      () => queryClient,
    ),
    competenceComparator,
  );
  const lessons = new Resource<Lesson>(
    createQuery<Record<string, Lesson>>(
      () => ({
        queryKey: ["v1.0", "lesson", { "override-group": true }],
      }),
      () => queryClient,
    ),
    (a, b) => lessonComparator(a, b, competences),
  );
  setResourceContext({
    competences,
    fields: new Resource<Field>(
      createQuery<Record<string, Field>>(
        () => ({
          queryKey: ["v1.0", "field", { "override-group": true }],
        }),
        () => queryClient,
      ),
      (a, b) => fieldComparator(a, b, competences, lessons),
    ),
    groups: new Resource<Group>(
      createQuery<Record<string, Group>>(
        () => ({
          queryKey: ["v1.0", "group"],
        }),
        () => queryClient,
      ),
      groupComparator,
    ),
    lessons,
  });
</script>

<svelte:head>
  <title>{siteName}</title>
  <link
    href={asset("apple-touch-icon.png")}
    rel="apple-touch-icon"
    sizes="180x180"
  />
  <link
    href={asset("favicon-32x32.png")}
    rel="icon"
    sizes="32x32"
    type="image/png"
  />
  <link
    href={asset("favicon-16x16.png")}
    rel="icon"
    sizes="16x16"
    type="image/png"
  />
  <link href={asset("safari-pinned-tab.svg")} rel="mask-icon" />
  <link href={asset("favicon.ico")} rel="shortcut icon" />
  <meta name="msapplication-config" content={asset("browserconfig.xml")} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  {#if globalUI.loadingIndicator}
    <Overlay />
    <LoadingIndicator darkBackground />
  {/if}
  {#if globalUI.dialogMessage !== null}
    <Dialog
      confirmButtonText="OK"
      onconfirm={(): void => {
        globalUI.dialogMessage = null;
      }}
    >
      {globalUI.dialogMessage}
    </Dialog>
  {/if}
  {@render children()}
</QueryClientProvider>

<style>
  :global(body) {
    color: var(--background);
    font-family: "Open Sans", sans-serif;
    font-feature-settings: "liga" 1; /* stylelint-disable-line plugin/no-unsupported-browser-features */
    font-kerning: normal; /* stylelint-disable-line plugin/no-unsupported-browser-features */
    font-size: 16px;
    height: 100%;
    line-height: 160%;
    margin: 0;
    position: absolute;
    width: 100%;
  }

  :global(h1) {
    line-height: 140%;
  }
</style>
