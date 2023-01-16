<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../ts/admin/stores";
  import { authFailHandler, request } from "../../../ts/admin/tools/request";
  import { setChanged } from "../../../ts/admin/lessonEditor/editor";
  import { getQueryField } from "../../../ts/admin/tools/getQueryField";
  import LessonEditor from "../components/LessonEditor.svelte";
  import { loadingIndicatorVisible } from "../../../ts/admin/stores";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";

  export let lessonID: string;
  export let version: string;

  const location = useLocation();
  let name = getQueryField($location.search, "name") ?? "Obnovená lekce";
  let body = "";

  const saveActionQueue = new ActionQueue([
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

  loadingIndicatorVisible.set(true);
  request(
    $apiUri + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
    "GET",
    {},
    function (response: RequestResponse): void {
      body = response as string;
      loadingIndicatorVisible.set(false);
      // TODO: Remove this horrible hack
      setTimeout(() => {
        setChanged();
      }, 100);
    },
    authFailHandler
  );
</script>

{#if !$loadingIndicatorVisible}
  <LessonEditor id={null} {saveActionQueue} bind:body bind:lessonName={name} />
{/if}
