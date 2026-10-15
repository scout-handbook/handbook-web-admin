<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { createQuery } from "@tanstack/svelte-query";

  import type { Loginstate } from "#lib/interfaces/Loginstate.js";

  import AddCompetencePanel from "#lib/components/action-modals/AddCompetencePanel.svelte";
  import DeleteCompetenceDialog from "#lib/components/action-modals/DeleteCompetenceDialog.svelte";
  import EditCompetencePanel from "#lib/components/action-modals/EditCompetencePanel.svelte";
  import Button from "#lib/components/Button.svelte";
  import LoadingIndicator from "#lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "#lib/components/MainPageContainer.svelte";
  import TopBar from "#lib/components/TopBar.svelte";
  import { siteName } from "#lib/config.js";
  import { getResourceContext } from "#lib/resources.js";

  const { competences } = getResourceContext();

  const accountQuery = createQuery<Loginstate>(() => ({
    queryKey: ["v1.0", "account"],
  }));
  let adminOrSuperuser = $derived(
    accountQuery.data?.role === "administrator" ||
      accountQuery.data?.role === "superuser",
  );
</script>

<TopBar />
<MainPageContainer>
  {#if page.state.action?.name === "add-competence"}
    <AddCompetencePanel />
  {:else if page.state.action?.name === "change-competence"}
    {@const competence = competences.current?.get(
      page.state.action.competenceId,
    )}
    {#if competence !== undefined}
      <EditCompetencePanel
        {competence}
        competenceId={page.state.action.competenceId}
      />
    {/if}
  {:else if page.state.action?.name === "delete-competence"}
    {@const competence = competences.current?.get(
      page.state.action.competenceId,
    )}
    {#if competence !== undefined}
      <DeleteCompetenceDialog
        {competence}
        competenceId={page.state.action.competenceId}
      />
    {/if}
  {/if}

  <h1>{`${siteName} - Body`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        void goto("", {
          shallow: true,
          state: { action: { name: "add-competence" } },
        });
      }}
    >
      Přidat
    </Button>
    <br />
  {/if}
  {#if competences.current === undefined}
    <LoadingIndicator />
  {:else}
    {#each competences.current as [id, competence] (id)}
      <h3>
        {`${competence.number}: ${competence.name}`}
      </h3>
      {#if adminOrSuperuser}
        <div class="buttons">
          <Button
            cyan
            icon="pencil"
            onclick={(): void => {
              void goto("", {
                shallow: true,
                state: {
                  action: {
                    competenceId: id,
                    name: "change-competence",
                  },
                },
              });
            }}
          >
            Upravit
          </Button>
          <Button
            icon="trash-empty"
            onclick={(): void => {
              void goto("", {
                shallow: true,
                state: {
                  action: {
                    competenceId: id,
                    name: "delete-competence",
                  },
                },
              });
            }}
            red
          >
            Smazat
          </Button>
        </div>
      {/if}
      <div>{competence.description}</div>
    {/each}
  {/if}
</MainPageContainer>

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
