<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { competences } from "$lib/resources/competences";
  import { fields, sortFields } from "$lib/resources/fields.svelte";
  import { lessons } from "$lib/resources/lessons";

  interface Props {
    field: string | null;
  }

  let { field = $bindable() }: Props = $props();

  const initialField = field;
</script>

<Button
  icon="cancel"
  onclick={() => {
    field = initialField;
    history.back();
  }}
  yellow
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  onclick={() => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit oblast</h1>
<form>
  {#if fields.current === undefined || $lessons === undefined || $competences === undefined}
    <LoadingIndicator />
  {:else}
    <RadioGroup
      options={sortFields(fields.current, $lessons, $competences)}
      bind:selected={field}
    >
      {#snippet nullOption()}
        <span class="anonymous">Nezařazeno</span>
      {/snippet}
      {#snippet option(_2, currentField)}
        {currentField.name}
      {/snippet}
    </RadioGroup>
  {/if}
</form>

<style>
  .anonymous {
    font-style: italic;
  }
</style>
