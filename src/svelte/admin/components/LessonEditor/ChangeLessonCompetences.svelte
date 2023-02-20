<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
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
    {#each allCompetences as [id, competence]}
      <div class="form-row">
        <label class="form-switch">
          <input type="checkbox" value={id} bind:group={competences} />
          <span class="form-custom form-checkbox" />
        </label>
        <span class="competence-number">
          {competence.number}:
        </span>
        {competence.name}
      </div>
    {/each}
  </CompetenceProvider>
</form>

<style>
  .competence-number {
    font-weight: bold;
  }
</style>
