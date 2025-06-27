<script lang="ts">
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { goto, pushState } from "$app/navigation";
  import { base } from "$app/paths";
  import Button from "$lib/components/Button.svelte";
  import { adminUri } from "$lib/config";
  import {
    competences,
    sortCompetences,
  } from "$lib/resources/competences.svelte";
  import { filter } from "$lib/utils/mapUtils";
  import { createQuery } from "@tanstack/svelte-query";

  interface Props {
    id: string;
    lesson: Lesson;
    secondLevel?: boolean;
  }

  let { id, lesson, secondLevel = false }: Props = $props();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
</script>

<div class:second-level={secondLevel}>
  <h3>{lesson.name}</h3>
  <Button
    cyan
    icon="pencil"
    onclick={(): void => {
      void goto(`${base}/lessons/${id}/edit`);
    }}
  >
    Upravit
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="trash-empty"
      onclick={(): void => {
        pushState("", {
          action: {
            lessonId: id,
            name: "delete-lesson",
          },
        });
      }}
      red
    >
      Smazat
    </Button>
  {/if}
  <Button
    icon="file-pdf"
    onclick={(): void => {
      window.open(`${adminUri}/lesson/${id}`, "_blank", "noopener,noreferrer");
    }}
  >
    PDF
  </Button>
  <br />
  Body:
  {#if competences.current !== undefined}
    {[
      ...sortCompetences(
        filter(competences.current, (competenceId) =>
          lesson.competences.includes(competenceId),
        ),
      ),
    ]
      .map(([_, competence]) => competence.number)
      .join(", ")}
  {/if}
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
