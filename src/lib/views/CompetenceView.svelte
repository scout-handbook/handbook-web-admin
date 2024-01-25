<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import AddCompetencePanel from "$lib/components/action-modals/AddCompetencePanel.svelte";
  import DeleteCompetenceDialog from "$lib/components/action-modals/DeleteCompetenceDialog.svelte";
  import EditCompetencePanel from "$lib/components/action-modals/EditCompetencePanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import { siteName } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";

  import type { PageStateFix } from "../../app";

  $: state = $page.state as PageStateFix;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

{#if state.action === "add-competence"}
  <AddCompetencePanel />
{:else if state.action === "change-competence"}
  <CompetenceProvider silent let:competences>
    <EditCompetencePanel {competences} payload={state.actionPayload} />
  </CompetenceProvider>
{:else if state.action === "delete-competence"}
  <CompetenceProvider silent let:competences>
    <DeleteCompetenceDialog {competences} payload={state.actionPayload} />
  </CompetenceProvider>
{/if}

<h1>{$siteName + " - Body"}</h1>
{#if adminOrSuperuser}
  <Button
    green
    icon="plus"
    on:click={() => {
      void goto(base + "/competences", { state: { action: "add-competence" } });
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
            void goto(base + "/competences", {
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
            void goto(base + "/competences", {
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
