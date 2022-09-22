import { Action } from "../tools/Action";
import { ActionCallback } from "../tools/ActionCallback";
import { ActionQueue } from "../tools/ActionQueue";
import { APIResponse } from "../interfaces/APIResponse";
import { dialog } from "../UI/dialog";
import { dismissSpinner } from "../UI/spinner";
import { editor, showLessonEditor } from "../lessonEditor/editor";
import { LESSONS, metadataEvent } from "../metadata";
import { Payload } from "../interfaces/Payload";
import { reAuthHandler, request } from "../tools/request";
import { RequestResponse } from "../interfaces/RequestResponse";
import { spinner } from "../UI/spinner";

function saveLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

export function removeBeacon(): void {
  window.onbeforeunload = null;
}

function lessonEditMutexExtend(id: string): void {
  const exceptionHandler = { NotFoundException: null };
  const actionQueue = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
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
      CONFIG["api-uri"] + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
    );
  }
}

function renderLessonEditView(id: string, markdown: string): void {
  dismissSpinner();
  const lesson = LESSONS.get(id)!;

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
      CONFIG["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(id),
      "PUT",
      saveLessonPayloadBuilder,
      [ActionCallback.RemoveBeacon],
      saveExceptionHandler
    ),
  ]);
  const discardActionQueue = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
      "DELETE",
      undefined,
      [ActionCallback.RemoveBeacon, ActionCallback.DismissSpinner],
      discardExceptionHandler
    ),
  ]);
  showLessonEditor(
    lesson.name,
    markdown,
    saveActionQueue,
    id,
    discardActionQueue,
    function (): void {
      lessonEditMutexExtend(id);
    }
  );
  document.getElementById("save")!.dataset.id = id;

  window.onbeforeunload = function (): void {
    sendBeacon(id);
  };
}

function getLessonEditView(id: string): void {
  request(
    CONFIG["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(id),
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

export function showLessonEditView(id: string): void {
  spinner();
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
    CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
    "POST",
    {},
    function (): void {
      getLessonEditView(id);
    },
    exceptionHandler
  );
}
