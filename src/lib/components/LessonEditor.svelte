<script lang="ts" strictEvents>
  import { page } from "$app/stores";
  import Dialog from "$lib/components/Dialog.svelte";
  import EditorHeader from "$lib/components/LessonEditor/EditorHeader.svelte";
  import EditorPane from "$lib/components/LessonEditor/EditorPane.svelte";
  import ImageSelector from "$lib/components/LessonEditor/ImageSelector.svelte";
  import LessonSettingsPanel from "$lib/components/LessonEditor/LessonSettingsPanel.svelte";
  import PreviewPane from "$lib/components/LessonEditor/PreviewPane.svelte";
  import { apiUri, suspendReAuth } from "$lib/stores";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  import type { PageStateFix } from "../../app";

  export let id: string | null;
  export let name: string;
  export let body: string;
  export let competences: Array<string>;
  export let field: string | null;
  export let groups: Array<string>;

  const dispatch = createEventDispatcher<{ discard: null; save: null }>();

  $: state = $page.state as PageStateFix;
  $: view = "view" in state ? state.view : undefined;

  let imageSelectorOpen = false;
  let discardConfirmation = false;
  let insertAtCursor: (content: string) => void;

  function insertImage(event: CustomEvent<string>): void {
    insertAtCursor(
      `![Text po najetí kurzorem](${$apiUri}/v1.0/image/${event.detail})`,
    );
  }

  onDestroy(() => {
    suspendReAuth.set(false);
  });
  onMount(() => {
    suspendReAuth.set(true);
  });
</script>

{#if discardConfirmation}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    on:confirm={() => {
      dispatch("discard");
    }}
    on:dismiss={() => {
      discardConfirmation = false;
    }}
  >
    Opravdu si přejete zahodit všechny změny?
  </Dialog>
{/if}

{#if view === "lesson-settings"}
  <LessonSettingsPanel
    {id}
    bind:name
    bind:body
    bind:competences
    bind:field
    bind:groups
  />
{/if}

<EditorHeader
  bind:name
  on:discard={() => {
    discardConfirmation = true;
  }}
  on:save={() => {
    dispatch("save");
  }}
/>
<ImageSelector bind:imageSelectorOpen on:insert={insertImage} />
<EditorPane bind:imageSelectorOpen bind:insertAtCursor bind:value={body} />
<PreviewPane {name} {body} />
