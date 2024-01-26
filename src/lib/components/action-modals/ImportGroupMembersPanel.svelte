<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import Button from "$lib/components/Button.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import type { Event } from "$lib/interfaces/Event";
  import type { Group } from "$lib/interfaces/Group";
  import type { Participant } from "$lib/interfaces/Participant";
  import type { Payload } from "$lib/interfaces/Payload";
  import type { User } from "$lib/interfaces/User";
  import type { UserListResponse } from "$lib/interfaces/UserListResponse";
  import { apiUri } from "$lib/stores";
  import type { SWRMutateFix } from "$lib/SWRMutateFix";
  import { SWRMutateFnWrapper } from "$lib/SWRMutateFix";
  import { get } from "$lib/utils/arrayUtils";
  import { constructURL } from "$lib/utils/constructURL";
  import { authFailHandler, reAuth, request } from "$lib/utils/request";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  let error = "";
  let step = "event-selection-loading";
  const group = get(groups, payload.groupId)!;
  let eventList: Array<Event> = [];
  let selectedEvent: number;
  let participantList: Array<Participant> = [];
  let selectedParticipants: Array<number> = [];
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  void request<Array<Event>>(
    $apiUri + "/v1.0/event",
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    },
  ).then((response) => {
    eventList = response;
    if (eventList.length < 1) {
      error = "Nejste instruktorem na žádné akci.";
    }
    step = "event-selection";
  });

  function setdiff(a: Array<Participant>, b: Array<User>): Array<Participant> {
    const bArr = b.map((x): number => x.id);
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
    const participantPromise = request<Array<Participant>>(
      $apiUri + "/v1.0/event/" + selectedEvent.toString() + "/participant",
      "GET",
      {},
      {
        AuthenticationException: reAuth,
        SkautISAuthorizationException: () => {
          error = "Pro tuto akci nemáte ve SkautISu dostatečná práva.";
        },
      },
    );
    const userPromise = request<UserListResponse>(
      $apiUri + "/v1.0/user",
      "GET",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP argument
      { page: 1, "per-page": 1000, group: payload.groupId },
      {
        AuthenticationException: reAuth,
      },
    ).then((response) => response.users);
    void Promise.all([participantPromise, userPromise]).then(
      ([participants, users]) => {
        participantList = setdiff(participants, users);
        if (participantList.length < 1) {
          error = "Akce nemá žádné účastníky (kteří ještě nebyli importováni).";
        }
        step = "participant-selection";
      },
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
        request(
          $apiUri + "/v1.0/user",
          "POST",
          {
            id: participant,
            name: participantList.find((p) => p.id === participant)!.name,
          } as unknown as Payload,
          authFailHandler,
        ).then(async () =>
          request(
            $apiUri + "/v1.0/user/" + participant.toString() + "/group",
            "PUT",
            { group: payload.groupId },
            authFailHandler,
          ),
        ),
      ),
    ).then(() => {
      void mutate(
        SWRMutateFnWrapper<Record<string, Group>>((cachedGroups) => {
          cachedGroups[payload.groupId].count += selectedParticipants.length;
          return cachedGroups;
        }),
      );
      step = "done";
    });
  }
</script>

{#if step === "done"}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      history.back();
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else if error !== ""}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      history.back();
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
        history.back();
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
          importParticipants();
        }
      }}
    >
      Pokračovat
    </Button>
    <h1>Importovat ze SkautISu: {group.name}</h1>
    {#if step === "event-selection-loading" || step === "participant-selection-loading" || step === "importing"}
      <LoadingIndicator />
    {:else if step === "event-selection"}
      <h4>Volba kurzu:</h4>
      <form>
        <RadioGroup
          options={eventList.map((event) => [event.id, event.name])}
          bind:selected={selectedEvent}
        >
          <span slot="option" let:value={name}>
            {name}
          </span>
        </RadioGroup>
      </form>
    {:else if step === "participant-selection"}
      <h4>Výběr účastníků:</h4>
      <form>
        <CheckboxGroup
          options={participantList.map((participant) => [
            participant.id,
            participant.name,
          ])}
          bind:selected={selectedParticipants}
          let:value={name}
        >
          {name}
        </CheckboxGroup>
      </form>
    {/if}
  </SidePanel>
{/if}
