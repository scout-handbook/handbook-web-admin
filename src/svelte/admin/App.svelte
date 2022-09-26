<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import AddLessonView from "./AddLessonView.svelte";
  import EditLessonView from "./EditLessonView.svelte";
  import LessonView from "./LessonView.svelte";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import { lessons, loginstate } from "../../ts/admin/stores";
  import RestoreLessonView from "./RestoreLessonView.svelte";
  import TopBar from "./components/TopBar.svelte";
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

    <Route path="/">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <!-- TODO -->
          <div id="embedded-spinner" />
        </div>
      </div>
    </Route>
    <Route path="/lessons">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#await Promise.all([$lessons, $loginstate])}
            <div id="embedded-spinner" />
          {:then [_, state] }
            <LessonView loginstate={state} />
          {/await}
        </div>
      </div>
    </Route>
    <Route path="/competences">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <div id="embedded-spinner" />
        </div>
      </div>
    </Route>
    <Route path="/images">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <div id="embedded-spinner" />
        </div>
      </div>
    </Route>
    <Route path="/users">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <div id="embedded-spinner" />
        </div>
      </div>
    </Route>
    <Route path="/groups">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <div id="embedded-spinner" />
        </div>
      </div>
    </Route>
  </Router>
</main>
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"
  rel="stylesheet"
/>
