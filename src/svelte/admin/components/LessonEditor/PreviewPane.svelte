<script lang="ts" strictEvents>
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";

  export let name: string;
  export let body: string;
  export let refreshAction: (() => void) | null = null;

  let html = "";

  $: name && body && onChange();

  refreshPreview();

  function refreshPreview(): void {
    void compileMarkdown(body).then((compiled) => {
      html = compiled;
    });
  }

  function onChange(): void {
    refreshLogin(refreshAction);
    refreshPreview();
  }
</script>

<div class="outer-wrapper">
  <div class="wrapper">
    <h1>{name}</h1>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  </div>
</div>

<style>
  .wrapper {
    margin: 0 20px 20px;
  }

  .outer-wrapper {
    border-left: 1px solid var(--border-color);
    bottom: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 76px;
    width: 50%;
  }

  /* Styles applied to the rendered lesson */
  .wrapper :global(a) {
    color: var(--accent-color);
    text-decoration: none;
  }

  .wrapper :global(a:hover) {
    text-decoration: underline;
  }

  .wrapper :global(img) {
    max-width: 100%;
  }

  .wrapper :global(table) {
    border: 1px solid var(--table-border);
    border-collapse: collapse;
  }

  .wrapper :global(.table-container) {
    overflow-x: auto;
  }

  .wrapper :global(td),
  .wrapper :global(th) {
    border: 1px solid var(--table-border);
    padding: 8px 20px;
  }

  .wrapper :global(th) {
    border-bottom-width: 2px;
  }

  .wrapper :global(tbody tr:nth-child(2n + 1)) {
    background-color: var(--table-odd-row-background);
  }

  .wrapper :global(.notes) {
    display: block;
  }
</style>
