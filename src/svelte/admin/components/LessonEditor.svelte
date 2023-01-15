<script lang="ts">
  import { onMount } from "svelte";
  import { useLocation, useNavigate } from "svelte-navigator";

  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import Button from "../components/Button.svelte";
  import { default as EasyMDE } from "easymde";
  import {
    changed,
    editor,
    editorDiscard,
    editorOnChange,
    populateEditorCache,
    setChanged,
    setEditor,
  } from "../../../ts/admin/lessonEditor/editor";
  import LessonSettingsPanel from "./LessonEditor/LessonSettingsPanel.svelte";
  import {
    prepareImageSelector,
    toggleImageSelector,
  } from "../../../ts/admin/lessonEditor/imageSelector";
  import { refreshPreview } from "../../../ts/admin/lessonEditor/refreshPreview";

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

  let editorArea: HTMLElement;

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
  refreshPreview(lessonName, body, "preview-inner");
  prepareImageSelector();

  onMount(() => {
    setEditor(
      new EasyMDE({
        autoDownloadFontAwesome: false,
        autofocus: true,
        element: editorArea,
        indentWithTabs: false,
        parsingConfig: {
          allowAtxHeaderWithoutSpace: true,
        },
        spellChecker: false,
        status: false,
        tabSize: 4,
        toolbar: [
          {
            name: "bold",
            action: EasyMDE.toggleBold,
            className: "icon-bold",
            title: "Tučné",
          },
          {
            name: "italic",
            action: EasyMDE.toggleItalic,
            className: "icon-italic",
            title: "Kurzíva",
          },
          {
            name: "heading",
            action: EasyMDE.toggleHeadingSmaller,
            className: "icon-header",
            title: "Nadpis",
          },
          "|",
          {
            name: "unordered-list",
            action: EasyMDE.toggleUnorderedList,
            className: "icon-list-bullet",
            title: "Seznam s odrážkami",
          },
          {
            name: "ordered-list",
            action: EasyMDE.toggleOrderedList,
            className: "icon-list-numbered",
            title: "Číslovaný seznam",
          },
          "|",
          {
            name: "link",
            action: EasyMDE.drawLink,
            className: "icon-link",
            title: "Vložit odkaz",
          },
          {
            name: "image",
            action: toggleImageSelector,
            className: "icon-picture",
            title: "Vložit obrázek",
          },
          {
            name: "table",
            action: EasyMDE.drawTable,
            className: "icon-table",
            title: "Vložit tabulku",
          },
        ],
      })
    );
    editor.value(body);
    editor.codemirror.getDoc().clearHistory();
    editor.codemirror.on("change", function (): void {
      editorOnChange(refreshAction);
    });
  });
</script>

{#if view === "lesson-settings"}
  <LessonSettingsPanel lessonId={id} {lessonName} {saveActionQueue} />
{/if}

<div id="side-panel" />
<div id="side-panel-overlay" />
<header>
  <div class="buttons-left">
    <Button
      icon="cancel"
      yellow
      on:click={() => {
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
        value={lessonName}
        on:input={() => {
          editorOnChange(refreshAction);
        }}
        on:change={() => {
          editorOnChange(refreshAction);
        }}
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
<div id="editor">
  <textarea bind:this={editorArea} />
</div>
<div id="preview">
  <div id="preview-inner" />
</div>

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
