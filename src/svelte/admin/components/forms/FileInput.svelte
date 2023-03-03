<script lang="ts" strictEvents>
  import Button from "../Button.svelte";

  export let files: FileList | undefined;
</script>

<label>
  <input type="file" bind:files />
  <Button icon="upload">
    {#if files === undefined || files.length === 0}
      Vybrat soubor
    {:else}
      {files[0].name}
    {/if}
  </Button>
</label>

<style>
  input {
    height: 0;
    position: absolute;
    width: 0;
  }
</style>
