<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import type { Competence } from "$lib/interfaces/Competence";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";

  export let competences: Array<[string, Competence]>;
  export let payload: { competenceId: string };

  const competence = get(competences, payload.competenceId)!;
  let donePromise: Promise<void> | null = null;
  const { mutate: competenceMutate } = useSWR<
    SWRMutateFix<Record<string, Competence>>
  >(constructURL("v1.0/competence"));
  const { mutate: lessonMutate } = useSWR<SWRMutateFix<Record<string, Lesson>>>(
    constructURL("v1.0/lesson?override-group=true"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        $apiUri +
          "/v1.0/competence/" +
          encodeURIComponent(payload.competenceId),
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        void competenceMutate(
          SWRMutateFnWrapper<Record<string, Competence>>((cachedCompetences) => {
            delete cachedCompetences[payload.competenceId];
            return cachedCompetences;
          }),
        );
        void lessonMutate(
          SWRMutateFnWrapper<Record<string, Lesson>>((lessons) => {
            for (const lessonId in lessons) {
              if (
                lessons[lessonId].competences.includes(payload.competenceId)
              ) {
                lessons[lessonId].competences.splice(
                  lessons[lessonId].competences.indexOf(payload.competenceId),
                  1,
                );
              }
            }
            return lessons;
          }),
        );
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
