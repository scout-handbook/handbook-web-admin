{#if !$loadingIndicatorVisible}
  <LessonEditor {name} {body} {saveActionQueue} id={null} />
{/if}

<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { Action } from "../../ts/admin/tools/Action";
  import { ActionCallback } from "../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../ts/admin/tools/ActionQueue";
  import { authFailHandler, request } from "../../ts/admin/tools/request";
  import { config } from "../../ts/admin/stores";
  import { editor, setChanged } from "../../ts/admin/lessonEditor/editor";
  import LessonEditor from "./components/LessonEditor.svelte";
  import { loadingIndicatorVisible } from "../../ts/admin/stores";
  import { Payload } from "../../ts/admin/interfaces/Payload";
  import { RequestResponse } from "../../ts/admin/interfaces/RequestResponse";

  export let lessonID: string;
  export let version: string;

  const location = useLocation();
  const name = (new URLSearchParams($location.search)).get("name") ?? "Obnovená lekce";
  let body = "";

  const saveActionQueue = new ActionQueue([
    new Action(
      $config["api-uri"] + "/v1.0/lesson",
      "POST",
      restoreLessonPayloadBuilder,
      [ActionCallback.FillID]
    ),
    ]);

  function restoreLessonPayloadBuilder(): Payload {
    return {
      name: encodeURIComponent(
        (document.getElementById("name") as HTMLInputElement).value
      ),
      body: encodeURIComponent(editor.value()),
    };
  }

  loadingIndicatorVisible.set(true);
  request(
    $config["api-uri"] + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
    "GET",
    {},
    function (response: RequestResponse): void {
      body = response as string;
      loadingIndicatorVisible.set(false);
      // TODO: Remove this horrible hack
      setTimeout(() => {setChanged();}, 100);
    },
    authFailHandler
  );
</script>
