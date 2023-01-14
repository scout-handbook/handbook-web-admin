import { APIResponse } from "../interfaces/APIResponse";
import { LESSONS } from "../metadata";
import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { refreshLogin } from "../tools/refreshLogin";
import { reAuthHandler, request } from "../tools/request";
import { getAttribute } from "../UI/button";
import { dialog } from "../UI/dialog";
import { spinner } from "../UI/spinner";

function deleteLessonDialog(id: string): void {
  const name = LESSONS.get(id)!.name;

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
      "DELETE",
      undefined,
      [],
      saveExceptionHandler
    ),
  ]);
  const discardActionQueue = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
      "DELETE",
      undefined,
      [],
      discardExceptionHandler
    ),
  ]);
  dialog(
    'Opravdu si přejete smazat lekci "' + name + '"?',
    "Ano",
    () => saveActionQueue.closeDispatch(),
    "Ne",
    function (): void {
      discardActionQueue.dispatch(true);
      history.back();
    }
  );
  history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  refreshLogin();
}

export function deleteLessonOnClick(event: MouseEvent): void {
  const id = getAttribute(event, "id");
  spinner();
  const exceptionHandler = reAuthHandler;
  exceptionHandler["LockedException"] = function (response: APIResponse): void {
    dialog(
      "Nelze smazat lekci, protože ji právě upravuje " + response.holder! + ".",
      "OK"
    );
  };
  request(
    CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id),
    "POST",
    {},
    function (): void {
      deleteLessonDialog(id);
    },
    exceptionHandler
  );
}
