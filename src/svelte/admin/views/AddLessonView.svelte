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
  import LessonEditor from "../components/LessonEditor.svelte";

  const location = useLocation();
  const navigate = useNavigate();
  const fieldID = getQueryField($location.search, "field");
  let name = defaultName;
  let body = defaultBody;

  $: aq = new ActionQueue([
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
  if (fieldID !== null) {
    aq.actions.push(
      new Action($apiUri + "/v1.0/lesson/{id}/field", "PUT", {
        field: encodeURIComponent(fieldID),
      })
    );
  }

  // TODO: Remove this horrible hack
  setTimeout(() => {
    setChanged();
  }, 100);
</script>

<LessonEditor
  id={null}
  saveActionQueue={aq}
  bind:body
  bind:name
  on:discard={() => {
    navigate(-1);
  }}
/>
