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
    refreshLogin(false, refreshAction);
    refreshPreview();
  }
</script>

<div class="wrapper">
  <div class="inner-wrapper">
    <h1>{name}</h1>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  </div>
</div>

<style>
  .inner-wrapper {
    margin: 0 20px 20px;
  }

  .wrapper {
    border-left: 1px solid var(--border-color);
    bottom: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 76px;
    width: 50%;
  }
</style>
