<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import { adminUri } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";

  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

<div class:second-level={secondLevel}>
  <h3>{lesson.name}</h3>
  <Button
    cyan
    icon="pencil"
    on:click={() => {
      void goto("/lessons/" + id + "/edit");
    }}
  >
    Upravit
  </Button>
  {#if adminOrSuperuser}
    <Button
      icon="trash-empty"
      red
      on:click={() => {
        void goto("/lessons", {
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
      window.open($adminUri + "/lesson/" + id, "_blank", "noopener,noreferrer");
    }}
  >
    PDF
  </Button>
  <br />
  Body:
  <CompetenceProvider silent let:competences>
    <!-- eslint-disable @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument @typescript-eslint/no-unsafe-return -->
    {competences
      .filter(([competenceId, _]) => lesson.competences.includes(competenceId))
      .map(([_, competence]) => competence.number)
      .join(", ")}
    <!-- eslint-enable -->
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
