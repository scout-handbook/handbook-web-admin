<script lang="ts" strictEvents>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { useLocation } from "svelte-navigator";

  import { apiUri, suspendReAuth } from "../../../ts/admin/stores";
  import Dialog from "./Dialog.svelte";
  import EditorHeader from "./LessonEditor/EditorHeader.svelte";
  import EditorPane from "./LessonEditor/EditorPane.svelte";
  import ImageSelector from "./LessonEditor/ImageSelector.svelte";
  import LessonSettingsPanel from "./LessonEditor/LessonSettingsPanel.svelte";
  import PreviewPane from "./LessonEditor/PreviewPane.svelte";

  export let id: string | null;
  export let name: string;
  export let body: string;
  export let competences: Array<string>;
  export let field: string | null;
  export let groups: Array<string>;

  const dispatch = createEventDispatcher<{ discard: never; save: never }>();
  const location = useLocation<{ view: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: view = $location.state?.view;

  let imageSelectorOpen = false;
  let discardConfirmation = false;
  let insertAtCursor: (content: string) => void;

  function insertImage(event: CustomEvent<string>): void {
    insertAtCursor(
      "![Text po najetí kurzorem](" +
        $apiUri +
        "/v1.0/image/" +
        event.detail +
        ")",
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
