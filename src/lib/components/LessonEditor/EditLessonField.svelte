<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";

  interface Props {
    field: string | null;
  }

  let { field = $bindable() }: Props = $props();

  const initialField = field;
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    field = initialField;
    history.back();
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit oblast</h1>
<form>
  <FieldProvider>
    {#snippet children(_, fields)}
      <RadioGroup options={fields} bind:selected={field}>
        {#snippet nullOption()}
          <span class="anonymous">Nezařazeno</span>
        {/snippet}
        {#snippet option(_2, currentField)}
          {currentField.name}
        {/snippet}
      </RadioGroup>
    {/snippet}
  </FieldProvider>
</form>

<style>
  .anonymous {
    font-style: italic;
  }
</style>
