<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { Action } from "../../ts/admin/tools/Action";
  import { ActionCallback } from "../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../ts/admin/tools/ActionQueue";
  import { config } from "../../ts/admin/stores";
  import {
    defaultBody,
    defaultName,
  } from "../../ts/admin/lessonEditor/defaultContent";
  import LessonEditor from "./components/LessonEditor.svelte";
  import { Payload } from "../../ts/admin/interfaces/Payload";
  import { editor, setChanged } from "../../ts/admin/lessonEditor/editor";

  const routerLocation = useLocation();
  const fieldID = new URLSearchParams($routerLocation.search).get("field");

  function addLessonPayloadBuilder(): Payload {
    return {
      name: encodeURIComponent(
        (document.getElementById("name") as HTMLInputElement).value
      ),
      body: encodeURIComponent(editor.value()),
    };
  }

  const aq = new ActionQueue([
    new Action(
      $config["api-uri"] + "/v1.0/lesson",
      "POST",
      addLessonPayloadBuilder,
      [ActionCallback.FillID]
    ),
  ]);
  if (fieldID) {
    aq.actions.push(
      new Action(
        $config["api-uri"] + "/v1.0/lesson/{id}/field",
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

<LessonEditor
  id={null}
  body={defaultBody}
  lessonName={defaultName}
  saveActionQueue={aq}
/>
