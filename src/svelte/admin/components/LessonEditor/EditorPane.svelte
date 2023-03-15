<script lang="ts" strictEvents>
  import "../../../../../node_modules/easymde/dist/easymde.min.css";

  import { default as EasyMDE } from "easymde";
  import { onMount } from "svelte";

  export let imageSelectorOpen: boolean;
  export let value: string;
  export const insertAtCursor = (content: string): void => {
    const doc = editor!.codemirror.getDoc();
    doc.replaceRange(content, doc.getCursor());
  };

  let editor: EasyMDE | undefined;
  let editorArea: HTMLElement;

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
          action: (): void => {
            imageSelectorOpen = true;
          },
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
    });
    editor.codemirror.getDoc().clearHistory();
    editor.codemirror.on("change", () => {
      value = editor!.value();
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
