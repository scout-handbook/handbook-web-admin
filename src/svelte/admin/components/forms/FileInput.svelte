<script lang="ts" strictEvents>
  import Button from "../Button.svelte";

  export let files: FileList | undefined;

  let inputElement: HTMLInputElement;
</script>

<label>
  <Button
    icon="upload"
    on:click={() => {
      inputElement.click();
    }}
  >
    {#if files === undefined || files.length === 0}
      Vybrat soubor
    {:else}
      {files[0].name}
    {/if}
  </Button>
  <input bind:this={inputElement} type="file" bind:files />
</label>

<style>
  input {
    height: 0;
    position: absolute;
    width: 0;
  }
</style>
