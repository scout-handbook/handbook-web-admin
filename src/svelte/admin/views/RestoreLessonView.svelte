<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { apiUri } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { getQueryField } from "../../../ts/admin/tools/getQueryField";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "../../../ts/admin/tools/populateLessonActionQueue";
  import { authFailHandler, request } from "../../../ts/admin/tools/request";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;
  export let version: string;

  const location = useLocation();
  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = getQueryField($location.search, "name") ?? "Obnovená lekce";
  let body = "";
  let competences: Array<string> = [];
  let field: string | null = null;
  let groups: Array<string> = [];

  let bodyPromise = new Promise<void>((resolve) => {
    request(
      $apiUri + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
      "GET",
      {},
      function (response: RequestResponse): void {
        body = response as string;
        resolve();
      },
      authFailHandler
    );
  });

  function save() {
    const saveActionQueue = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/lesson",
        "POST",
        {
          name: encodeURIComponent(name),
          body: encodeURIComponent(body),
        },
        [ActionCallback.FillID]
      ),
    ]);
    populateCompetences(saveActionQueue, null, competences);
    populateField(saveActionQueue, null, field);
    populateGroups(saveActionQueue, null, groups);
    donePromise = saveActionQueue.dispatch();
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
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
        navigate(-1);
      }}
      on:save={save}
    />
  {/await}
{/if}
