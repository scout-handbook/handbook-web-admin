import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { dialog } from "../UI/dialog";
import { FIELDS } from "../metadata";
import { refreshLogin } from "../tools/refreshLogin";

export function deleteFieldOnClick(id: string): void {
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
