<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import type { APIResponse } from "$lib/interfaces/APIResponse";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { RequestResponse } from "$lib/interfaces/RequestResponse";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";
  import { reAuth, request } from "$lib/utils/request";

  export let lessons: Array<[string, Lesson]>;
  export let payload: { lessonId: string };

  const navigate = useNavigate();

  const name = get(lessons, payload.lessonId)!.name;
  let lockedError: string | null = null;
  let expiredError = false;
  const mutexPromise = request(
    $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
    "POST",
    {},
    {
      AuthenticationException: reAuth,
      LockedException: (response: APIResponse<RequestResponse>): void => {
        lockedError = response.holder!;
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
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(payload.lessonId),
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
            delete cachedLessons[payload.lessonId];
            return cachedLessons;
          }),
        );
        fieldMutate(
          SWRMutateFnWrapper((fields) => {
            for (const fieldId in fields) {
              if (fields[fieldId].lessons.includes(payload.lessonId)) {
                fields[fieldId].lessons.splice(
                  fields[fieldId].lessons.indexOf(payload.lessonId),
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
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
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
      Opravdu si přejete smazat lekci "{name}"?
    </Dialog>
  {/await}
{/if}
