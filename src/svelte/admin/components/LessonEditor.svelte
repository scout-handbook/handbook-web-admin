<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import {
    changed,
    populateEditorCache,
    setChanged,
  } from "../../../ts/admin/lessonEditor/editor";
  import { apiUri } from "../../../ts/admin/stores";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import Dialog from "./Dialog.svelte";
  import DoneDialog from "./DoneDialog.svelte";
  import EditorHeader from "./LessonEditor/EditorHeader.svelte";
  import EditorPane from "./LessonEditor/EditorPane.svelte";
  import ImageSelector from "./LessonEditor/ImageSelector.svelte";
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

  let imageSelectorOpen = false;
  let discardConfirmation = false;
  let donePromise: Promise<void> | null = null;
  let insertAtCursor: (content: string) => void;

  populateEditorCache(id);

  function saveCallback(): void {
    if (changed) {
      donePromise = saveActionQueue.dispatch();
    } else {
      discardNow();
    }
  }
  setChanged(false);

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

  function insertImage(event: CustomEvent<{ image: string }>) {
    insertAtCursor(
      "![Text po najetí kurzorem](" +
        $apiUri +
        "/v1.0/image/" +
        event.detail.image +
        ")"
    );
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
  <EditorHeader bind:lessonName on:discard={discard} on:save={saveCallback} />
  <ImageSelector bind:imageSelectorOpen on:insert={insertImage} />
  <EditorPane bind:imageSelectorOpen bind:insertAtCursor bind:value={body} />
  <PreviewPane name={lessonName} {body} {refreshAction} />
{/if}
