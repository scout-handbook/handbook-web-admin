<script lang="ts">
  import type { LockedExceptionResponse } from "$lib/interfaces/APIResponse";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { SvelteMap } from "svelte/reactivity";

  import { Action } from "$lib/actions/Action";
  import { ActionCallback } from "$lib/actions/ActionCallback";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "$lib/actions/populateLessonActionQueue";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import LessonEditor from "$lib/components/LessonEditor.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import { globalUI } from "$lib/globalUI.svelte";
  import { afterRefreshCallback } from "$lib/utils/loginRefresh.svelte";
  import { find } from "$lib/utils/mapUtils";
  import { queryClient } from "$lib/utils/queryClient";
  import { reAuth, request } from "$lib/utils/request";
  import { createMutation } from "@tanstack/svelte-query";
  import { onDestroy, onMount } from "svelte";

  interface Props {
    fields: SvelteMap<string, Field>;
    lessonID: string;
    lessons: SvelteMap<string, Lesson>;
  }

  let { fields, lessonID, lessons }: Props = $props();

  let donePromise: Promise<void> | null = $state(null);
  let name = $state(lessons.get(lessonID)?.name ?? "");
  let body = $state("");
  let competences: Array<string> = $state(
    lessons.get(lessonID)?.competences ?? [],
  );
  let field: string | null = $state(
    find(fields, (item) => item.lessons.includes(lessonID))?.[0] ?? null,
  );
  let groups: Array<string> = $state([]);

  // svelte-ignore state_referenced_locally
  const initialName = $state.snapshot(name);
  let initialBody = "";
  // svelte-ignore state_referenced_locally
  const initialCompetences = $state.snapshot(competences);
  // svelte-ignore state_referenced_locally
  const initialField = $state.snapshot(field);
  let initialGroups: Array<string> = [];

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
        const newLessons = structuredClone(cachedLessons);
        newLessons[lessonID].name = name;
        newLessons[lessonID].competences = competences;
        queryClient.setQueryData<Record<string, Lesson>>(
          ["v1.0", "lesson", { "override-group": true }],
          newLessons,
        );
      }
      if (cachedFields !== undefined) {
        const newFields = structuredClone(cachedFields);
        if (initialField !== null) {
          newFields[initialField].lessons.splice(
            newFields[initialField].lessons.indexOf(lessonID),
            1,
          );
        }
        if (field !== null) {
          newFields[field].lessons.push(lessonID);
        }
        queryClient.setQueryData<Record<string, Field>>(
          ["v1.0", "field", { "override-group": true }],
          newFields,
        );
      }
    },
  });

  const saveExceptionHandler = {
    NotLockedException: (): void => {
      globalUI.dialogMessage =
        "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.";
    },
  };
  const discardExceptionHandler = { NotFoundException: null };

  function sendBeacon(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Older browsers don't include this function
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${CONFIG["api-uri"]}/v1.0/mutex-beacon/${encodeURIComponent(id)}`,
      );
    }
  }

  const lessonDataPromise = Promise.all([
    request(
      `${CONFIG["api-uri"]}/v1.0/mutex/${encodeURIComponent(lessonID)}`,
      "POST",
      {},
      {
        AuthenticationException: reAuth,
        LockedException: (response: LockedExceptionResponse): void => {
          history.back();
          globalUI.dialogMessage = `Nelze upravovat lekci, protože ji právě upravuje ${response.holder}.`;
        },
      },
    ).then(() => {
      window.onbeforeunload = (): void => {
        sendBeacon(lessonID);
      };
    }),
    request<Array<string>>(
      `${CONFIG["api-uri"]}/v1.0/lesson/${encodeURIComponent(lessonID)}/group`,
      "GET",
      {},
      {
        AuthenticationException: reAuth,
      },
    ).then((response) => {
      groups = response;
      initialGroups = groups;
    }),
    request<string>(
      `${CONFIG["api-uri"]}/v1.0/lesson/${encodeURIComponent(lessonID)}`,
      "GET",
      {},
      {
        AuthenticationException: reAuth,
      },
    ).then((response) => {
      body = response;
      initialBody = body;
    }),
  ]);

  function lessonEditMutexExtend(id: string): void {
    void new ActionQueue([
      new Action(
        `${CONFIG["api-uri"]}/v1.0/mutex/${encodeURIComponent(id)}`,
        "PUT",
        undefined,
        undefined,
        { NotFoundException: null },
      ),
    ]).dispatch();
  }

  onDestroy(() => {
    afterRefreshCallback.value = null;
  });
  onMount(() => {
    afterRefreshCallback.value = (): void => {
      lessonEditMutexExtend(lessonID);
    };
  });

  function destroyMutex(): void {
    void new ActionQueue([
      new Action(
        `${CONFIG["api-uri"]}/v1.0/mutex/${encodeURIComponent(lessonID)}`,
        "DELETE",
        undefined,
        [ActionCallback.removeBeacon],
        discardExceptionHandler,
      ),
    ]).dispatch();
  }

  function save(): void {
    const saveActionQueue = new ActionQueue([]);
    if (initialName !== name || initialBody !== body) {
      saveActionQueue.actions.push(
        new Action(
          `${CONFIG["api-uri"]}/v1.0/lesson/${encodeURIComponent(lessonID)}`,
          "PUT",
          {
            body: encodeURIComponent(body),
            name: encodeURIComponent(name),
          },
          [ActionCallback.removeBeacon],
          saveExceptionHandler,
        ),
      );
    } else {
      destroyMutex();
    }
    populateCompetences(
      saveActionQueue,
      lessonID,
      competences,
      initialCompetences,
    );
    populateField(saveActionQueue, lessonID, field, initialField);
    populateGroups(saveActionQueue, lessonID, groups, initialGroups);
    donePromise = saveActionQueue.dispatch().then(() => {
      $mutation.mutate();
    });
  }

  function discard(): void {
    destroyMutex();
    history.back();
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Lekce byla úspěšně upravena.</DoneDialog>
{:else}
  {#await lessonDataPromise}
    <LoadingIndicator />
  {:then}
    <LessonEditor
      id={lessonID}
      ondiscard={discard}
      onsave={save}
      bind:body
      bind:name
      bind:competences
      bind:field
      bind:groups
    />
  {/await}
{/if}
