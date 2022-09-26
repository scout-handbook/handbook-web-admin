<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";

  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
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
  import { lessonSettings } from "../../../ts/admin/lessonEditor/settings";
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

  let editorArea: HTMLElement;

  function saveCallback(): void {
    if (changed) {
      saveActionQueue.defaultDispatch(false);
    } else {
      navigate("/admin/lessons");
      discardActionQueue.defaultDispatch(false);
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

<div id="side-panel" />
<div id="side-panel-overlay" />
<header>
  <div
    id="discard"
    class="button yellow-button"
    on:click={() => {
      editorDiscard(discardActionQueue);
    }}
  >
    <i class="icon-cancel" />
    Zrušit
  </div>
  <form>
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
  <div id="save" class="button green-button" on:click={saveCallback}>
    <i class="icon-floppy" />
    Uložit
  </div>
  <div
    id="lesson-settings"
    class="button"
    on:click={() => {
      lessonSettings(id, saveActionQueue, false);
    }}
  >
    <i class="icon-cog" />
    Nastavení
  </div>
</header>
<div id="image-selector">
  <div id="image-scroller">
    <div
      id="close-image-selector"
      class="button yellow-button"
      on:click={toggleImageSelector}
    >
      <i class="icon-up-open" />
      Zavřít
    </div>
    <!-- TODO: Re-enable uploads in editor without discarding its contents
    <div class="button green-button" on:click={() => {addImage(true);}}>
      <i class="icon-plus" />
      Nahrát
    </div>
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
