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
  import EditorHeader from "./LessonEditor/EditorHeader.svelte";
  import EditorPane from "./LessonEditor/EditorPane.svelte";
  import ImageSelector from "./LessonEditor/ImageSelector.svelte";
  import LessonSettingsPanel from "./LessonEditor/LessonSettingsPanel.svelte";
  import PreviewPane from "./LessonEditor/PreviewPane.svelte";

  export let name: string;
  export let body: string;
  export let saveActionQueue: ActionQueue;
  export let id: string | null;
  export let refreshAction: (() => void) | null = null;

  const dispatch = createEventDispatcher();
  const location = useLocation();
  $: view = $location.state?.view as string;

  let imageSelectorOpen = false;
  let discardConfirmation = false;
  let insertAtCursor: (content: string) => void;

  populateEditorCache(id);
  setChanged(false);

  function saveCallback(): void {
    if (changed) {
      dispatch("save");
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

{#if view === "lesson-settings"}
  <LessonSettingsPanel {id} {name} {saveActionQueue} bind:body />
{/if}

<EditorHeader
  bind:name
  on:discard={() => {
    discardConfirmation = true;
    refreshLogin();
  }}
  on:save={saveCallback}
/>
<ImageSelector bind:imageSelectorOpen on:insert={insertImage} />
<EditorPane bind:imageSelectorOpen bind:insertAtCursor bind:value={body} />
<PreviewPane {name} {body} {refreshAction} />
