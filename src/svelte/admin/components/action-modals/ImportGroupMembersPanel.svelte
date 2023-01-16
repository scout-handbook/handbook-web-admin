<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import {
    authFailHandler,
    reAuthHandler,
    request,
  } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import { Event } from "../../../../ts/admin/interfaces/Event";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import { IDList } from "../../../../ts/admin/IDList";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import { Participant } from "../../../../ts/admin/interfaces/Participant";
  import { Payload } from "../../../../ts/admin/interfaces/Payload";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import SidePanel from "../SidePanel.svelte";
  import { User } from "../../../../ts/admin/interfaces/User";
  import { UserListResponse } from "../../../../ts/admin/interfaces/UserListResponse";

  export let groups: IDList<Group>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  let error = "";
  let step = "event-selection-loading";
  const group = groups.get(payload.groupId)!;
  let eventList: Array<Event> = [];
  let selectedEvent: string;
  let participantList: Array<Participant> = [];
  let selectedParticipants: Array<number> = [];

  refreshLogin();

  request(
    $apiUri + "/v1.0/event",
    "GET",
    {},
    (response: RequestResponse) => {
      eventList = response as Array<Event>;
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
    for (let i = 0; i < a.length; i++) {
      if (bArr.indexOf(a[i].id) < 0) {
        result.push(a[i]);
      }
    }
    return result;
  }

  function getParticipantList() {
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
        (response: RequestResponse) => {
          resolve(response as Array<Participant>);
        },
        exceptionHandler
      );
    });
    const userPromise = new Promise<Array<User>>((resolve) => {
      request(
        $apiUri + "/v1.0/user",
        "GET",
        { page: 1, "per-page": 1000, group: payload.groupId },
        (response: RequestResponse) => {
          resolve((response as UserListResponse).users);
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

  function importParticipants() {
    if (selectedParticipants.length < 1) {
      step = "done";
      return;
    }
    step = "importing";
    void Promise.all(
      selectedParticipants.map((participant) =>
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
          () =>
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
