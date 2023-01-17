<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import {
    changed,
    editorDiscard,
    populateEditorCache,
    setChanged,
  } from "../../../ts/admin/lessonEditor/editor";
  import {
    prepareImageSelector,
    toggleImageSelector,
  } from "../../../ts/admin/lessonEditor/imageSelector";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import Button from "../components/Button.svelte";
  import EditorPane from "./LessonEditor/EditorPane.svelte";
  import LessonSettingsPanel from "./LessonEditor/LessonSettingsPanel.svelte";
  import PreviewPane from "./LessonEditor/PreviewPane.svelte";

  export let lessonName: string;
  export let body: string;
  export let saveActionQueue: ActionQueue;
  export let id: string | null;
  export let discardActionQueue: ActionQueue = new ActionQueue();
  export let refreshAction: (() => void) | null = null;

  const location = useLocation();
  const navigate = useNavigate();
  $: view = $location.state?.view as string;
  $: currentUri = $location.pathname + $location.search;

  function saveCallback(): void {
    if (changed) {
      saveActionQueue.defaultDispatch();
    } else {
      navigate("/lessons");
      discardActionQueue.defaultDispatch();
    }
  }

  populateEditorCache(id);
  setChanged(false);
  prepareImageSelector();
</script>

{#if view === "lesson-settings"}
  <LessonSettingsPanel lessonId={id} {lessonName} {saveActionQueue} bind:body />
{/if}

<div id="side-panel" />
<div id="side-panel-overlay" />
<header>
  <div class="buttons-left">
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        discardActionQueue.background = true;
        editorDiscard(discardActionQueue);
      }}
    >
      Zrušit
    </Button>
    <form class="name">
      <input
        id="name"
        class="form-text form-name"
        autocomplete="off"
        type="text"
        bind:value={lessonName}
      />
    </form>
  </div>
  <div class="buttons-right">
    <Button
      icon="cog"
      on:click={() => {
        navigate(currentUri, {
          state: { view: "lesson-settings" },
        });
      }}
    >
      Nastavení
    </Button>
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
  </div>
</header>
<div id="image-selector">
  <div id="image-scroller">
    <Button icon="up-open" yellow on:click={toggleImageSelector}>Zavřít</Button>
    <!-- TODO: Re-enable uploads in editor without discarding its contents
    <Button
      icon="plus"
      green
      on:click={() => {
        addImage(true); // Removed
      }}>
      Nahrát
    </Button>
    -->
    <div id="image-wrapper" />
  </div>
</div>
<EditorPane bind:value={body} />
<PreviewPane name={lessonName} {body} {refreshAction} />

<style>
  .buttons-left,
  .buttons-right {
    bottom: 0;
    height: min-content;
    margin: auto 0;
    position: absolute;
    top: 0;
  }

  .buttons-left {
    left: 15px;
    width: calc(100% - 250px);
  }

  .buttons-right {
    right: 0;
  }

  .name {
    display: inline-block;
    width: calc(100% - 180px);
  }

  .name input {
    width: 100%;
  }
</style>
