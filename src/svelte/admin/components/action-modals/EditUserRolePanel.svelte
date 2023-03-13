<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import type { Loginstate } from "../../../../ts/admin/interfaces/Loginstate";
  import type { User } from "../../../../ts/admin/interfaces/User";
  import { apiUri } from "../../../../ts/admin/stores";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import RadioGroup from "../forms/RadioGroup.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let payload: { user: User };
  export let revalidate: ((ops?: { force?: boolean }) => void) | undefined =
    undefined;

  const navigate = useNavigate();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";

  let selectedRole = payload.user.role;
  let donePromise: Promise<void> | null = null;
  $: roleList = ([] as Array<[string, string]>).concat(
    [
      ["user", "Uživatel"],
      ["editor", "Editor"],
    ],
    isSuperuser
      ? [
          ["administrator", "Administrátor"],
          ["superuser", "Superuser"],
        ]
      : []
  );

  function saveCallback(): void {
    if (selectedRole === payload.user.role) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          $apiUri +
            "/v1.0/user/" +
            encodeURIComponent(payload.user.id) +
            "/role",
          "PUT",
          { role: selectedRole }
        ),
      ])
        .dispatch()
        .then(() => {
          revalidate?.({ force: true });
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
      yellow
      on:click={() => {
        navigate(-1);
      }}
    >
      Zrušit
    </Button>
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Změnit roli: {payload.user.name}</h1>
    <form>
      <RadioGroup options={roleList} bind:selected={selectedRole}>
        <span slot="option" let:value>
          {value}
        </span>
      </RadioGroup>
    </form>
    <br />
    <div class="infobox">
      <i class="icon-info-circled" />
      <span class="infobox-name">Uživatel</span> - Kdokoliv, kdo se někdy přihlásil
      pomocí skautISu. Nemá žádná oprávnění navíc oproti nepřihlášeným návštěvníkům.
    </div>
    <div class="infobox">
      <i class="icon-info-circled" />
      <span class="infobox-name">Editor</span> - Instruktor, který má základní přístup
      ke správě. Může přidávat lekce, měnit jejich obsah, kompetence a přesouvat
      je mezi oblastmi. Editor má přístup ke správě uživatelů, avšak může prohlížet
      a měnit pouze hosty a uživatele.
    </div>
    {#if isSuperuser}
      <div class="infobox">
        <i class="icon-info-circled" />
        <span class="infobox-name">Administrátor</span> - Instruktor, mající všechna
        práva editora. Navíc může i mazat lekce a přidávat, upravovat a mazat oblasti
        a kompetence. Administrátor může navíc přidělovat a odebírat práva editorů.
      </div>
      <div class="infobox">
        <i class="icon-info-circled" />
        <span class="infobox-name">Superuser</span> - Uživatel-polobůh.
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
