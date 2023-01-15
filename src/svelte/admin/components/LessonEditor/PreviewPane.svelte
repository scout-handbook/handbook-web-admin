<script lang="ts">
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { refreshPreview } from "../../../../ts/admin/lessonEditor/refreshPreview";
  import { setChanged } from "../../../../ts/admin/lessonEditor/editor";

  export let name: string;
  export let body: string;
  export let refreshAction: (() => void) | null = null;

  $: name && body && onChange();

  refreshPreview(name, body, "preview-inner");

  function onChange(): void {
    setChanged(true);
    refreshPreview(name, body, "preview-inner");
    refreshLogin(false, refreshAction);
  }
</script>

<div id="preview">
  <div id="preview-inner" />
</div>
