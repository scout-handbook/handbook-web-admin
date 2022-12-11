<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import AddLessonView from "./views/AddLessonView.svelte";
  import CompetenceView from "./views/CompetenceView.svelte";
  import EditLessonView from "./views/EditLessonView.svelte";
  import GroupView from "./views/GroupView.svelte";
  import ImageView from "./views/ImageView.svelte";
  import LessonView from "./views/LessonView.svelte";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import {
    competences,
    fields,
    groups,
    lessons,
    loginstate,
  } from "../../ts/admin/stores";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";
  import TopBar from "./components/TopBar.svelte";
  import UserView from "./views/UserView.svelte";
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
          {#if $fields === null || $competences === null || $lessons === null || $loginstate === null}
            <div id="embedded-spinner" />
          {:else}
            <LessonView
              competences={$competences}
              fields={$fields}
              lessons={$lessons}
              loginstate={$loginstate}
            />
          {/if}
        </div>
      </div>
    </Route>
    <Route path="/lessons">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#if $fields === null || $competences === null || $lessons === null || $loginstate === null}
            <div id="embedded-spinner" />
          {:else}
            <LessonView
              competences={$competences}
              fields={$fields}
              lessons={$lessons}
              loginstate={$loginstate}
            />
          {/if}
        </div>
      </div>
    </Route>
    <Route path="/competences">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#if $competences === null || $loginstate === null}
            <div id="embedded-spinner" />
          {:else}
            <CompetenceView
              competences={$competences}
              loginstate={$loginstate}
            />
          {/if}
        </div>
      </div>
    </Route>
    <Route path="/images">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          <ImageView />
        </div>
      </div>
    </Route>
    <Route path="/users">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#if $groups === null || $loginstate === null}
            <div id="embedded-spinner" />
          {:else}
            <UserView groups={$groups} loginstate={$loginstate} />
          {/if}
        </div>
      </div>
    </Route>
    <Route path="/groups">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#if $groups === null || $loginstate === null}
            <div id="embedded-spinner" />
          {:else}
            <GroupView groups={$groups} loginstate={$loginstate} />
          {/if}
        </div>
      </div>
    </Route>
  </Router>
</main>
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"
  rel="stylesheet"
/>
