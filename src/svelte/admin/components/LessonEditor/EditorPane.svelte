<script lang="ts" strictEvents>
  import { default as EasyMDE } from "easymde";
  import { onMount } from "svelte";

  import "../../../../../node_modules/easymde/dist/easymde.min.css";

  let editor: EasyMDE | undefined;
  let editorArea: HTMLElement;

  export let imageSelectorOpen: boolean;
  export let value: string;
  export const insertAtCursor = (content: string): void => {
    if (editor === undefined) {
      return;
    }
    const doc = editor.codemirror.getDoc();
    doc.replaceRange(content, doc.getCursor());
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Incorrect with svelte reactive statements
  $: editor !== undefined && value !== editor.value() && editor.value(value);

  onMount(() => {
    editor = new EasyMDE({
      autoDownloadFontAwesome: false,
      autofocus: true,
      element: editorArea,
      indentWithTabs: false,
      initialValue: value,
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
      },
      spellChecker: false,
      status: false,
      tabSize: 4,
      toolbar: [
        {
          action: EasyMDE.toggleBold,
          className: "icon-bold",
          name: "bold",
          title: "Tučné",
        },
        {
          action: EasyMDE.toggleItalic,
          className: "icon-italic",
          name: "italic",
          title: "Kurzíva",
        },
        {
          action: EasyMDE.toggleHeadingSmaller,
          className: "icon-header",
          name: "heading",
          title: "Nadpis",
        },
        "|",
        {
          action: EasyMDE.toggleUnorderedList,
          className: "icon-list-bullet",
          name: "unordered-list",
          title: "Seznam s odrážkami",
        },
        {
          action: EasyMDE.toggleOrderedList,
          className: "icon-list-numbered",
          name: "ordered-list",
          title: "Číslovaný seznam",
        },
        "|",
        {
          action: EasyMDE.drawLink,
          className: "icon-link",
          name: "link",
          title: "Vložit odkaz",
        },
        {
          action: (): void => {
            imageSelectorOpen = true;
          },
          className: "icon-picture",
          name: "image",
          title: "Vložit obrázek",
        },
        {
          action: EasyMDE.drawTable,
          className: "icon-table",
          name: "table",
          title: "Vložit tabulku",
        },
      ],
    });
    editor.codemirror.getDoc().clearHistory();
    editor.codemirror.on("change", () => {
      if (editor !== undefined) {
        value = editor.value();
      }
    });
  });
</script>

<div>
  <textarea bind:this={editorArea} />
</div>

<style>
  :global(.editor-toolbar) {
    border: none;
  }

  :global(.CodeMirror) {
    bottom: 0;
    left: 0;
    padding-top: 0;
    position: absolute;
    right: 0;
    top: 50px;
  }

  div {
    bottom: 0;
    position: absolute;
    top: 76px;
    width: 50%;
  }
</style>
