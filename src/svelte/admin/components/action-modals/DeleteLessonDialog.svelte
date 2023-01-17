<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";
  import ConfirmationDialog from "../ConfirmationDialog.svelte";
  import Dialog from "../Dialog.svelte";
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
  let confirmPromise: Promise<void> | null = null;

  function confirmCallback() {
    confirmPromise = new ActionQueue([
      new Action(
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(payload.lessonId),
        "DELETE",
        undefined,
        [],
        {
          NotLockedException: () => {
            expiredError = true;
          },
        }
      ),
    ]).dispatch();
  }

  function dismissCallback() {
    void new ActionQueue(
      [
        new Action(
          $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
          "DELETE",
          undefined,
          [],
          { NotFoundException: null }
        ),
      ],
      true
    ).dispatch();
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
{:else if confirmPromise !== null}
  <ConfirmationDialog {confirmPromise} />
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
