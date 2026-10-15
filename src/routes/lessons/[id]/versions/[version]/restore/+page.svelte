<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { untrack } from "svelte";

  import { Action } from "#lib/actions/Action.js";
  import { ActionCallback } from "#lib/actions/ActionCallback.js";
  import { ActionQueue } from "#lib/actions/ActionQueue.js";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "#lib/actions/populateLessonActionQueue.js";
  import DoneDialog from "#lib/components/DoneDialog.svelte";
  import LessonEditor from "#lib/components/LessonEditor.svelte";
  import LoadingIndicator from "#lib/components/LoadingIndicator.svelte";
  import { apiUri } from "#lib/config.js";
  import { queryClient } from "#lib/utils/queryClient.js";
  import { authFailHandler, request } from "#lib/utils/request.js";

  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);
  let name = $state(page.url.searchParams.get("name") ?? "Obnovená lekce");
  let body = $state("");
  let competences: Array<string> = $state([]);
  let field: string | null = $state(null);
  let groups: Array<string> = $state([]);

  const bodyPromise = untrack(async () =>
    request<string>(
      `${apiUri}/v1.0/deleted-lesson/${data.id}/history/${data.version}`,
      "GET",
      {},
      authFailHandler,
    ),
  ).then((response) => {
    body = response;
  });

  function save(): void {
    const saveActionQueue = new ActionQueue([
      new Action(
        `${apiUri}/v1.0/lesson`,
        "POST",
        {
          body: encodeURIComponent(body),
          name: encodeURIComponent(name),
        },
        [ActionCallback.fillID],
      ),
    ]);
    populateCompetences(saveActionQueue, null, competences);
    populateField(saveActionQueue, null, field);
    populateGroups(saveActionQueue, null, groups);
    donePromise = saveActionQueue.dispatch().then(() => {
      void queryClient.invalidateQueries({
        queryKey: ["v1.0", "lesson"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["v1.0", "field"],
      });
    });
  }
</script>

{#if donePromise !== null}
  <DoneDialog
    {donePromise}
    onconfirm={(): void => {
      void goto(resolve("lessons"));
    }}
  >
    Lekce byla úspěšně obnovena.
  </DoneDialog>
{:else}
  {#await bodyPromise}
    <LoadingIndicator />
  {:then}
    <LessonEditor
      id={null}
      ondiscard={(): void => {
        history.back();
        history.back();
      }}
      onsave={save}
      bind:body
      bind:name
      bind:competences
      bind:field
      bind:groups
    />
  {/await}
{/if}
