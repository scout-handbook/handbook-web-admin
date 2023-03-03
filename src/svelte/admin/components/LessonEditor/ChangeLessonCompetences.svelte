<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import CheckboxGroup from "../forms/CheckboxGroup.svelte";
  import CompetenceProvider from "../swr-wrappers/CompetenceProvider.svelte";

  export let competences: Array<string>;

  const navigate = useNavigate();

  const initialCompetences = competences;

  refreshLogin();
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    competences = initialCompetences;
    navigate(-1);
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    navigate(-1);
  }}>Uložit</Button
>
<h1>Změnit kompetence</h1>
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
