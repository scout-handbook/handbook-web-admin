<script lang="ts">
  import { APIResponse } from "../../../ts/admin/interfaces/APIResponse";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { LESSONS, metadataEvent } from "../../../ts/admin/metadata";
  import { apiUri, globalDialogMessage } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;

  let name = LESSONS.get(lessonID)?.name ?? "";
  let body = "";

  const saveExceptionHandler = {
    NotLockedException: function (): void {
      globalDialogMessage.set(
        "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu."
      );
    },
  };
  const discardExceptionHandler = { NotFoundException: null };

  $: saveActionQueue = new ActionQueue([
    new Action(
      $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
      "PUT",
      {
        name: encodeURIComponent(name),
        body: encodeURIComponent(body),
      },
      [ActionCallback.RemoveBeacon],
      saveExceptionHandler
    ),
  ]);

  const discardActionQueue = new ActionQueue([
    new Action(
      $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
      "DELETE",
      undefined,
      [ActionCallback.RemoveBeacon],
      discardExceptionHandler
    ),
  ]);

  let bodyPromise = Promise.all([
    new Promise<void>((resolve) => {
      request(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
        "POST",
        {},
        () => {
          window.onbeforeunload = function (): void {
            sendBeacon(lessonID);
          };
          resolve();
        },
        {
          ...reAuthHandler,
          LockedException: (response: APIResponse): void => {
            globalDialogMessage.set(
              "Nelze upravovat lekci, protože ji právě upravuje " +
                response.holder! +
                "."
            );
          },
        }
      );
    }),
    new Promise<void>((resolve) => {
      request(
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
        "GET",
        {},
        (response: RequestResponse): void => {
          metadataEvent.addCallback(function (): void {
            body = response as string;
            resolve();
          });
        },
        reAuthHandler
      );
    }),
  ]);

  function lessonEditMutexExtend(id: string): void {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(id),
        "PUT",
        undefined,
        undefined,
        { NotFoundException: null }
      ),
    ]).dispatch();
  }

  function sendBeacon(id: string): void {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        $apiUri + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
      );
    }
  }
</script>

{#await bodyPromise}
  <LoadingIndicator />
{:then}
  <LessonEditor
    id={lessonID}
    {discardActionQueue}
    refreshAction={() => {
      lessonEditMutexExtend(lessonID);
    }}
    {saveActionQueue}
    bind:body
    bind:lessonName={name}
  />
{/await}
