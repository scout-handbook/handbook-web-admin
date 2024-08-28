<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/utils/constructURL";
  import AddCompetencePanel from "../components/action-modals/AddCompetencePanel.svelte";
  import DeleteCompetenceDialog from "../components/action-modals/DeleteCompetenceDialog.svelte";
  import EditCompetencePanel from "../components/action-modals/EditCompetencePanel.svelte";
  import Button from "../components/Button.svelte";
  import CompetenceProvider from "../components/swr-wrappers/CompetenceProvider.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { competenceId: string };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The typings for svelte-navigator incorrectly don't include undefined for $location.state
  $: actionPayload = $location.state?.actionPayload;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

{#if action === "add-competence"}
  <AddCompetencePanel />
{:else if action === "change-competence"}
  <CompetenceProvider silent let:competences>
    <EditCompetencePanel {competences} payload={actionPayload} />
  </CompetenceProvider>
{:else if action === "delete-competence"}
  <CompetenceProvider silent let:competences>
    <DeleteCompetenceDialog {competences} payload={actionPayload} />
  </CompetenceProvider>
{/if}

<h1>{$siteName + " - Body"}</h1>
{#if adminOrSuperuser}
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
<CompetenceProvider let:competences>
  {#each competences as [id, competence] (id)}
    <h3>
      <!-- eslint-disable-next-line @typescript-eslint/restrict-plus-operands @typescript-eslint/no-unsafe-call -->
      {competence.number.toString() + ": " + competence.name}
    </h3>
    {#if adminOrSuperuser}
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
    <div>{competence.description}</div>
  {/each}
</CompetenceProvider>

<style>
  .buttons {
    margin-bottom: 10px;
  }

  h3 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 1.9em;
  }
</style>
