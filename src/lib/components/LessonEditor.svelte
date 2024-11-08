<script lang="ts">
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

  interface Props {
    body: string;
    competences: Array<string>;
    field: string | null;
    groups: Array<string>;
    id: string | null;
    name: string;
  }

  let {
    body = $bindable(),
    competences = $bindable(),
    field = $bindable(),
    groups = $bindable(),
    id,
    name = $bindable(),
  }: Props = $props();

  const dispatch = createEventDispatcher<{ discard: null; save: null }>();

  let pageState = $derived($page.state as PageStateFix);
  let view = $derived("view" in pageState ? pageState.view : undefined);

  let imageSelectorOpen = $state(false);
  let discardConfirmation = $state(false);
  let editorPane: { insertAtCursor(content: string): void } | undefined =
    undefined;

  function insertImage(event: CustomEvent<string>): void {
    editorPane?.insertAtCursor(
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
<ImageSelector
  closeImageSelector={() => {
    imageSelectorOpen = false;
  }}
  {imageSelectorOpen}
  on:insert={insertImage}
/>
<EditorPane
  bind:this={editorPane}
  openImageSelector={() => {
    imageSelectorOpen = true;
  }}
  bind:value={body}
/>
<PreviewPane {name} {body} />
