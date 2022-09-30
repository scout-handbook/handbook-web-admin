<script lang="ts">
  import { Router, Route } from "svelte-navigator";

  import AddLessonView from "./AddLessonView.svelte";
  import CompetenceView from "./CompetenceView.svelte";
  import EditLessonView from "./EditLessonView.svelte";
  import ImageView from "./ImageView.svelte";
  import LessonView from "./LessonView.svelte";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import {
    competences,
    fields,
    groups,
    lessons,
    loginstate,
  } from "../../ts/admin/stores";
  import RestoreLessonView from "./RestoreLessonView.svelte";
  import TopBar from "./components/TopBar.svelte";
  import UserView from "./UserView.svelte";
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
          {#await Promise.all([$competences, $fields, $lessons, $loginstate])}
            <div id="embedded-spinner" />
          {:then [competencesValue, fieldsValue, lessonsValue, loginstateValue]}
            <LessonView
              competences={competencesValue}
              fields={fieldsValue}
              lessons={lessonsValue}
              loginstate={loginstateValue}
            />
          {/await}
        </div>
      </div>
    </Route>
    <Route path="/lessons">
      <div id="side-panel" />
      <div id="side-panel-overlay" />
      <TopBar />
      <div id="main-page-container">
        <div id="main-page">
          {#await Promise.all([$competences, $fields, $lessons, $loginstate])}
            <div id="embedded-spinner" />
          {:then [competencesValue, fieldsValue, lessonsValue, loginstateValue]}
            <LessonView
              competences={competencesValue}
              fields={fieldsValue}
              lessons={lessonsValue}
              loginstate={loginstateValue}
            />
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
          {#await Promise.all([$competences, $loginstate])}
            <div id="embedded-spinner" />
          {:then [competencesValue, loginstateValue]}
            <CompetenceView
              competences={competencesValue}
              loginstate={loginstateValue}
            />
          {/await}
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
          {#await Promise.all([$groups, $loginstate])}
            <div id="embedded-spinner" />
          {:then [groupsValue, loginstateValue]}
            <UserView groups={groupsValue} loginstate={loginstateValue} />
          {/await}
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
