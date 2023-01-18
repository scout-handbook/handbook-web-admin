<script lang="ts">
  import {
    prepareImageSelector,
    toggleImageSelector,
  } from "../../../../ts/admin/lessonEditor/imageSelector";
  import Button from "../../components/Button.svelte";

  prepareImageSelector();
</script>

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
