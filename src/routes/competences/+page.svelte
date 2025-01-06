<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { pushState } from "$app/navigation";
  import { page } from "$app/state";
  import AddCompetencePanel from "$lib/components/action-modals/AddCompetencePanel.svelte";
  import DeleteCompetenceDialog from "$lib/components/action-modals/DeleteCompetenceDialog.svelte";
  import EditCompetencePanel from "$lib/components/action-modals/EditCompetencePanel.svelte";
  import Button from "$lib/components/Button.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import {
    competences,
    sortCompetences,
  } from "$lib/resources/competences.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
</script>

<TopBar />
<MainPageContainer>
  {#if page.state.action.name === "add-competence"}
    <AddCompetencePanel />
  {:else if page.state.action.name === "change-competence"}
    {@const competence = competences.current?.get(
      page.state.action.competenceId,
    )}
    {#if competence !== undefined}
      <EditCompetencePanel
        {competence}
        competenceId={page.state.action.competenceId}
      />
    {/if}
  {:else if page.state.action.name === "delete-competence"}
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

  <h1>{`${CONFIG["site-name"]} - Body`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        pushState("", { action: { name: "add-competence" } });
      }}
    >
      Přidat
    </Button>
    <br />
  {/if}
  {#if competences.current === undefined}
    <LoadingIndicator />
  {:else}
    {#each sortCompetences(competences.current) as [id, competence] (id)}
      <h3>
        {`${competence.number.toString()}: ${competence.name}`}
      </h3>
      {#if adminOrSuperuser}
        <div class="buttons">
          <Button
            cyan
            icon="pencil"
            onclick={(): void => {
              pushState("", {
                action: {
                  competenceId: id,
                  name: "change-competence",
                },
              });
            }}
          >
            Upravit
          </Button>
          <Button
            icon="trash-empty"
            onclick={(): void => {
              pushState("", {
                action: {
                  competenceId: id,
                  name: "delete-competence",
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
