<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import AddLessonView from "./AddLessonView.svelte";
  import EditLessonView from "./EditLessonView.svelte";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import RestoreLessonView from "./RestoreLessonView.svelte";
  import MainView from "./MainView.svelte";
</script>

<div id="overlay" />
<div id="dialog">
  <div id="dialogText" />
  <div id="dismiss-text" class="button yellow-button" />
  <div id="confirm-text" class="button" />
</div>
<LoadingIndicator />
<!-- TODO: Remove legacy spinner -->
<div id="spinner" />
<!-- TODO: Remove main -->
<main>
  <!-- TODO: Extract from config -->
  <Router basepath="/admin">
    <Route component={AddLessonView} path="/lessons/add" />
    <Route path="/lessons/:id/edit" let:params>
      <EditLessonView lessonID={params.id} />
    </Route>
    <Route path="/lessons/:id/versions/:version/restore" let:params>
      <RestoreLessonView lessonID={params.id} version={params.version} />
    </Route>

    <Route component={MainView} path="/" />
    <Route component={MainView} path="/lessons" />
    <Route component={MainView} path="/competences" />
    <Route component={MainView} path="/images" />
    <Route component={MainView} path="/users" />
    <Route component={MainView} path="/groups" />
  </Router>
</main>
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"
  rel="stylesheet"
/>
