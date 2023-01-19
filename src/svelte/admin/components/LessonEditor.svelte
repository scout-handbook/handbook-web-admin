<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useLocation } from "svelte-navigator";

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
  export let refreshAction: (() => void) | null = null;

  const dispatch = createEventDispatcher();
  const location = useLocation();
  $: view = $location.state?.view as string;

  let imageSelectorOpen = false;
  let discardConfirmation = false;
  let donePromise: Promise<void> | null = null;
  let insertAtCursor: (content: string) => void;

  populateEditorCache(id);
  setChanged(false);

  function saveCallback(): void {
    if (changed) {
      donePromise = saveActionQueue.dispatch();
    } else {
      discard();
    }
  }

  function discard(): void {
    dispatch("discard");
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
    on:confirm={discard}
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
  <EditorHeader
    bind:lessonName
    on:discard={() => {
      discardConfirmation = true;
      refreshLogin();
    }}
    on:save={saveCallback}
  />
  <ImageSelector bind:imageSelectorOpen on:insert={insertImage} />
  <EditorPane bind:imageSelectorOpen bind:insertAtCursor bind:value={body} />
  <PreviewPane name={lessonName} {body} {refreshAction} />
{/if}
