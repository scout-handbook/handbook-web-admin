<script lang="ts">
  import type { LockedExceptionResponse } from "$lib/interfaces/APIResponse";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";
  import { reAuth, request } from "$lib/utils/request";
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    lesson: Lesson;
    lessonId: string;
  }

  let { lesson, lessonId }: Props = $props();

  let lockedError: string | null = $state(null);
  let expiredError = $state(false);
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
  let donePromise: Promise<void> | null = $state(null);

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
    history.back();
  }
</script>

{#if lockedError !== null}
  <Dialog
    confirmButtonText="OK"
    onconfirm={() => {
      history.back();
    }}
  >
    Nelze smazat lekci, protože ji právě upravuje {lockedError}.
  </Dialog>
{:else if expiredError}
  <Dialog
    confirmButtonText="OK"
    onconfirm={() => {
      history.back();
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
      onconfirm={confirmCallback}
      ondismiss={dismissCallback}
    >
      Opravdu si přejete smazat lekci "{lesson.name}"?
    </Dialog>
  {/await}
{/if}
