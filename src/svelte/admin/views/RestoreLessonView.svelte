<script lang="ts">
  import { useLocation } from "svelte-navigator";

  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { setChanged } from "../../../ts/admin/lessonEditor/editor";
  import { apiUri } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { getQueryField } from "../../../ts/admin/tools/getQueryField";
  import { authFailHandler, request } from "../../../ts/admin/tools/request";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;
  export let version: string;

  const location = useLocation();
  let name = getQueryField($location.search, "name") ?? "Obnovená lekce";
  let body = "";

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

  let bodyPromise = new Promise<void>((resolve) => {
    request(
      $apiUri + "/v1.0/deleted-lesson/" + lessonID + "/history/" + version,
      "GET",
      {},
      function (response: RequestResponse): void {
        body = response as string;
        resolve();
        // TODO: Remove this horrible hack
        setTimeout(() => {
          setChanged();
        }, 100);
      },
      authFailHandler
    );
  });
</script>

{#await bodyPromise}
  <LoadingIndicator />
{:then}
  <LessonEditor id={null} {saveActionQueue} bind:body bind:lessonName={name} />
{/await}
