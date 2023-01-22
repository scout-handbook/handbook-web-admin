<script lang="ts">
  import { Route, Router } from "svelte-navigator";

  import {
    competences,
    fields,
    globalDialogMessage,
    globalLoadingIndicator,
    groups,
    lessons,
    loginstate,
  } from "../../ts/admin/stores";
  import Dialog from "./components/Dialog.svelte";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import Overlay from "./components/Overlay.svelte";
  import TopBar from "./components/TopBar.svelte";
  import AddLessonView from "./views/AddLessonView.svelte";
  import CompetenceView from "./views/CompetenceView.svelte";
  import EditLessonView from "./views/EditLessonView.svelte";
  import GroupView from "./views/GroupView.svelte";
  import ImageView from "./views/ImageView.svelte";
  import LessonView from "./views/LessonView.svelte";
  import RestoreLessonView from "./views/RestoreLessonView.svelte";
  import UserView from "./views/UserView.svelte";
</script>

{#if $globalLoadingIndicator}
  <Overlay />
  <LoadingIndicator darkBackground />
{/if}
{#if $globalDialogMessage !== null}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      globalDialogMessage.set(null);
    }}
  >
    {$globalDialogMessage}
  </Dialog>
{/if}
<!-- TODO: Remove main -->
<main>
  <!-- TODO: Extract from config -->
  <Router basepath="/admin">
    <Route component={AddLessonView} path="/lessons/add" />
    <Route path="/lessons/:id/edit" let:params>
      {#if $lessons === null}
        <LoadingIndicator />
      {:else}
        <EditLessonView lessonID={params.id} />
      {/if}
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
          {#if $fields === null || $competences === null || $lessons === null}
            <LoadingIndicator />
          {:else}
            <LessonView
              competences={$competences}
              fields={$fields}
              lessons={$lessons}
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
          {#if $fields === null || $competences === null || $lessons === null}
            <LoadingIndicator />
          {:else}
            <LessonView
              competences={$competences}
              fields={$fields}
              lessons={$lessons}
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
            <LoadingIndicator />
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
            <LoadingIndicator />
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
          {#if $groups === null}
            <LoadingIndicator />
          {:else}
            <GroupView groups={$groups} />
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
