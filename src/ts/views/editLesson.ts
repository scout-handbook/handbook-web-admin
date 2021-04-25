/* exported imageSelectorOpen, showLessonEditView, removeBeacon */

function saveLessonPayloadBuilder(): Payload {
  return {
    name: encodeURIComponent(
      (document.getElementById("name") as HTMLInputElement).value
    ),
    body: encodeURIComponent(editor.value()),
  };
}

function removeBeacon(): void {
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
    // eslint-disable-line compat/compat
    navigator.sendBeacon(
      CONFIG["api-uri"] + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
    ); // eslint-disable-line compat/compat
  }
}

function renderLessonEditView(
  id: string,
  markdown: string,
  noHistory: boolean
): void {
  dismissSpinner();
  const lesson = LESSONS.get(id)!;
  if (!noHistory) {
    history.pushState({ id: id }, "title", "/admin/lessons"); // eslint-disable-line compat/compat
  }

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

function getLessonEditView(id: string, noHistory: boolean): void {
  request(
    CONFIG["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(id),
    "GET",
    {},
    function (response: RequestResponse): void {
      metadataEvent.addCallback(function (): void {
        renderLessonEditView(id, (response as unknown) as string, noHistory);
      });
    },
    reAuthHandler
  );
}

function showLessonEditView(id: string, noHistory: boolean): void {
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
      getLessonEditView(id, noHistory);
    },
    exceptionHandler
  );
}
