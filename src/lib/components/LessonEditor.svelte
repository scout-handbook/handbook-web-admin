<script lang="ts">
  import { page } from "$app/state";
  import Dialog from "$lib/components/Dialog.svelte";
  import EditorHeader from "$lib/components/LessonEditor/EditorHeader.svelte";
  import EditorPane from "$lib/components/LessonEditor/EditorPane.svelte";
  import ImageSelector from "$lib/components/LessonEditor/ImageSelector.svelte";
  import LessonSettingsPanel from "$lib/components/LessonEditor/LessonSettingsPanel.svelte";
  import PreviewPane from "$lib/components/LessonEditor/PreviewPane.svelte";
  import { reAuthSuspended } from "$lib/reAuthSuspension.svelte";
  import { onDestroy, onMount } from "svelte";

  import type { PageStateFix } from "../../app";

  interface Props {
    body: string;
    competences: Array<string>;
    field: string | null;
    groups: Array<string>;
    id: string | null;
    name: string;
    ondiscard(this: void): void;
    onsave(this: void): void;
  }

  let {
    body = $bindable(),
    competences = $bindable(),
    field = $bindable(),
    groups = $bindable(),
    id,
    name = $bindable(),
    ondiscard,
    onsave,
  }: Props = $props();

  let pageState = $derived(page.state as PageStateFix);
  let view = $derived("view" in pageState ? pageState.view : undefined);

  let imageSelectorOpen = $state(false);
  let discardConfirmation = $state(false);
  let editorPane: { insertAtCursor(content: string): void } | undefined =
    undefined;

  function insertImage(imageId: string): void {
    editorPane?.insertAtCursor(
      `![Text po najetí kurzorem](${CONFIG["api-uri"]}/v1.0/image/${imageId})`,
    );
  }

  onDestroy(() => {
    reAuthSuspended.value = false;
  });
  onMount(() => {
    reAuthSuspended.value = true;
  });
</script>

{#if discardConfirmation}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    onconfirm={ondiscard}
    ondismiss={(): void => {
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
  ondiscard={(): void => {
    discardConfirmation = true;
  }}
  {onsave}
  bind:name
/>
<ImageSelector
  closeImageSelector={(): void => {
    imageSelectorOpen = false;
  }}
  {imageSelectorOpen}
  oninsert={insertImage}
/>
<EditorPane
  bind:this={editorPane}
  openImageSelector={(): void => {
    imageSelectorOpen = true;
  }}
  bind:value={body}
/>
<PreviewPane {name} {body} />
