<div></div>
<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { Action } from "../../ts/admin/tools/Action";
  import { ActionCallback } from "../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../ts/admin/tools/ActionQueue";
  import { authFailHandler, request } from "../../ts/admin/tools/request";
  import { editor, showLessonEditor, setChanged } from "../../ts/admin/lessonEditor/editor";
  import { Payload } from "../../ts/admin/interfaces/Payload";
  import { RequestResponse } from "../../ts/admin/interfaces/RequestResponse";

  export let lessonID: string;
  export let version: string;

  const location = useLocation();
  const name = (new URLSearchParams($location.search)).get("name");

  function restoreLessonPayloadBuilder(): Payload {
    return {
      name: encodeURIComponent(
        (document.getElementById("name") as HTMLInputElement).value
      ),
      body: encodeURIComponent(editor.value()),
    };
  }

  function renderLessonRestoreView(name: string, body: string): void {
    const aq = new ActionQueue([
      new Action(
        CONFIG["api-uri"] + "/v1.0/lesson",
        "POST",
        restoreLessonPayloadBuilder,
        [ActionCallback.FillID]
      ),
    ]);
    showLessonEditor(name, body, aq, null);
    setChanged();
  }

  request(
    CONFIG["api-uri"] + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
    "GET",
    {},
    function (response: RequestResponse): void {
      const body = response as string;
      renderLessonRestoreView(name ?? "Obnovená lekce", body);
    },
    authFailHandler
  );
</script>
