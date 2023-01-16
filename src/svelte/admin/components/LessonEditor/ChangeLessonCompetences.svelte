<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri, competences } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import {
    lessonSettingsCache,
    setChanged,
  } from "../../../../ts/admin/lessonEditor/editor";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";

  export let lessonId: string | null;
  export let saveActionQueue: ActionQueue;

  const navigate = useNavigate();

  let selectedCompetences = lessonSettingsCache.competences;
  $: competencesArray = $competences?.asArray() ?? [];

  refreshLogin();

  function saveCallback() {
    if (selectedCompetences !== lessonSettingsCache.competences) {
      setChanged();
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + (lessonId ?? "{id}") + "/competence",
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
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    navigate(-1);
  }}
>
  Zrušit
</Button>
<Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
<h3 class="side-panel-title">Změnit kompetence</h3>
<form id="side-panel-form">
  {#each competencesArray as { id, value: competence }}
    <div class="form-row">
      <label class="form-switch">
        <input type="checkbox" value={id} bind:group={selectedCompetences} />
        <span class="form-custom form-checkbox" />
      </label>
      <span class="competence-number">
        {competence.number}:
      </span>
      {competence.name}
    </div>
  {/each}
</form>
