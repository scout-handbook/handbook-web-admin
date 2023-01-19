<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { competences as allCompetences } from "../../../../ts/admin/stores";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";

  export let competences: Array<string>;

  const navigate = useNavigate();

  $: competencesArray = $allCompetences?.asArray() ?? [];

  refreshLogin();

  /*
  function saveCallback() {
    if (selectedCompetences !== lessonSettingsCache.competences) {
      setChanged();
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + (id ?? "{id}") + "/competence",
          "PUT",
          {
            competence: selectedCompetences.map(encodeURIComponent),
          }
        )
      );
      lessonSettingsCache.competences = selectedCompetences;
    }
    navigate(-1);
  }
  */
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    // TODO: Fix not returning to previous state
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
<h3 class="side-panel-title">Změnit kompetence</h3>
<form id="side-panel-form">
  {#each competencesArray as { id, value: competence }}
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
</form>
