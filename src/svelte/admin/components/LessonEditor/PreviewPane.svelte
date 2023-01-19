<script lang="ts">
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";

  export let name: string;
  export let body: string;
  export let refreshAction: (() => void) | null = null;

  let html = "";

  $: name && body && onChange();

  refreshPreview();

  function refreshPreview() {
    void compileMarkdown(body).then((compiled) => {
      html = compiled;
    });
  }

  function onChange(): void {
    refreshLogin(false, refreshAction);
    refreshPreview();
  }
</script>

<div id="preview">
  <div id="preview-inner">
    <h1>{name}</h1>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  </div>
</div>
