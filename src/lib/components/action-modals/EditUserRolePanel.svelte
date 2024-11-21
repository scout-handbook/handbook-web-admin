<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { User } from "$lib/interfaces/User";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { queryClient } from "$lib/utils/queryClient";
  import { createQuery } from "@tanstack/svelte-query";
  import { SvelteMap } from "svelte/reactivity";

  interface Props {
    payload: { user: User };
  }

  let { payload }: Props = $props();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let isSuperuser = $derived($accountQuery.data?.role === "superuser");

  let selectedRole = $state(payload.user.role);
  let donePromise: Promise<void> | null = $state(null);
  let roleList = $derived(
    new SvelteMap([
      ["user", "Uživatel"],
      ["editor", "Editor"],
      ...(isSuperuser
        ? ([
            ["administrator", "Administrátor"],
            ["superuser", "Superuser"],
          ] as const)
        : []),
    ]),
  );

  function saveCallback(): void {
    if (selectedRole === payload.user.role) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          `${CONFIG["api-uri"]}/v1.0/user/${encodeURIComponent(payload.user.id)}/role`,
          "PUT",
          { role: selectedRole },
        ),
      ])
        .dispatch()
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["v1.0", "user"],
          });
        });
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Uživatelská role byla úspěšně upravena.</DoneDialog>
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
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
    <h1>Změnit roli: {payload.user.name}</h1>
    <form>
      <RadioGroup options={roleList} bind:selected={selectedRole}>
        {#snippet option(_, value)}
          <span>
            {value}
          </span>
        {/snippet}
      </RadioGroup>
    </form>
    <br />
    <div class="infobox">
      <i class="icon-info-circled"></i>
      <span class="infobox-name">Uživatel</span> - Kdokoliv, kdo se někdy přihlásil
      pomocí skautISu. Nemá žádná oprávnění navíc oproti nepřihlášeným návštěvníkům.
    </div>
    <div class="infobox">
      <i class="icon-info-circled"></i>
      <span class="infobox-name">Editor</span> - Instruktor, který má základní přístup
      ke správě. Může přidávat lekce, měnit jejich obsah, body a přesouvat je mezi
      oblastmi. Editor má přístup ke správě uživatelů, avšak může prohlížet a měnit
      pouze hosty a uživatele.
    </div>
    {#if isSuperuser}
      <div class="infobox">
        <i class="icon-info-circled"></i>
        <span class="infobox-name">Administrátor</span> - Instruktor, mající všechna
        práva editora. Navíc může i mazat lekce a přidávat, upravovat a mazat oblasti
        a body. Administrátor může navíc přidělovat a odebírat práva editorů.
      </div>
      <div class="infobox">
        <i class="icon-info-circled"></i>
        <span class="infobox-name">Superuser</span> - Hlavní správce.
      </div>
    {/if}
  </SidePanel>
{/if}

<style>
  .infobox {
    margin-top: 20px;
  }

  .infobox-name {
    font-weight: bold;
  }
</style>
