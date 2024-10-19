<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { adminUri } from "../../../ts/admin/stores";
  import Button from "./Button.svelte";
  import CompetenceProvider from "./swr-wrappers/CompetenceProvider.svelte";

  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const navigate = useNavigate();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
</script>

<div class:second-level={secondLevel}>
  <h3>{lesson.name}</h3>
  <Button
    cyan
    icon="pencil"
    on:click={() => {
      navigate(`/lessons/${id}/edit`);
    }}
  >
    Upravit
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="trash-empty"
      red
      on:click={() => {
        navigate("/lessons", {
          state: { action: "delete-lesson", actionPayload: { lessonId: id } },
        });
      }}
    >
      Smazat
    </Button>
  {/if}
  <Button
    icon="file-pdf"
    on:click={() => {
      window.open(`${$adminUri}/lesson/${id}`, "_blank", "noopener,noreferrer");
    }}
  >
    PDF
  </Button>
  <br />
  Body:
  <CompetenceProvider silent let:competences>
    {competences
      .filter(([competenceId, _]) => lesson.competences.includes(competenceId))
      .map(([_, competence]) => competence.number)
      .join(", ")}
  </CompetenceProvider>
</div>

<style>
  h3 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 1.9em;
  }

  .second-level {
    margin-left: 40px;
  }
</style>
