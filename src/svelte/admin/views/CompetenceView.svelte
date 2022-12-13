<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

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
  const navigate = useNavigate();
  $: action = $location.state?.action;

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-competence"}
  <AddCompetencePanel />
{/if}

<h1>{$siteName + " - Kompetence"}</h1>
{#if adminPermissions}
  <Button
    green
    icon="plus"
    on:click={() => {
      navigate("/competences", { state: { action: "add-competence" } });
    }}
  >
    Přidat
  </Button>
  <br />
{/if}
{#each competences.asArray() as { id, value: competence }}
  <h3 class="main-page">
    {competence.number.toString() + ": " + competence.name}
  </h3>
  {#if adminPermissions}
    <div class="buttons">
      <Button
        cyan
        icon="pencil"
        on:click={() => {
          changeCompetenceOnClick(id);
        }}
      >
        Upravit
      </Button>
      <Button
        icon="trash-empty"
        red
        on:click={() => {
          deleteCompetenceOnClick(id);
        }}
      >
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
