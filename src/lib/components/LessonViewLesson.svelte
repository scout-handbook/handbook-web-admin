<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { createQuery } from "@tanstack/svelte-query";

  import type { Lesson } from "#lib/interfaces/Lesson.js";
  import type { Loginstate } from "#lib/interfaces/Loginstate.js";

  import Button from "#lib/components/Button.svelte";
  import { adminUri } from "#lib/config.js";
  import { getResourceContext } from "#lib/resources.js";
  import { filter } from "#lib/utils/mapUtils.js";

  interface Props {
    id: string;
    lesson: Lesson;
    secondLevel?: boolean;
  }

  let { id, lesson, secondLevel = false }: Props = $props();

  const { competences } = getResourceContext();

  const accountQuery = createQuery<Loginstate>(() => ({
    queryKey: ["v1.0", "account"],
  }));
  let adminOrSuperuser = $derived(
    accountQuery.data?.role === "administrator" ||
      accountQuery.data?.role === "superuser",
  );
</script>

<div class:second-level={secondLevel}>
  <h3>{lesson.name}</h3>
  <Button
    cyan
    icon="pencil"
    onclick={(): void => {
      void goto(resolve(`lessons/${id}/edit`));
    }}
  >
    Upravit
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="trash-empty"
      onclick={(): void => {
        void goto("", {
          shallow: true,
          state: {
            action: {
              lessonId: id,
              name: "delete-lesson",
            },
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
      ...filter(competences.current, (competenceId) =>
        lesson.competences.includes(competenceId),
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
