<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../ts/admin/interfaces/Competence";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { processCompetences } from "../../../ts/admin/metadata";
  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import AddCompetencePanel from "../components/action-modals/AddCompetencePanel.svelte";
  import ChangeCompetencePanel from "../components/action-modals/ChangeCompetencePanel.svelte";
  import DeleteCompetenceDialog from "../components/action-modals/DeleteCompetenceDialog.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );

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
  <!-- TODO: Handle SWR better -->
  {#if $competences !== undefined}
    <ChangeCompetencePanel competences={$competences} payload={actionPayload} />
  {/if}
{:else if action === "delete-competence"}
  <!-- TODO: Handle SWR better -->
  {#if $competences !== undefined}
    <DeleteCompetenceDialog
      competences={$competences}
      payload={actionPayload}
    />
  {/if}
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
{#if $competences === undefined}
  <LoadingIndicator />
{:else}
  {#each $competences as [id, competence]}
    <h3 class="main-page">
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
{/if}

<style>
  .buttons {
    margin-bottom: 10px;
  }
</style>
