<script lang="ts" strictEvents>
  import { Route, Router } from "svelte-navigator";

  import { adminUri } from "../../ts/admin/stores";
  import FieldProvider from "./components/swr-wrappers/FieldProvider.svelte";
  import AddLessonView from "./views/AddLessonView.svelte";
  import EditLessonView from "./views/EditLessonView.svelte";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";

  // Remove https:// and domain
  const basepath = $adminUri.split("/").slice(3).join("/");
</script>

<Router {basepath} primary={false}>
  <Route component={AddLessonView} path="/lessons/add" />
  <Route path="/lessons/:id/edit" let:params>
    <FieldProvider let:fields let:lessons>
      <EditLessonView {fields} lessonID={params["id"]} {lessons} />
    </FieldProvider>
  </Route>
  <Route path="/lessons/:id/versions/:version/restore" let:params>
    <RestoreLessonView lessonID={params["id"]} version={params["version"]} />
  </Route>
</Router>
