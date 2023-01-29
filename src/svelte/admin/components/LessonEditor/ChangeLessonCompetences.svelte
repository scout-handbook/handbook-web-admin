<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { processCompetences } from "../../../../ts/admin/metadata";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  const allCompetences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );
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
<h3 class="side-panel-title">Změnit kompetence</h3>
<form id="side-panel-form">
  {#if $allCompetences === undefined}
    <LoadingIndicator />
  {:else}
    {#each $allCompetences as [id, competence]}
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
  {/if}
</form>
