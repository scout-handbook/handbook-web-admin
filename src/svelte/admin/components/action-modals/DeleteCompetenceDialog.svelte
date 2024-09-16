<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";

  export let competenceId: string;
  export let competence: Competence;

  const navigate = useNavigate();

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
        `${$apiUri}/v1.0/competence/${encodeURIComponent(competenceId)}`,
        "DELETE",
      ),
    ])
      .dispatch()
      .then(() => {
        competenceMutate(
          SWRMutateFnWrapper((cachedCompetences) => {
            delete cachedCompetences[competenceId];
            return cachedCompetences;
          }),
        );
        lessonMutate(
          SWRMutateFnWrapper((lessons) => {
            for (const lessonId in lessons) {
              if (lessons[lessonId].competences.includes(competenceId)) {
                lessons[lessonId].competences.splice(
                  lessons[lessonId].competences.indexOf(competenceId),
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
      navigate(-1);
    }}
  >
    Opravdu si přejete smazat bod {competence.number}: "{competence.name}"?
  </Dialog>
{/if}
