<script lang="ts">
  import type { Competence } from "$lib/interfaces/Competence";

  import Button from "$lib/components/Button.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { getResourceContext } from "$lib/resources";

  interface Props {
    competences: Array<string>;
  }

  let { competences = $bindable() }: Props = $props();

  const { competences: allCompetences } = getResourceContext();

  const initialCompetences = competences;
</script>

<Button
  icon="cancel"
  onclick={(): void => {
    competences = initialCompetences;
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
<h1>Změnit body</h1>
<form>
  {#if allCompetences.current === undefined}
    <LoadingIndicator />
  {:else}
    <CheckboxGroup options={allCompetences.current} bind:selected={competences}>
      <!-- eslint-disable-next-line @typescript-eslint/no-shadow -- Not applicable to snippets -->
      {#snippet children(_, competence: Competence)}
        <span>
          {competence.number}:
        </span>
        {competence.name}
      {/snippet}
    </CheckboxGroup>
  {/if}
</form>

<style>
  span {
    font-weight: bold;
  }
</style>
