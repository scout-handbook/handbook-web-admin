<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { siteName } from "../../../ts/admin/stores";
  import { get } from "../../../ts/admin/utils/arrayUtils";
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

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
</script>

{#if action === "add-competence"}
  <AddCompetencePanel />
{:else if action === "change-competence"}
  <CompetenceProvider silent let:competences>
    {@const competence = get(competences, actionPayload.competenceId)}
    {#if competence !== undefined}
      <EditCompetencePanel
        {competence}
        competenceId={actionPayload.competenceId}
      />
    {/if}
  </CompetenceProvider>
{:else if action === "delete-competence"}
  <CompetenceProvider silent let:competences>
    {@const competence = get(competences, actionPayload.competenceId)}
    {#if competence !== undefined}
      <DeleteCompetenceDialog
        {competence}
        competenceId={actionPayload.competenceId}
      />
    {/if}
  </CompetenceProvider>
{/if}

<h1>{`${$siteName} - Body`}</h1>
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
      {`${competence.number.toString()}: ${competence.name}`}
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
