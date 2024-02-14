<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { onDestroy, onMount } from "svelte";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../ts/admin/actions/Action";
  import { ActionCallback } from "../../../ts/admin/actions/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/actions/ActionQueue";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "../../../ts/admin/actions/populateLessonActionQueue";
  import type { APIResponse } from "../../../ts/admin/interfaces/APIResponse";
  import type { Field } from "../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import {
    afterReAuthAction,
    apiUri,
    globalDialogMessage,
  } from "../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../ts/admin/SWRMutateFix";
  import { get } from "../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../ts/admin/utils/constructURL";
  import { reAuth, request } from "../../../ts/admin/utils/request";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;
  export let fields: Array<[string, Field]>;
  export let lessons: Array<[string, Lesson]>;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = get(lessons, lessonID)?.name ?? "";
  let body = "";
  let competences: Array<string> = get(lessons, lessonID)?.competences ?? [];
  let field: string | null =
    fields.find(([_, field]) => field.lessons.includes(lessonID))?.[0] ?? null;
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
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
        [ActionCallback.RemoveBeacon],
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
          [ActionCallback.RemoveBeacon],
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
      lessonMutate(
        SWRMutateFnWrapper((lessons) => {
          lessons[lessonID].name = name;
          lessons[lessonID].competences = competences;
          return lessons;
        }),
      );
      fieldMutate(
        SWRMutateFnWrapper((fields) => {
          if (initialField !== null) {
            fields[initialField].lessons.splice(
              fields[initialField].lessons.indexOf(lessonID),
              1,
            );
          }
          if (field !== null) {
            fields[field].lessons.push(lessonID);
          }
          return fields;
        }),
      );
    });
  }

  function discard(): void {
    destroyMutex();
    navigate(-1);
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
