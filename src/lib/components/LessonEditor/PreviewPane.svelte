<script lang="ts" strictEvents>
  import { compileMarkdown } from "$lib/utils/compileMarkdown";

  export let name: string;
  export let body: string;

  let html = "";

  function refreshPreview(): void {
    void compileMarkdown(body).then((compiled) => {
      html = compiled;
    });
  }

  function onChange(): void {
    refreshPreview();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Incorrect with svelte reactive statements
  $: name && body && onChange();

  refreshPreview();
</script>

<div class="outer-container">
  <div class="container">
    <h1>{name}</h1>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  </div>
</div>

<style>
  .container {
    margin: 0 20px 20px;
  }

  .outer-container {
    border-left: 1px solid var(--border-color);
    bottom: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 76px;
    width: 50%;
  }

  /* Styles applied to the rendered lesson */
  .container :global(a) {
    color: var(--accent-color);
    text-decoration: none;
  }

  .container :global(a:hover) {
    text-decoration: underline;
  }

  .container :global(img) {
    max-width: 100%;
  }

  .container :global(table) {
    border: 1px solid var(--table-border);
    border-collapse: collapse;
  }

  .container :global(.table-container) {
    overflow-x: auto;
  }

  .container :global(td),
  .container :global(th) {
    border: 1px solid var(--table-border);
    padding: 8px 20px;
  }

  .container :global(th) {
    border-bottom-width: 2px;
  }

  .container :global(tbody tr:nth-child(2n + 1)) {
    background-color: var(--table-odd-row-background);
  }

  .container :global(.notes) {
    display: block;
  }
</style>
