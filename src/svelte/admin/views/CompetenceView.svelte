<script lang="ts">
  import { addCompetence } from "../../../ts/admin/actions/addCompetence";
  import { changeCompetenceOnClick } from "../../../ts/admin/actions/changeCompetence";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import { config } from "../../../ts/admin/stores";
  import { deleteCompetenceOnClick } from "../../../ts/admin/actions/deleteCompetence";
  import { IDList } from "../../../ts/admin/IDList";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";

  export let competences: IDList<Competence>;
  export let loginstate: Loginstate;

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Kompetence"}</h1>
{#if adminPermissions}
  <div id="addCompetence" class="button green-button" on:click={addCompetence}>
    <i class="icon-plus" />
    Přidat
  </div>
  <br />
{/if}
{#each competences.asArray() as { id, value: competence }}
  <h3 class="main-page">
    {competence.number.toString() + ": " + competence.name}
  </h3>
  <br />
  {#if adminPermissions}
    <div
      class="button cyan-button change-competence"
      data-id={id}
      on:click={changeCompetenceOnClick}
    >
      <i class="icon-pencil" />
      Upravit
    </div>
    <div
      class="button red-button delete-competence"
      data-id={id}
      on:click={deleteCompetenceOnClick}
    >
      <i class="icon-trash-empty" />
      Smazat
    </div>
    <br />
  {/if}
  <span class="main-page competence-description">{competence.description}</span>
  <br />
{/each}
