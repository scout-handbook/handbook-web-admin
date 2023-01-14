import { FIELDS } from "../metadata";
import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { refreshLogin } from "../tools/refreshLogin";
import { getAttribute } from "../UI/button";
import { dialog } from "../UI/dialog";

export function deleteFieldOnClick(event: MouseEvent): void {
  const id = getAttribute(event, "id");
  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/field/" + encodeURIComponent(id),
      "DELETE"
    ),
  ]);
  dialog(
    'Opravdu si přejete smazat oblast "' + FIELDS.get(id)!.name + '"?',
    "Ano",
    () => aq.closeDispatch(),
    "Ne",
    function (): void {
      history.back();
    }
  );
  history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  refreshLogin();
}
