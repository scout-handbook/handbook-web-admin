<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let competences: Array<[string, Competence]>;
  export let payload: { competenceId: string };

  const navigate = useNavigate();

  const competence = get(competences, payload.competenceId)!;
  let { number, name, description } = competence;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function saveCallback(): void {
    if (
      competence.number === number &&
      competence.name === name &&
      competence.description === description
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          $apiUri +
            "/v1.0/competence/" +
            encodeURIComponent(payload.competenceId),
          "PUT",
          { number, name, description }
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
    <h1>Upravit kompetenci</h1>
    <form>
      <span class="competence-heading">Kompetence</span>
      <input
        id="competence-number"
        class="form-text form-name"
        autocomplete="off"
        type="number"
        bind:value={number}
      />
      <br />
      <input
        id="competence-name"
        class="form-text"
        autocomplete="off"
        type="text"
        bind:value={name}
      />
      <br />
      <textarea
        id="competence-description"
        class="form-text"
        autocomplete="off"
        rows="5"
        bind:value={description}
      />
    </form>
  </SidePanel>
{/if}
