<script lang="ts" strictEvents>
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
  import { apiUri } from "$lib/stores";
  import { defaultBody, defaultName } from "$lib/utils/defaultLessonContent";
  import { queryClient } from "$lib/utils/queryClient";

  let donePromise: Promise<void> | null = null;
  let name = defaultName;
  let body = defaultBody;
  let competences: Array<string> = [];
  let field: string | null = $page.url.searchParams.get("field");
  let groups: Array<string> = [];

  function save(): void {
    const saveActionQueue = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/lesson`,
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
  <DoneDialog {donePromise}>Lekce byla úspěšně přidána.</DoneDialog>
{:else}
  <LessonEditor
    id={null}
    bind:body
    bind:name
    bind:competences
    bind:field
    bind:groups
    on:discard={() => {
      history.back();
    }}
    on:save={save}
  />
{/if}
