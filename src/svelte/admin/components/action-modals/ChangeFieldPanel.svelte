<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import { Field } from "../../../../ts/admin/interfaces/Field";
  import { IDList } from "../../../../ts/admin/IDList";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";
  import SidePanelImageSelector from "../SidePanelImageSelector.svelte";

  export let fields: IDList<Field>;
  export let payload: { fieldId: string };

  const navigate = useNavigate();

  let done = false;
  const field = fields.get(payload.fieldId)!;
  let { name, description, image, icon } = field;
  let imageSelectorOpen = false;
  let iconSelectorOpen = false;

  refreshLogin();

  function saveCallback() {
    if (
      field.name === name &&
      field.description === description &&
      field.image === image &&
      field.icon === icon
    ) {
      done = true;
    } else {
      new ActionQueue([
        new Action(
          $apiUri + "/v1.0/field/" + encodeURIComponent(payload.fieldId),
          "PUT",
          () => ({ name, description, image, icon })
        ),
      ]).defaultDispatch();
    }
  }
</script>

{#if imageSelectorOpen}
  <SidePanelImageSelector
    on:cancel={() => {
      imageSelectorOpen = false;
    }}
    on:select={(event) => {
      image = event.detail;
      imageSelectorOpen = false;
    }}
  />
{/if}
{#if iconSelectorOpen}
  <SidePanelImageSelector
    on:cancel={() => {
      iconSelectorOpen = false;
    }}
    on:select={(event) => {
      icon = event.detail;
      iconSelectorOpen = false;
    }}
  />
{/if}
{#if done}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
    }}
  >
    Akce byla úspěšná.
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
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h3 class="side-panel-title">Upravit oblast</h3>
    <form id="side-panel-form">
      <legend for="fieldName">Název:</legend>
      <input
        id="fieldName"
        class="form-text form-name"
        autocomplete="off"
        type="text"
        bind:value={name}
      />
      <textarea
        id="field-description"
        class="form-text"
        autocomplete="off"
        rows="5"
        bind:value={description}
      />
      <legend for="fieldImage">Náhledový obrázek:</legend>
      <input id="fieldImage" type="hidden" bind:value={image} />
      <img
        alt="Náhledový obrázek"
        src={$apiUri + "/v1.0/image/" + image + "?quality=thumbnail"}
      />
      <br />
      <Button
        icon="pencil"
        on:click={() => {
          imageSelectorOpen = true;
        }}
      >
        Změnit
      </Button>
      <legend for="fieldIcon">Ikona:</legend>
      <input id="fieldIcon" type="hidden" bind:value={icon} />
      <img
        alt="Ikona"
        src={$apiUri + "/v1.0/image/" + icon + "?quality=thumbnail"}
      />
      <br />
      <Button
        icon="pencil"
        on:click={() => {
          iconSelectorOpen = true;
        }}
      >
        Změnit
      </Button>
    </form>
  </SidePanel>
{/if}
