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
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
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

  export let group: Group;
  export let groupId: string;

  const navigate = useNavigate();

  let error = "";
  let step = "event-selection-loading";
  let eventList: Array<Event> = [];
  let selectedEvent: number;
  let participantList: Array<Participant> = [];
  let selectedParticipants: Array<number> = [];
  const { mutate } = useSWR<SWRMutateFix<Record<string, Group>>>(
    constructURL("v1.0/group"),
  );

  void request<Array<Event>>(
    `${$apiUri}/v1.0/event`,
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
      `${$apiUri}/v1.0/event/${selectedEvent.toString()}/participant`,
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
      `${$apiUri}/v1.0/user`,
      "GET",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP argument
      { group: groupId, page: 1, "per-page": 1000 },
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
      selectedParticipants.map(async (participantId) =>
        request(
          `${$apiUri}/v1.0/user`,
          "POST",
          {
            id: participantId,
            name:
              participantList.find((p) => p.id === participantId)?.name ??
              "Účastník",
          } as unknown as Payload,
          authFailHandler,
        ).then(async () =>
          request(
            `${$apiUri}/v1.0/user/${participantId.toString()}/group`,
            "PUT",
            { group: groupId },
            authFailHandler,
          ),
        ),
      ),
    ).then(() => {
      mutate(
        SWRMutateFnWrapper((cachedGroups) => {
          cachedGroups[groupId].count += selectedParticipants.length;
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
