<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import AddCompetencePanel from "../components/action-modals/AddCompetencePanel.svelte";
  import Button from "../components/Button.svelte";
  import ChangeCompetencePanel from "../components/action-modals/ChangeCompetencePanel.svelte";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import DeleteCompetenceDialog from "../components/action-modals/DeleteCompetenceDialog.svelte";
  import { IDList } from "../../../ts/admin/IDList";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { siteName } from "../../../ts/admin/stores";

  export let competences: IDList<Competence>;
  export let loginstate: Loginstate;

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state?.action as string;
  $: actionPayload = ($location.state?.actionPayload ?? {}) as Record<
    string,
    string
  >;

  $: adminPermissions =
    loginstate.role === "administrator" || loginstate.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-competence"}
  <AddCompetencePanel />
{:else if action === "change-competence"}
  <ChangeCompetencePanel {competences} payload={actionPayload} />
{:else if action === "delete-competence"}
  <DeleteCompetenceDialog {competences} payload={actionPayload} />
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
          navigate("/competences", {
            state: {
              action: "change-competence",
              actionPayload: { competenceId: id },
            },
          });
        }}
      >
        Upravit
      </Button>
      <Button
        icon="trash-empty"
        red
        on:click={() => {
          navigate("/competences", {
            state: {
              action: "delete-competence",
              actionPayload: { competenceId: id },
            },
          });
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
