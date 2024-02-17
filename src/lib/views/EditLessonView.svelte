<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { onDestroy, onMount } from "svelte";

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
  import type { APIResponse } from "$lib/interfaces/APIResponse";
  import type { Field } from "$lib/interfaces/Field";
  import type { Lesson } from "$lib/interfaces/Lesson";
  import type { RequestResponse } from "$lib/interfaces/RequestResponse";
  import { afterReAuthAction, apiUri, globalDialogMessage } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";
  import { reAuth, request } from "$lib/utils/request";

  export let lessonID: string;
  export let fields: Array<[string, Field]>;
  export let lessons: Array<[string, Lesson]>;

  let donePromise: Promise<void> | null = null;
  let name = get(lessons, lessonID)?.name ?? "";
  let body = "";
  let competences: Array<string> = get(lessons, lessonID)?.competences ?? [];
  let field: string | null =
    fields.find(([_, item]) => item.lessons.includes(lessonID))?.[0] ?? null;
  let groups: Array<string> = [];

  const initialName = name;
  let initialBody = "";
  const initialCompetences = competences;
  const initialField = field;
  let initialGroups: Array<string> = [];
  const { mutate: lessonMutate } = useSWR<SWRMutateFix<Record<string, Lesson>>>(
    constructURL("v1.0/lesson?override-group=true"),
  );
  const { mutate: fieldMutate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  const saveExceptionHandler = {
    NotLockedException: (): void => {
      globalDialogMessage.set(
        "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.",
      );
    },
  };
  const discardExceptionHandler = { NotFoundException: null };

  function sendBeacon(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Older browsers don't include this function
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        $apiUri + "/v1.0/mutex-beacon/" + encodeURIComponent(id),
      );
    }
  }

  let lessonDataPromise = Promise.all([
    request(
      $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
      "POST",
      {},
      {
        AuthenticationException: reAuth,
        LockedException: (response: APIResponse<RequestResponse>): void => {
          navigate(-1);
          globalDialogMessage.set(
            "Nelze upravovat lekci, protože ji právě upravuje " +
              response.holder! +
              ".",
          );
        },
      },
    ).then(() => {
      window.onbeforeunload = (): void => {
        sendBeacon(lessonID);
      };
    }),
    request<Array<string>>(
      $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID) + "/group",
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
      $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
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
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(id),
        "PUT",
        undefined,
        undefined,
        { NotFoundException: null },
      ),
    ]).dispatch();
  }

  onDestroy(() => {
    afterReAuthAction.set(null);
  });
  onMount(() => {
    afterReAuthAction.set(() => {
      lessonEditMutexExtend(lessonID);
    });
  });

  function destroyMutex(): void {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
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
          $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
          "PUT",
          {
            name: encodeURIComponent(name),
            body: encodeURIComponent(body),
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
      void lessonMutate(
        SWRMutateFnWrapper<Record<string, Lesson>>((cachedLessons) => {
          cachedLessons[lessonID].name = name;
          cachedLessons[lessonID].competences = competences;
          return cachedLessons;
        }),
      );
      void fieldMutate(
        SWRMutateFnWrapper<Record<string, Field>>((cachedFields) => {
          if (initialField !== null) {
            cachedFields[initialField].lessons.splice(
              cachedFields[initialField].lessons.indexOf(lessonID),
              1,
            );
          }
          if (field !== null) {
            cachedFields[field].lessons.push(lessonID);
          }
          return cachedFields;
        }),
      );
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
      bind:body
      bind:name
      bind:competences
      bind:field
      bind:groups
      on:discard={discard}
      on:save={save}
    />
  {/await}
{/if}
