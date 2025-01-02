<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { pushState } from "$app/navigation";
  import { page } from "$app/stores";
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

  import type { PageStateFix } from "../../app";

  let state = $derived($page.state as PageStateFix);

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
  {#if state.action === "add-competence"}
    <AddCompetencePanel />
  {:else if state.action === "change-competence"}
    {@const competence = competences.current?.get(
      state.actionPayload.competenceId,
    )}
    {#if competence !== undefined}
      <EditCompetencePanel
        {competence}
        competenceId={state.actionPayload.competenceId}
      />
    {/if}
  {:else if state.action === "delete-competence"}
    {@const competence = competences.current?.get(
      state.actionPayload.competenceId,
    )}
    {#if competence !== undefined}
      <DeleteCompetenceDialog
        {competence}
        competenceId={state.actionPayload.competenceId}
      />
    {/if}
  {/if}

  <h1>{`${CONFIG["site-name"]} - Body`}</h1>
  {#if adminOrSuperuser}
    <Button
      green
      icon="plus"
      onclick={(): void => {
        pushState("", { action: "add-competence" });
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
                action: "change-competence",
                actionPayload: { competenceId: id },
              });
            }}
          >
            Upravit
          </Button>
          <Button
            icon="trash-empty"
            onclick={(): void => {
              pushState("", {
                action: "delete-competence",
                actionPayload: { competenceId: id },
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
