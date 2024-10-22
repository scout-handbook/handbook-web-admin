<script lang="ts" strictEvents>
  import { createMutation } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { queryClient } from "../../../../ts/admin/utils/queryClient";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let competenceId: string;
  export let competence: Competence;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;

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
      navigate(-1);
    }}
  >
    Opravdu si přejete smazat bod {competence.number}: "{competence.name}"?
  </Dialog>
{/if}
