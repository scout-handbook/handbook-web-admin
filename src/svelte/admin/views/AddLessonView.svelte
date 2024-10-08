<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Field } from "../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { SWRMutateFix } from "../../../ts/admin/SWRMutateFix";

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
  import {
    defaultBody,
    defaultName,
  } from "../../../ts/admin/utils/defaultLessonContent";
  import { getQueryField } from "../../../ts/admin/utils/getQueryField";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";

  const location = useLocation<Record<string, never>>();
  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = defaultName;
  let body = defaultBody;
  let competences: Array<string> = [];
  let field: string | null = getQueryField($location.search, "field");
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
      lessonRevalidate({ force: true });
      fieldRevalidate({ force: true });
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
      navigate(-1);
    }}
    on:save={save}
  />
{/if}
