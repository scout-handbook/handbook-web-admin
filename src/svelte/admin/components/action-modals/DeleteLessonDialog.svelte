<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { APIResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import { dialog } from "../../../../ts/admin/UI/dialog";
  import Dialog from "../Dialog.svelte";
  import { IDList } from "../../../../ts/admin/IDList";
  import { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";

  export let lessons: IDList<Lesson>;
  export let payload: { lessonId: string };

  const navigate = useNavigate();

  const name = lessons.get(payload.lessonId)!.name;
  let lockedError: string | null = null;
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

  function confirmCallback() {
    new ActionQueue([
      new Action(
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(payload.lessonId),
        "DELETE",
        undefined,
        [],
        {
          NotLockedException: function (): void {
            dialog(
              "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.",
              "OK"
            );
          },
        }
      ),
    ]).defaultDispatch();
    navigate(-1);
  }

  function dismissCallback() {
    new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(payload.lessonId),
        "DELETE",
        undefined,
        [],
        { NotFoundException: null }
      ),
    ]).dispatch(true);
    navigate(-1);
  }
</script>

{#await mutexPromise}
  <Overlay />
  <LoadingIndicator darkBackground />
{:then _}
  {#if lockedError !== null}
    <Dialog
      confirmButtonText="OK"
      on:confirm={() => {
        navigate(-1);
      }}
    >
      Nelze smazat lekci, protože ji právě upravuje {lockedError}.
    </Dialog>
  {:else}
    <Dialog
      confirmButtonText="Ano"
      dismissButtonText="Ne"
      on:confirm={confirmCallback}
      on:dismiss={dismissCallback}
    >
      Opravdu si přejete smazat lekci "{name}"?
    </Dialog>
  {/if}
{/await}
