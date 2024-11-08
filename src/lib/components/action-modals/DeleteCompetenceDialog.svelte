<script lang="ts">
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Lesson } from "$lib/interfaces/Lesson";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    competence: Competence;
    competenceId: string;
  }

  let { competence, competenceId }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "competence"] });
      await queryClient.cancelQueries({ queryKey: ["v1.0", "lesson"] });

      const cachedCompetences = queryClient.getQueryData<
        Record<string, Competence>
      >(["v1.0", "competence"]);
      const cachedLessons = queryClient.getQueryData<Record<string, Lesson>>([
        "v1.0",
        "lesson",
        { "override-group": true },
      ]);

      if (cachedCompetences !== undefined) {
        const { [competenceId]: _, ...newCompetences } =
          structuredClone(cachedCompetences);
        queryClient.setQueryData<Record<string, Competence>>(
          ["v1.0", "competence"],
          newCompetences,
        );
      }

      if (cachedLessons !== undefined) {
        const newLessons = structuredClone(cachedLessons);
        for (const lessonId in newLessons) {
          if (newLessons[lessonId].competences.includes(competenceId)) {
            newLessons[lessonId].competences.splice(
              newLessons[lessonId].competences.indexOf(competenceId),
              1,
            );
          }
        }
        queryClient.setQueryData<Record<string, Lesson>>(
          ["v1.0", "lesson", { "override-group": true }],
          newLessons,
        );
      }
    },
  });

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/competence/${encodeURIComponent(competenceId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        $mutation.mutate();
      });
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Bod byl úspěšně smazán.</DoneDialog>
{:else}
  <Dialog
    confirmButtonText="Ano"
    dismissButtonText="Ne"
    on:confirm={confirmCallback}
    on:dismiss={() => {
      history.back();
    }}
  >
    Opravdu si přejete smazat bod {competence.number}: "{competence.name}"?
  </Dialog>
{/if}
