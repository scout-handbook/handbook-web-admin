<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Payload } from "../../../../ts/admin/interfaces/Payload";
  import {
    lessonSettingsCache,
    setChanged,
  } from "../../../../ts/admin/lessonEditor/editor";
  import { apiUri, fields } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";

  export let lessonId: string | null;
  export let saveActionQueue: ActionQueue;

  const navigate = useNavigate();

  let selectedField = lessonSettingsCache.field;
  $: fieldsArray = $fields?.asArray() ?? [];

  refreshLogin();

  function saveCallback() {
    if (selectedField !== lessonSettingsCache.field) {
      setChanged();
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + (lessonId ?? "{id}") + "/field",
          "PUT",
          (): Payload => ({ field: encodeURIComponent(selectedField) })
        )
      );
      lessonSettingsCache.field = selectedField;
    }
    navigate(-1);
  }
</script>

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
<h3 class="side-panel-title">Změnit oblast</h3>
<form id="side-panel-form">
  {#each fieldsArray as { id, value: field }}
    <div class="form-row">
      <label class="form-switch">
        <input
          name="field"
          type="radio"
          value={id ?? ""}
          bind:group={selectedField}
        />
        <span class="form-custom form-radio" />
      </label>
      {#if id}
        {field.name}
      {:else}
        <span class="anonymous-field">Nezařazeno</span>
      {/if}
    </div>
  {/each}
</form>
