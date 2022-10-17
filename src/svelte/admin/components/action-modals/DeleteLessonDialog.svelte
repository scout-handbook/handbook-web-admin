<script lang="ts">
  import { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import { dialog } from "../../../../ts/admin/UI/dialog";
  import OverlayLoadingIndicator from "../OverlayLoadingIndicator.svelte";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";

  export let payload: { lessonId: string };

  const mutexPromise = new Promise<void>((resolve) => {
    const exceptionHandler = reAuthHandler;
    exceptionHandler["LockedException"] = function (
      response: APIResponse
    ): void {
      // TODO: Svelte-ify
      dialog(
        "Nelze smazat lekci, protože ji právě upravuje " +
          response.holder! +
          ".",
        "OK"
      );
    };
    request(
      $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
      "POST",
      {},
      function (): void {
        resolve();
      },
      exceptionHandler
    );
  });
</script>

{#await mutexPromise}
  <OverlayLoadingIndicator />
{:then _}
  Delete dialog
{/await}
