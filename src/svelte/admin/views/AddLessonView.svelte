<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../ts/admin/stores";
  import {
    defaultBody,
    defaultName,
  } from "../../../ts/admin/lessonEditor/defaultContent";
  import { getQueryField } from "../../../ts/admin/tools/getQueryField";
  import LessonEditor from "../components/LessonEditor.svelte";
  import { Payload } from "../../../ts/admin/interfaces/Payload";
  import { setChanged } from "../../../ts/admin/lessonEditor/editor";

  const location = useLocation();
  const fieldID = getQueryField($location.search, "field");
  let name = defaultName;
  let body = defaultBody;

  const aq = new ActionQueue([
    new Action(
      $apiUri + "/v1.0/lesson",
      "POST",
      () => ({
        name: encodeURIComponent(name),
        body: encodeURIComponent(body),
      }),
      [ActionCallback.FillID]
    ),
  ]);
  if (fieldID !== null) {
    aq.actions.push(
      new Action(
        $apiUri + "/v1.0/lesson/{id}/field",
        "PUT",
        function (): Payload {
          return { field: encodeURIComponent(fieldID) };
        }
      )
    );
  }

  // TODO: Remove this horrible hack
  setTimeout(() => {
    setChanged();
  }, 100);
</script>

<LessonEditor id={null} saveActionQueue={aq} bind:body bind:lessonName={name} />
