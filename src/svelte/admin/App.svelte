<script lang="ts" strictEvents>
  import { Route, Router } from "svelte-navigator";

  import { adminUri } from "../../ts/admin/stores";
  import FieldProvider from "./components/swr-wrappers/FieldProvider.svelte";
  import TopBar from "./components/TopBar.svelte";
  import AddLessonView from "./views/AddLessonView.svelte";
  import CompetenceView from "./views/CompetenceView.svelte";
  import EditLessonView from "./views/EditLessonView.svelte";
  import GroupView from "./views/GroupView.svelte";
  import ImageView from "./views/ImageView.svelte";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";
  import UserView from "./views/UserView.svelte";

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

  <Route path="/competences">
    <TopBar />
    <div class="main-page-container">
      <div class="main-page">
        <CompetenceView />
      </div>
    </div>
  </Route>
  <Route path="/images">
    <TopBar />
    <div class="main-page-container">
      <div class="main-page">
        <ImageView />
      </div>
    </div>
  </Route>
  <Route path="/users">
    <TopBar />
    <div class="main-page-container">
      <div class="main-page">
        <UserView />
      </div>
    </div>
  </Route>
  <Route path="/groups">
    <TopBar />
    <div class="main-page-container">
      <div class="main-page">
        <GroupView />
      </div>
    </div>
  </Route>
</Router>

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
