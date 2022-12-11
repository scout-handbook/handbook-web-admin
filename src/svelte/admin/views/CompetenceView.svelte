<script lang="ts">
  import { Link, useLocation } from "svelte-navigator";

  import AddCompetencePanel from "../components/action-modals/AddCompetencePanel.svelte";
  import Button from "../components/Button.svelte";
  import { changeCompetenceOnClick } from "../../../ts/admin/actions/changeCompetence";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import { deleteCompetenceOnClick } from "../../../ts/admin/actions/deleteCompetence";
  import { IDList } from "../../../ts/admin/IDList";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { siteName } from "../../../ts/admin/stores";

  export let competences: IDList<Competence>;
  export let loginstate: Loginstate;

  const location = useLocation();

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if $location.state?.action === "add-competence"}
  <AddCompetencePanel />
{/if}

<h1>{$siteName + " - Kompetence"}</h1>
{#if adminPermissions}
  <Link
    id="addCompetence"
    class="button green-button"
    state={{ action: "add-competence" }}
    to="/competences"
  >
    <i class="icon-plus" />
    Přidat
  </Link>
  <br />
{/if}
{#each competences.asArray() as { id, value: competence }}
  <h3 class="main-page">
    {competence.number.toString() + ": " + competence.name}
  </h3>
  {#if adminPermissions}
    <div class="buttons">
      <Button icon="pencil" cyan on:click={() => {changeCompetenceOnClick(id);}}>
        Upravit
      </Button>
      <Button icon="trash-empty" red on:click={() => {deleteCompetenceOnClick(id);}}>
        Smazat
      </Button>
    </div>
  {/if}
  <span class="main-page competence-description">{competence.description}</span>
  <br />
{/each}

<style>
  .buttons {
    margin-bottom: 10px;
  }
</style>
