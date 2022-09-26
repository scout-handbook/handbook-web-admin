import { navigate } from "svelte-navigator";

import { getAttribute } from "../../UI/button";

export function changeLessonOnClick(event: MouseEvent): boolean {
  navigate("/admin/lessons/" + getAttribute(event, "id") + "/edit");
  return false;
}
