<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import AddCompetencePanel from "../components/action-modals/AddCompetencePanel.svelte";
  import ChangeCompetencePanel from "../components/action-modals/ChangeCompetencePanel.svelte";
  import DeleteCompetenceDialog from "../components/action-modals/DeleteCompetenceDialog.svelte";
  import Button from "../components/Button.svelte";
  import CompetenceProvider from "../components/swr-wrappers/CompetenceProvider.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { competenceId: string };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";

  refreshLogin(true);
</script>

{#if action === "add-competence"}
  <AddCompetencePanel />
{:else if action === "change-competence"}
  <CompetenceProvider let:competences>
    <ChangeCompetencePanel {competences} payload={actionPayload} />
  </CompetenceProvider>
{:else if action === "delete-competence"}
  <CompetenceProvider let:competences>
    <DeleteCompetenceDialog {competences} payload={actionPayload} />
  </CompetenceProvider>
{/if}

<h1>{$siteName + " - Kompetence"}</h1>
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
  {#each competences as [id, competence]}
    <h3 class="main-page">
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
    <span class="main-page competence-description"
      >{competence.description}</span
    >
    <br />
  {/each}
</CompetenceProvider>

<style>
  .buttons {
    margin-bottom: 10px;
  }
</style>
