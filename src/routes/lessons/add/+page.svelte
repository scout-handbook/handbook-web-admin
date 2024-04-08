<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

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
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { constructURL } from "$lib/utils/constructURL";
  import { defaultBody, defaultName } from "$lib/utils/defaultLessonContent";

  let donePromise: Promise<void> | null = null;
  let name = defaultName;
  let body = defaultBody;
  let competences: Array<string> = [];
  let field: string | null = $page.url.searchParams.get("field");
  let groups: Array<string> = [];
  const { revalidate: lessonRevalidate } = useSWR<
    SWRMutateFix<Record<string, Lesson>>
  >(constructURL("v1.0/lesson?override-group=true"));
  const { revalidate: fieldRevalidate } = useSWR<
    SWRMutateFix<Record<string, Field>>
  >(constructURL("v1.0/field?override-group=true"));

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
