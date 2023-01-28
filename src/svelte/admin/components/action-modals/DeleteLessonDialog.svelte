<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import type { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";

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
      ...reAuthHandler,
      LockedException: (response: APIResponse<RequestResponse>): void => {
        lockedError = response.holder!;
      },
    }
  );
  let donePromise: Promise<void> | null = null;

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
        }
      ),
    ]).dispatch();
  }

  function dismissCallback(): void {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
        "DELETE",
        undefined,
        [],
        { NotFoundException: null }
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
  <DoneDialog {donePromise} />
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
