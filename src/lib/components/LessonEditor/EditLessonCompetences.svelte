<script lang="ts" strictEvents>
  import Button from "$lib/components/Button.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";

  export let competences: Array<string>;

  const initialCompetences = competences;
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    competences = initialCompetences;
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
<h1>Změnit body</h1>
<form>
  <CompetenceProvider let:competences={allCompetences}>
    <CheckboxGroup
      options={allCompetences}
      bind:selected={competences}
      let:value={competence}
    >
      <span class="competence-number">
        {competence.number}:
      </span>
      {competence.name}
    </CheckboxGroup>
  </CompetenceProvider>
</form>

<style>
  .competence-number {
    font-weight: bold;
  }
</style>
