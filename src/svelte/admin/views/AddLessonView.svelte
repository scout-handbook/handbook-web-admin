<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import {
    defaultBody,
    defaultName,
  } from "../../../ts/admin/lessonEditor/defaultContent";
  import { setChanged } from "../../../ts/admin/lessonEditor/editor";
  import { apiUri } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { getQueryField } from "../../../ts/admin/tools/getQueryField";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";

  const location = useLocation();
  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = defaultName;
  let body = defaultBody;
  let field: string | null = getQueryField($location.search, "field");

  $: saveActionQueue = new ActionQueue([
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

  // TODO: Remove this horrible hack
  setTimeout(() => {
    setChanged();
  }, 100);

  function save() {
    if (field !== null) {
      saveActionQueue.actions.push(
        new Action($apiUri + "/v1.0/lesson/{id}/field", "PUT", {
          field: encodeURIComponent(field),
        })
      );
    }
    donePromise = saveActionQueue.dispatch();
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
{:else}
  <LessonEditor
    id={null}
    {saveActionQueue}
    bind:body
    bind:name
    bind:field
    on:discard={() => {
      navigate(-1);
    }}
    on:save={save}
  />
{/if}
