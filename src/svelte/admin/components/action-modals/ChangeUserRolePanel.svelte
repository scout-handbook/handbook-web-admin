<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../../ts/admin/interfaces/Loginstate";
  import type { User } from "../../../../ts/admin/interfaces/User";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let payload: { user: User };

  const navigate = useNavigate();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";

  let selectedRole = payload.user.role;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

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
      ]).dispatch();
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
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
      <span class="role-text">Role: </span>
      <select id="role-select" class="form-select" bind:value={selectedRole}>
        <option id="user" value="user">Uživatel</option>
        <option id="editor" value="editor">Editor</option>
        {#if isSuperuser}
          <option id="administrator" value="administrator">Administrátor</option
          >
          <option id="superuser" value="superuser">Superuser</option>
        {/if}
      </select>
    </form>
    <br />
    <div class="role-help">
      <i class="icon-info-circled" />
      <span class="role-help-name">Uživatel</span> - Kdokoliv, kdo se někdy přihlásil
      pomocí skautISu. Nemá žádná oprávnění navíc oproti nepřihlášeným návštěvníkům.
    </div>
    <div class="role-help">
      <i class="icon-info-circled" />
      <span class="role-help-name">Editor</span> - Instruktor, který má základní
      přístup ke správě. Může přidávat lekce, měnit jejich obsah, kompetence a přesouvat
      je mezi oblastmi. Editor má přístup ke správě uživatelů, avšak může prohlížet
      a měnit pouze hosty a uživatele.
    </div>
    {#if isSuperuser}
      <div class="role-help">
        <i class="icon-info-circled" />
        <span class="role-help-name">Administrátor</span> - Instruktor, mající všechna
        práva editora. Navíc může i mazat lekce a přidávat, upravovat a mazat oblasti
        a kompetence. Administrátor může navíc přidělovat a odebírat práva editorů.
      </div>
      <div class="role-help">
        <i class="icon-info-circled" />
        <span class="role-help-name">Superuser</span> - Uživatel-polobůh.
      </div>
    {/if}
  </SidePanel>
{/if}
