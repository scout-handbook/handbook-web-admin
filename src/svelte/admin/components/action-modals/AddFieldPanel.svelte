<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import SidePanel from "../SidePanel.svelte";
  import SidePanelImageSelector from "../SidePanelImageSelector.svelte";

  export let name = "Nová oblast";
  export let description = "Popis nové oblasti";
  export let image = "00000000-0000-0000-0000-000000000000";
  export let icon = "00000000-0000-0000-0000-000000000000";

  const navigate = useNavigate();

  let imageSelectorOpen = false;
  let iconSelectorOpen = false;

  refreshLogin();

  function saveCallback(): void {
    new ActionQueue([
      new Action($apiUri + "/v1.0/field", "POST", {
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
        image: encodeURIComponent(image),
        icon: encodeURIComponent(icon),
      }),
    ]).defaultDispatch();
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
<SidePanel>
  <Button
    icon="cancel"
    yellow
    on:click={() => {
      navigate(-1);
    }}>Zrušit</Button
  >
  <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
  <h3 class="side-panel-title">Přidat oblast</h3>
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
    >
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
      }}>Změnit</Button
    >
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
      }}>Změnit</Button
    >
  </form>
</SidePanel>
