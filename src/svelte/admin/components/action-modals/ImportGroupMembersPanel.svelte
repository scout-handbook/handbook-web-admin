<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Event } from "../../../../ts/admin/interfaces/Event";
  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import type { Participant } from "../../../../ts/admin/interfaces/Participant";
  import type { Payload } from "../../../../ts/admin/interfaces/Payload";
  import type { User } from "../../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../../ts/admin/interfaces/UserListResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";
  import { SWRMutateFnWrapper } from "../../../../ts/admin/SWRMutateFix";
  import { get } from "../../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import {
    authFailHandler,
    reAuth,
    request,
  } from "../../../../ts/admin/utils/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import CheckboxGroup from "../forms/CheckboxGroup.svelte";
  import RadioGroup from "../forms/RadioGroup.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let groups: Array<[string, Group]>;
  export let payload: { groupId: string };

  const navigate = useNavigate();

  let error = "";
  let step = "event-selection-loading";
  const group = get(groups, payload.groupId)!;
  let eventList: Array<Event> = [];
  let selectedEvent: number;
  let participantList: Array<Participant> = [];
  let selectedParticipants: Array<number> = [];
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group")
  );

  void request<Array<Event>>(
    $apiUri + "/v1.0/event",
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    }
  ).then((response) => {
    eventList = response;
    if (eventList.length < 1) {
      error = "Nejste instruktorem na ????dn?? akci.";
    }
    step = "event-selection";
  });

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
    const participantPromise = request<Array<Participant>>(
      $apiUri + "/v1.0/event/" + selectedEvent.toString() + "/participant",
      "GET",
      {},
      {
        AuthenticationException: reAuth,
        SkautISAuthorizationException: () => {
          error = "Pro tuto akci nem??te ve SkautISu dostate??n?? pr??va.";
        },
      }
    );
    const userPromise = request<UserListResponse>(
      $apiUri + "/v1.0/user",
      "GET",
      { page: 1, "per-page": 1000, group: payload.groupId },
      {
        AuthenticationException: reAuth,
      }
    ).then((response) => response.users);
    void Promise.all([participantPromise, userPromise]).then(
      ([participants, users]) => {
        participantList = setdiff(participants, users);
        if (participantList.length < 1) {
          error = "Akce nem?? ????dn?? ????astn??ky (kte???? je??t?? nebyli importov??ni).";
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
        request(
          $apiUri + "/v1.0/user",
          "POST",
          {
            id: participant,
            name: participantList.find((p) => p.id === participant)!.name,
          } as unknown as Payload,
          authFailHandler
        ).then(async () =>
          request(
            $apiUri + "/v1.0/user/" + participant.toString() + "/group",
            "PUT",
            { group: payload.groupId },
            authFailHandler
          )
        )
      )
    ).then(() => {
      mutate(
        SWRMutateFnWrapper((groups) => {
          groups[payload.groupId].count += selectedParticipants.length;
          return groups;
        })
      );
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
    Akce byla ??sp????n??.
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
      Zru??it
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
      Pokra??ovat
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
      <h4>V??b??r ????astn??k??:</h4>
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
