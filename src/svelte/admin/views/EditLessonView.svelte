<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { APIResponse } from "../../../ts/admin/interfaces/APIResponse";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { FIELDS, LESSONS, metadataEvent } from "../../../ts/admin/metadata";
  import { apiUri, globalDialogMessage } from "../../../ts/admin/stores";
  import { Action } from "../../../ts/admin/tools/Action";
  import { ActionCallback } from "../../../ts/admin/tools/ActionCallback";
  import { ActionQueue } from "../../../ts/admin/tools/ActionQueue";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import DoneDialog from "../components/DoneDialog.svelte";
  import LessonEditor from "../components/LessonEditor.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";

  export let lessonID: string;

  const navigate = useNavigate();

  let donePromise: Promise<void> | null = null;
  let name = LESSONS.get(lessonID)?.name ?? "";
  let body = "";
  let competences: Array<string> = LESSONS.get(lessonID)?.competences ?? [];
  let field: string | null =
    FIELDS.asArray().find((field) => {
      return field.value.lessons.indexOf(lessonID) >= 0;
    })?.id ?? null;
  let groups: Array<string> = [];

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

  $: saveActionQueue = new ActionQueue([
    new Action(
      $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID),
      "PUT",
      {
        name: encodeURIComponent(name),
        body: encodeURIComponent(body),
      },
      [ActionCallback.RemoveBeacon],
      saveExceptionHandler
    ),
  ]);

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
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        $apiUri + "/v1.0/mutex-beacon/" + encodeURIComponent(id)
      );
    }
  }

  function save() {
    if (initialField !== field) {
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID) + "/field",
          "PUT",
          field !== null
            ? {
                field: encodeURIComponent(field),
              }
            : {}
        )
      );
    }
    if (initialCompetences !== competences) {
      saveActionQueue.actions.push(
        new Action(
          $apiUri +
            "/v1.0/lesson/" +
            encodeURIComponent(lessonID) +
            "/competence",
          "PUT",
          {
            competence: competences.map(encodeURIComponent),
          }
        )
      );
    }
    if (initialGroups !== groups) {
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + encodeURIComponent(lessonID) + "/group",
          "PUT",
          { group: groups.map(encodeURIComponent) }
        )
      );
    }
    donePromise = saveActionQueue.dispatch();
  }

  function discard() {
    void new ActionQueue([
      new Action(
        $apiUri + "/v1.0/mutex/" + encodeURIComponent(lessonID),
        "DELETE",
        undefined,
        [ActionCallback.RemoveBeacon],
        discardExceptionHandler
      ),
    ]).dispatch();
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
