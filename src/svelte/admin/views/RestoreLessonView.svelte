<script lang="ts" strictEvents>
  import { revalidate } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import { Action } from "../../../ts/admin/actions/Action";
  import { ActionCallback } from "../../../ts/admin/actions/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/actions/ActionQueue";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "../../../ts/admin/actions/populateLessonActionQueue";
  import { apiUri } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/utils/constructURL";
  import { getQueryField } from "../../../ts/admin/utils/getQueryField";
  import { authFailHandler, request } from "../../../ts/admin/utils/request";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;
  export let version: string;

  const location = useLocation<Record<string, never>>();
  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = getQueryField($location.search, "name") ?? "Obnovená lekce";
  let body = "";
  let competences: Array<string> = [];
  let field: string | null = null;
  let groups: Array<string> = [];

  let bodyPromise = request<string>(
    $apiUri + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
    "GET",
    {},
    authFailHandler
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
        [ActionCallback.FillID]
      ),
    ]);
    populateCompetences(saveActionQueue, null, competences);
    populateField(saveActionQueue, null, field);
    populateGroups(saveActionQueue, null, groups);
    donePromise = saveActionQueue.dispatch().then(() => {
      revalidate(constructURL("v1.0/lesson?override-group=true"));
    });
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
