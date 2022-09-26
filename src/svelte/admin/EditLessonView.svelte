<script lang="ts">
  import { Action } from "../../ts/admin/tools/Action";
  import { ActionCallback } from "../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../ts/admin/tools/ActionQueue";
  import { APIResponse } from "../../ts/admin/interfaces/APIResponse";
  import { config } from "../../ts/admin/stores";
  import { dialog } from "../../ts/admin/UI/dialog";
  import { editor } from "../../ts/admin/lessonEditor/editor";
  import LessonEditor from "./components/LessonEditor.svelte";
  import { LESSONS, metadataEvent } from "../../ts/admin/metadata";
  import { loadingIndicatorVisible } from "../../ts/admin/stores";
  import { Payload } from "../../ts/admin/interfaces/Payload";
  import { reAuthHandler, request } from "../../ts/admin/tools/request";
  import { RequestResponse } from "../../ts/admin/interfaces/RequestResponse";

  export let lessonID: string;

  $: lessonName = LESSONS.get(lessonID)?.name ?? "";
  let lessonBody = "";

  const saveExceptionHandler = {
    NotLockedException: function (): void {
      dialog(
        "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.",
        "OK"
      );
    },
  };
  const discardExceptionHandler = { NotFoundException: null };

  const saveActionQueue = new ActionQueue([
    new Action(
      $config["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(lessonID),
      "PUT",
      saveLessonPayloadBuilder,
      [ActionCallback.RemoveBeacon],
      saveExceptionHandler
    ),
  ]);

  const discardActionQueue = new ActionQueue([
    new Action(
      $config["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(lessonID),
      "DELETE",
      undefined,
      [ActionCallback.RemoveBeacon, ActionCallback.DismissSpinner],
      discardExceptionHandler
    ),
  ]);

  function saveLessonPayloadBuilder(): Payload {
    return {
      name: encodeURIComponent(
        (document.getElementById("name") as HTMLInputElement).value
      ),
      body: encodeURIComponent(editor.value()),
    };
  }

  function lessonEditMutexExtend(id: string): void {
    const exceptionHandler = { NotFoundException: null };
    const actionQueue = new ActionQueue([
      new Action(
        $config["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
        "PUT",
        undefined,
        undefined,
        exceptionHandler
      ),
    ]);
    actionQueue.dispatch(true);
  }

  function sendBeacon(id: string): void {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        $config["api-uri"] + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
      );
    }
  }

  function renderLessonEditView(id: string, markdown: string): void {
    lessonBody = markdown;
    loadingIndicatorVisible.set(false);
    // TODO: Remove this horrible hack
    setTimeout(() => {document.getElementById("save")!.dataset.id = id;}, 100);

    window.onbeforeunload = function (): void {
      sendBeacon(id);
    };
  }

  function getLessonEditView(id: string): void {
    request(
      $config["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(id),
      "GET",
      {},
      function (response: RequestResponse): void {
        metadataEvent.addCallback(function (): void {
          renderLessonEditView(id, response as string);
        });
      },
      reAuthHandler
    );
  }

  loadingIndicatorVisible.set(true);
  const exceptionHandler = reAuthHandler;
  exceptionHandler["LockedException"] = function (response: APIResponse): void {
    dialog(
      "Nelze upravovat lekci, protože ji právě upravuje " +
        response.holder! +
        ".",
      "OK"
    );
  };
  request(
    $config["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(lessonID),
    "POST",
    {},
    function (): void {
      getLessonEditView(lessonID);
    },
    exceptionHandler
  );
</script>

{#if !$loadingIndicatorVisible}
  <LessonEditor {lessonName} body={lessonBody} {saveActionQueue} id={lessonID} {discardActionQueue} refreshAction={() => {lessonEditMutexExtend(lessonID)}} />
{/if}
