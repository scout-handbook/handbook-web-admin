<script lang="ts" strictEvents>
  import { createMutation } from "@tanstack/svelte-query";
  import { useNavigate } from "svelte-navigator";

  import type { LockedExceptionResponse } from "../../../../ts/admin/interfaces/APIResponse";
  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { queryClient } from "../../../../ts/admin/utils/queryClient";
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
      LockedException: (response: LockedExceptionResponse): void => {
        lockedError = response.holder;
      },
    },
  );
  let donePromise: Promise<void> | null = null;

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "lesson"] });
      await queryClient.cancelQueries({ queryKey: ["v1.0", "field"] });

      const cachedLessons = queryClient.getQueryData<Record<string, Lesson>>([
        "v1.0",
        "lesson",
        { "override-group": true },
      ]);
      const cachedFields = queryClient.getQueryData<Record<string, Field>>([
        "v1.0",
        "field",
        { "override-group": true },
      ]);

      if (cachedLessons !== undefined) {
        const { [lessonId]: _, ...newLessons } = structuredClone(cachedLessons);
        queryClient.setQueryData<Record<string, Lesson>>(
          ["v1.0", "lesson", { "override-group": true }],
          newLessons,
        );
      }
      if (cachedFields !== undefined) {
        const newFields = structuredClone(cachedFields);
        for (const fieldId in newFields) {
          if (newFields[fieldId].lessons.includes(lessonId)) {
            newFields[fieldId].lessons.splice(
              newFields[fieldId].lessons.indexOf(lessonId),
              1,
            );
            break;
          }
        }
        queryClient.setQueryData<Record<string, Field>>(
          ["v1.0", "field", { "override-group": true }],
          newFields,
        );
      }
    },
  });

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
        $mutation.mutate();
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
