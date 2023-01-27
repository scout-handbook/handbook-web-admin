<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { APIResponse } from "../../../ts/admin/interfaces/APIResponse";
  import type { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { FIELDS, LESSONS, metadataEvent } from "../../../ts/admin/metadata";
  import { apiUri, globalDialogMessage } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../ts/admin/tools/arrayTools";
  import {
    populateCompetences,
    populateField,
    populateGroups,
  } from "../../../ts/admin/tools/populateLessonActionQueue";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = get(LESSONS, lessonID)?.name ?? "";
  let body = "";
  let competences: Array<string> = get(LESSONS, lessonID)?.competences ?? [];
  let field: string | null =
    FIELDS.find(([_, field]) => {
      return field.lessons.includes(lessonID);
    })?.[0] ?? null;
  let groups: Array<string> = [];

  const initialName = name;
  let initialBody = "";
  const initialCompetences = competences;
  const initialField = field;
  let initialGroups: Array<string> = [];

  const saveExceptionHandler = {
    NotLockedException: function (): void {
      globalDialogMessage.set(
        "Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu."
      );
    },
  };
  const discardExceptionHandler = { NotFoundException: null };

  let lessonDataPromise = Promise.all([
    new Promise<void>((resolve) => {
      request(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
        "POST",
        {},
        () => {
          window.onbeforeunload = function (): void {
            sendBeacon(lessonID);
          };
          resolve();
        },
        {
          ...reAuthHandler,
          LockedException: (response: APIResponse): void => {
            globalDialogMessage.set(
              "Nelze upravovat lekci, protože ji právě upravuje " +
                response.holder! +
                "."
            );
          },
        }
      );
    }),
    new Promise<void>((resolve) => {
      request(
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID) + "/group",
        "GET",
        {},
        (response: RequestResponse) => {
          groups = response as Array<string>;
          initialGroups = groups;
          resolve();
        },
        reAuthHandler
      );
    }),
    new Promise<void>((resolve) => {
      request(
        $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
        "GET",
        {},
        (response: RequestResponse): void => {
          metadataEvent.addCallback(function (): void {
            body = response as string;
            initialBody = body;
            resolve();
          });
        },
        reAuthHandler
      );
    }),
  ]);

  function lessonEditMutexExtend(id: string): void {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(id),
        "PUT",
        undefined,
        undefined,
        { NotFoundException: null }
      ),
    ]).dispatch();
  }

  function sendBeacon(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        $apiUri + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
      );
    }
  }

  function destroyMutex(): void {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
        "DELETE",
        undefined,
        [ActionCallback.RemoveBeacon],
        discardExceptionHandler
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
          saveExceptionHandler
        )
      );
    } else {
      destroyMutex();
    }
    populateCompetences(
      saveActionQueue,
      lessonID,
      competences,
      initialCompetences
    );
    populateField(saveActionQueue, lessonID, field, initialField);
    populateGroups(saveActionQueue, lessonID, groups, initialGroups);
    donePromise = saveActionQueue.dispatch();
  }

  function discard(): void {
    destroyMutex();
    navigate(-1);
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
{:else}
  {#await lessonDataPromise}
    <LoadingIndicator />
  {:then}
    <LessonEditor
      id={lessonID}
      refreshAction={() => {
        lessonEditMutexExtend(lessonID);
      }}
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
