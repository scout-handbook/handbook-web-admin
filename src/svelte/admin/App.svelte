<script lang="ts" strictEvents>
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { Route, Router } from "svelte-navigator";

  import { adminUri } from "../../ts/admin/stores";
  import { queryClient } from "../../ts/admin/utils/queryClient";
  import FieldProvider from "./components/swr-wrappers/FieldProvider.svelte";
  import EditLessonView from "./views/EditLessonView.svelte";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";

  // Remove https:// and domain
  const basepath = $adminUri.split("/").slice(3).join("/");
</script>

<QueryClientProvider client={queryClient}>
  <Router {basepath} primary={false}>
    <Route path="/lessons/:id/edit" let:params>
      <FieldProvider let:fields let:lessons>
        <EditLessonView {fields} lessonID={params["id"]} {lessons} />
      </FieldProvider>
    </Route>
    <Route path="/lessons/:id/versions/:version/restore" let:params>
      <RestoreLessonView lessonID={params["id"]} version={params["version"]} />
    </Route>
  </Router>
</QueryClientProvider>

<style>
  .main-page {
    margin: 0 auto;
    max-width: 770px;
    padding: 20px;
  }

  .main-page-container {
    bottom: 0;
    left: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 81px;
  }
</style>
