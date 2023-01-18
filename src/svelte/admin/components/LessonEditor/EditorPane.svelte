<script lang="ts">
  import { default as EasyMDE } from "easymde";
  import { onMount } from "svelte";

  import { editor, setEditor } from "../../../../ts/admin/lessonEditor/editor";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";

  export let imageSelectorOpen: boolean;
  export let value: string;
  export const insertAtCursor = (content: string) => {
    const doc = editor.codemirror.getDoc();
    doc.replaceRange(content, doc.getCursor());
    refreshLogin();
  };

  $: editor !== undefined && value !== editor.value() && editor.value(value);

  let editorArea: HTMLElement;

  onMount(() => {
    setEditor(
      new EasyMDE({
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
            action: () => {
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
      })
    );
    editor.codemirror.getDoc().clearHistory();
    editor.codemirror.on("change", () => {
      value = editor.value();
    });
  });
</script>

<div id="editor">
  <textarea bind:this={editorArea} />
</div>
