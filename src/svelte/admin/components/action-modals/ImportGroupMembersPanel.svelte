<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { Event } from "../../../../ts/admin/interfaces/Event";
  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import type { Participant } from "../../../../ts/admin/interfaces/Participant";
  import type { Payload } from "../../../../ts/admin/interfaces/Payload";
  import type { User } from "../../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../../ts/admin/interfaces/UserListResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import {
    authFailHandler,
    reAuthHandler,
    request,
  } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  let error = "";
  let step = "event-selection-loading";
  const group = get(groups, payload.groupId)!;
  let eventList: Array<Event> = [];
  let selectedEvent: string;
  let participantList: Array<Participant> = [];
  let selectedParticipants: Array<number> = [];

  refreshLogin();

  request(
    $apiUri + "/v1.0/event",
    "GET",
    {},
    (response: Array<Event>) => {
      eventList = response;
      if (eventList.length < 1) {
        error = "Nejste instruktorem na žádné akci.";
      }
      step = "event-selection";
    },
    reAuthHandler
  );

  function setdiff(a: Array<Participant>, b: Array<User>): Array<Participant> {
    const bArr = b.map(function (x): number {
      return x.id;
    });
    const result = [];
    for (const aItem of a) {
      if (!bArr.includes(aItem.id)) {
        result.push(aItem);
      }
    }
    return result;
  }

  function getParticipantList(): void {
    if (!selectedEvent) {
      return;
    }
    step = "participant-selection-loading";
    const participantPromise = new Promise<Array<Participant>>((resolve) => {
      const exceptionHandler = reAuthHandler;
      exceptionHandler.SkautISAuthorizationException = function (): void {
        error = "Pro tuto akci nemáte ve SkautISu dostatečná práva.";
      };
      request(
        $apiUri + "/v1.0/event/" + selectedEvent + "/participant",
        "GET",
        {},
        (response: Array<Participant>) => {
          resolve(response);
        },
        exceptionHandler
      );
    });
    const userPromise = new Promise<Array<User>>((resolve) => {
      request(
        $apiUri + "/v1.0/user",
        "GET",
        { page: 1, "per-page": 1000, group: payload.groupId },
        (response: UserListResponse) => {
          resolve(response.users);
        },
        reAuthHandler
      );
    });
    void Promise.all([participantPromise, userPromise]).then(
      ([participants, users]) => {
        participantList = setdiff(participants, users);
        if (participantList.length < 1) {
          error = "Akce nemá žádné účastníky (kteří ještě nebyli importováni).";
        }
        step = "participant-selection";
      }
    );
  }

  function importParticipants(): void {
    if (selectedParticipants.length < 1) {
      step = "done";
      return;
    }
    step = "importing";
    void Promise.all(
      selectedParticipants.map(async (participant) =>
        new Promise<void>((resolve) => {
          request(
            $apiUri + "/v1.0/user",
            "POST",
            {
              id: participant,
              name: participantList.find((p) => p.id === participant)!.name,
            } as unknown as Payload,
            () => {
              resolve();
            },
            authFailHandler
          );
        }).then(
          async () =>
            new Promise<void>((resolve) => {
              request(
                $apiUri + "/v1.0/user/" + participant.toString() + "/group",
                "PUT",
                { group: payload.groupId },
                () => {
                  resolve();
                },
                authFailHandler
              );
            })
        )
      )
    ).then(() => {
      step = "done";
    });
  }
</script>

{#if step === "done"}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else if error !== ""}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    {error}
  </Dialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        navigate(-1);
      }}
    >
      Zrušit
    </Button>
    <Button
      green
      icon="fast-fw"
      on:click={() => {
        if (step === "event-selection") {
          getParticipantList();
        } else if (step === "participant-selection") {
          console.log(selectedParticipants);
          importParticipants();
        }
      }}
    >
      Pokračovat
    </Button>
    <h3 class="side-panel-title">Importovat ze SkautISu: {group.name}</h3>
    <div id="importList">
      {#if step === "event-selection-loading" || step === "participant-selection-loading" || step === "importing"}
        <LoadingIndicator />
      {:else if step === "event-selection"}
        <h4>Volba kurzu:</h4>
        <form id="side-panel-form">
          {#each eventList as event}
            <div class="form-row">
              <label class="form-switch">
                <input
                  name="field"
                  type="radio"
                  value={event.id}
                  bind:group={selectedEvent}
                />
                <span class="form-custom form-radio" />
              </label>
              {event.name}
            </div>
          {/each}
        </form>
      {:else if step === "participant-selection"}
        <h4>Výběr účastníků:</h4>
        <form id="side-panel-form">
          {#each participantList as participant}
            <div class="form-row">
              <label class="form-switch">
                <input
                  type="checkbox"
                  value={participant.id}
                  bind:group={selectedParticipants}
                />
                <span class="form-custom form-checkbox" />
              </label>
              {participant.name}
            </div>
          {/each}
        </form>
      {/if}
    </div>
  </SidePanel>
{/if}
