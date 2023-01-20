<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import type { IDList } from "../../../../ts/admin/IDList";
  import type { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";
  import Dialog from "../Dialog.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";

  export let lessons: IDList<Lesson>;
  export let payload: { lessonId: string };

  const navigate = useNavigate();

  const name = lessons.get(payload.lessonId)!.name;
  let lockedError: string | null = null;
  let expiredError = false;
  const mutexPromise = new Promise<void>((resolve) => {
    const exceptionHandler = reAuthHandler;
    exceptionHandler["LockedException"] = function (
      response: APIResponse
    ): void {
      lockedError = response.holder!;
    };
    request(
      $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
      "POST",
      {},
      function (): void {
        resolve();
      },
      exceptionHandler
    );
  });
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
