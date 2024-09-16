<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import type { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import { reAuth, request } from "../../../../ts/admin/utils/request";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";

  export let lesson: Lesson;
  export let lessonId: string;

  const navigate = useNavigate();

  let lockedError: string | null = null;
  let expiredError = false;
  const mutexPromise = request(
    `${$apiUri}/v1.0/mutex/${encodeURIComponent(lessonId)}`,
    "POST",
    {},
    {
      AuthenticationException: reAuth,
      LockedException: (response: APIResponse<RequestResponse>): void => {
        lockedError = response.holder ?? "jiný uživatel";
      },
    },
  );
  let donePromise: Promise<void> | null = null;
  const { mutate: lessonMutate } = useSWR<SWRMutateFix<Record<string, Lesson>>>(
    constructURL("v1.0/lesson?override-group=true"),
  );
  const { mutate: fieldMutate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  function confirmCallback(): void {
    donePromise = new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/lesson/${encodeURIComponent(lessonId)}`,
        "DELETE",
        undefined,
        [],
        {
          NotLockedException: (): void => {
            expiredError = true;
          },
        },
      ),
    ])
      .dispatch()
      .then(() => {
        lessonMutate(
          SWRMutateFnWrapper((cachedLessons) => {
            delete cachedLessons[lessonId];
            return cachedLessons;
          }),
        );
        fieldMutate(
          SWRMutateFnWrapper((fields) => {
            for (const fieldId in fields) {
              if (fields[fieldId].lessons.includes(lessonId)) {
                fields[fieldId].lessons.splice(
                  fields[fieldId].lessons.indexOf(lessonId),
                  1,
                );
                break;
              }
            }
            return fields;
          }),
        );
      });
  }

  function dismissCallback(): void {
    void new ActionQueue([
      new Action(
        `${$apiUri}/v1.0/mutex/${encodeURIComponent(lessonId)}`,
        "DELETE",
        undefined,
        [],
        { NotFoundException: null },
      ),
    ]).dispatch();
    navigate(-1);
  }
</script>

{#if lockedError !== null}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Nelze smazat lekci, protože ji právě upravuje {lockedError}.
  </Dialog>
{:else if expiredError}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný.
    Zkuste to prosím znovu.
  </Dialog>
{:else if donePromise !== null}
  <DoneDialog {donePromise}>Lekce byla úspěšně smazána.</DoneDialog>
{:else}
  {#await mutexPromise}
    <Overlay />
    <LoadingIndicator darkBackground />
  {:then}
    <Dialog
      confirmButtonText="Ano"
      dismissButtonText="Ne"
      on:confirm={confirmCallback}
      on:dismiss={dismissCallback}
    >
      Opravdu si přejete smazat lekci "{lesson.name}"?
    </Dialog>
  {/await}
{/if}
