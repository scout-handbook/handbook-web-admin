<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";

  interface Props {
    competences: Array<string>;
  }

  let { competences = $bindable() }: Props = $props();

  const initialCompetences = competences;
</script>

<Button
  icon="cancel"
  onclick={() => {
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
  onclick={() => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit body</h1>
<form>
  <CompetenceProvider>
    {#snippet children(allCompetences)}
      <CheckboxGroup options={allCompetences} bind:selected={competences}>
        <!-- eslint-disable-next-line @typescript-eslint/no-shadow -- Not applicable to snippets -->
        {#snippet children(_, competence)}
          <span class="competence-number">
            {competence.number}:
          </span>
          {competence.name}
        {/snippet}
      </CheckboxGroup>
    {/snippet}
  </CompetenceProvider>
</form>

<style>
  .competence-number {
    font-weight: bold;
  }
</style>
