<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Action } from "$lib/actions/Action";
  import { ActionCallback } from "$lib/actions/ActionCallback";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "$lib/actions/populateLessonActionQueue";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import LessonEditor from "$lib/components/LessonEditor.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { constructURL } from "$lib/utils/constructURL";
  import { authFailHandler, request } from "$lib/utils/request";

  import type { PageData } from "./$types";

  export let data: PageData;

  let donePromise: Promise<void> | null = null;
  let name = $page.url.searchParams.get("name") ?? "Obnovená lekce";
  let body = "";
  let competences: Array<string> = [];
  let field: string | null = null;
  let groups: Array<string> = [];
  const { revalidate: lessonRevalidate } = useSWR<
    SWRMutateFix<Record<string, Lesson>>
  >(constructURL("v1.0/lesson?override-group=true"));
  const { revalidate: fieldRevalidate } = useSWR<
    SWRMutateFix<Record<string, Field>>
  >(constructURL("v1.0/field?override-group=true"));

  let bodyPromise = request<string>(
    $apiUri + "/v1.0/deleted-lesson/" + data.id + "/history/" + data.version,
    "GET",
    {},
    authFailHandler,
  ).then((response) => {
    body = response;
  });

  function save(): void {
    const saveActionQueue = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/lesson",
        "POST",
        {
          name: encodeURIComponent(name),
          body: encodeURIComponent(body),
        },
        [ActionCallback.fillID],
      ),
    ]);
    populateCompetences(saveActionQueue, null, competences);
    populateField(saveActionQueue, null, field);
    populateGroups(saveActionQueue, null, groups);
    donePromise = saveActionQueue.dispatch().then(() => {
      void lessonRevalidate({ force: true });
      void fieldRevalidate({ force: true });
    });
  }
</script>

{#if donePromise !== null}
  <DoneDialog
    {donePromise}
    on:confirm={() => {
      void goto(base + "/lessons");
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
      bind:body
      bind:name
      bind:competences
      bind:field
      bind:groups
      on:discard={() => {
        history.back();
        history.back();
      }}
      on:save={save}
    />
  {/await}
{/if}
