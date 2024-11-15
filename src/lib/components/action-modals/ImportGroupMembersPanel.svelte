<script lang="ts">
  import type { Event } from "$lib/interfaces/Event";
  import type { Group } from "$lib/interfaces/Group";
  import type { Participant } from "$lib/interfaces/Participant";
  import type { Payload } from "$lib/interfaces/Payload";
  import type { User } from "$lib/interfaces/User";
  import type { UserListResponse } from "$lib/interfaces/UserListResponse";

  import Button from "$lib/components/Button.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import CheckboxGroup from "$lib/components/forms/OldCheckboxGroup.svelte";
  import RadioGroup from "$lib/components/forms/OldRadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { queryClient } from "$lib/utils/queryClient";
  import { authFailHandler, reAuth, request } from "$lib/utils/request";
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    group: Group;
    groupId: string;
  }

  let { group, groupId }: Props = $props();

  let error = $state("");
  let step = $state("event-selection-loading");
  let eventList: Array<Event> = $state([]);
  let selectedEvent: number | null = $state(null);
  let participantList: Array<Participant> = $state([]);
  let selectedParticipants: Array<number> = $state([]);

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "group"] });
      const cachedGroups = queryClient.getQueryData<Record<string, Group>>([
        "v1.0",
        "group",
      ]);
      if (cachedGroups !== undefined) {
        const newGroups = structuredClone(cachedGroups);
        newGroups[groupId].count += selectedParticipants.length;
        queryClient.setQueryData<Record<string, Group>>(
          ["v1.0", "group"],
          newGroups,
        );
      }
    },
  });

  void request<Array<Event>>(
    `${CONFIG["api-uri"]}/v1.0/event`,
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
    if (selectedEvent === null) {
      return;
    }
    step = "participant-selection-loading";
    const participantPromise = request<Array<Participant>>(
      `${CONFIG["api-uri"]}/v1.0/event/${selectedEvent.toString()}/participant`,
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
      `${CONFIG["api-uri"]}/v1.0/user`,
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
          `${CONFIG["api-uri"]}/v1.0/user`,
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
            `${CONFIG["api-uri"]}/v1.0/user/${participantId.toString()}/group`,
            "PUT",
            { group: groupId },
            authFailHandler,
          ),
        ),
      ),
    ).then(() => {
      $mutation.mutate();
      step = "done";
    });
  }
</script>

{#if step === "done"}
  <Dialog
    confirmButtonText="OK"
    onconfirm={() => {
      history.back();
    }}
  >
    Akce byla úspěšná.
  </Dialog>
{:else if error !== ""}
  <Dialog
    confirmButtonText="OK"
    onconfirm={() => {
      history.back();
    }}
  >
    {error}
  </Dialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      onclick={() => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    <Button
      green
      icon="fast-fw"
      onclick={() => {
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
          {#snippet option(_, name)}
            {name}
          {/snippet}
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
        >
          {#snippet children(name)}
            {name}
          {/snippet}
        </CheckboxGroup>
      </form>
    {/if}
  </SidePanel>
{/if}
