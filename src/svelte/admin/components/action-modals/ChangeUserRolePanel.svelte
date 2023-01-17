<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Loginstate } from "../../../../ts/admin/interfaces/Loginstate";
  import { User } from "../../../../ts/admin/interfaces/User";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let loginstate: Loginstate;
  export let payload: { user: User };

  const navigate = useNavigate();

  let selectedRole = payload.user.role;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function saveCallback() {
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
    <h3 class="side-panel-title">Změnit roli: {payload.user.name}</h3>
    <form id="side-panel-form">
      <span class="role-text">Role: </span>
      <select id="role-select" class="form-select" bind:value={selectedRole}>
        <option id="user" value="user">Uživatel</option>
        <option id="editor" value="editor">Editor</option>
        {#if loginstate.role === "superuser"}
          <option id="administrator" value="administrator">Administrátor</option
          >
          <option id="superuser" value="superuser">Superuser</option>
        {/if}
      </select>
    </form>
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
    {#if loginstate.role === "superuser"}
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
