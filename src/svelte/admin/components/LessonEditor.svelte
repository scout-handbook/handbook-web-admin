<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import {
    changed,
    populateEditorCache,
    setChanged,
  } from "../../../ts/admin/lessonEditor/editor";
  import {
    prepareImageSelector,
    toggleImageSelector,
  } from "../../../ts/admin/lessonEditor/imageSelector";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import Button from "../components/Button.svelte";
  import Dialog from "./Dialog.svelte";
  import DoneDialog from "./DoneDialog.svelte";
  import EditorHeader from "./LessonEditor/EditorHeader.svelte";
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

  let discardConfirmation = false;
  let donePromise: Promise<void> | null = null;

  function saveCallback(): void {
    if (changed) {
      donePromise = saveActionQueue.dispatch();
    } else {
      discardNow();
    }
  }

  populateEditorCache(id);
  setChanged(false);
  prepareImageSelector();

  function discardNow(): void {
    void discardActionQueue.dispatch();
    navigate(-1);
  }

  function discard(): void {
    // TODO: Broken. Maybe remove altogether.
    if (!changed) {
      discardNow();
    } else {
      discardConfirmation = true;
    }
    refreshLogin();
  }
</script>

{#if view === "lesson-settings"}
  <LessonSettingsPanel lessonId={id} {lessonName} {saveActionQueue} bind:body />
{/if}

{#if discardConfirmation}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    on:confirm={discardNow}
    on:dismiss={() => {
      discardConfirmation = false;
    }}
  >
    Opravdu si přejete zahodit všechny změny?
  </Dialog>
{/if}

{#if donePromise !== null}
  <DoneDialog {donePromise} />
{:else}
  <div id="side-panel" />
  <div id="side-panel-overlay" />
  <EditorHeader bind:lessonName on:discard={discard} on:save={saveCallback} />
  <div id="image-selector">
    <div id="image-scroller">
      <Button icon="up-open" yellow on:click={toggleImageSelector}
        >Zavřít</Button
      >
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
{/if}
