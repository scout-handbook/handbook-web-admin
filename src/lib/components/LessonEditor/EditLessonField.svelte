<script lang="ts">
  import type { Field } from "$lib/interfaces/Field";

  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { competences } from "$lib/resources/competences.svelte";
  import { fields, sortFields } from "$lib/resources/fields.svelte";
  import { lessons } from "$lib/resources/lessons.svelte";

  interface Props {
    field: string | null;
  }

  let { field = $bindable() }: Props = $props();

  const initialField = field;
</script>

<Button
  icon="cancel"
  onclick={(): void => {
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
  onclick={(): void => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit oblast</h1>
<form>
  {#if fields.current === undefined || lessons.current === undefined || competences.current === undefined}
    <LoadingIndicator />
  {:else}
    <RadioGroup
      options={sortFields(fields.current, lessons.current, competences.current)}
      bind:selected={field}
    >
      {#snippet nullOption()}
        <span>Nezařazeno</span>
      {/snippet}
      {#snippet option(_2, currentField: Field)}
        {currentField.name}
      {/snippet}
    </RadioGroup>
  {/if}
</form>

<style>
  span {
    font-style: italic;
  }
</style>
