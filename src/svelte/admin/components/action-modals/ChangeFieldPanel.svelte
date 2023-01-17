<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { Field } from "../../../../ts/admin/interfaces/Field";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
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
          { name, description, image, icon }
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
      <label for="fieldName">Název:</label>
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
      <label for="fieldImage">Náhledový obrázek:</label>
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
      <label for="fieldIcon">Ikona:</label>
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
