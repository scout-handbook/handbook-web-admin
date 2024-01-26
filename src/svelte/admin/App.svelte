<script lang="ts" strictEvents>
  import { Route, Router } from "svelte-navigator";

  import { adminUri } from "../../ts/admin/stores";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";

  // Remove https:// and domain
  const basepath = $adminUri.split("/").slice(3).join("/");
</script>

<Router {basepath} primary={false}>
  <Route path="/lessons/:id/versions/:version/restore" let:params>
    <RestoreLessonView lessonID={params["id"]} version={params["version"]} />
  </Route>
</Router>
