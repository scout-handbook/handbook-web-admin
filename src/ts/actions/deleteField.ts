/* exported deleteFieldOnClick */

function deleteFieldOnClick(event: MouseEvent): void {
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
