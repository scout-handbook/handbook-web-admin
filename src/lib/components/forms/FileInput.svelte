<script lang="ts">
  import Button from "$lib/components/Button.svelte";

  interface Props {
    files: FileList | undefined;
  }

  let { files = $bindable() }: Props = $props();

  let inputElement: HTMLInputElement | undefined = $state();
</script>

<label>
  <Button
    icon="upload"
    onclick={() => {
      inputElement?.click();
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
