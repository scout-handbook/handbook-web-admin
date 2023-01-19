<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { fields } from "../../../../ts/admin/stores";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";

  export let field: string | null;

  const navigate = useNavigate();

  const initialField = field;
  $: fieldsArray = $fields?.asArray() ?? [];

  refreshLogin();
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    field = initialField;
    navigate(-1);
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    navigate(-1);
  }}>Uložit</Button
>
<h3 class="side-panel-title">Změnit oblast</h3>
<form id="side-panel-form">
  {#each fieldsArray as { id, value }}
    <div class="form-row">
      <label class="form-switch">
        <input name="field" type="radio" value={id} bind:group={field} />
        <span class="form-custom form-radio" />
      </label>
      {#if id}
        {value.name}
      {:else}
        <span class="anonymous-field">Nezařazeno</span>
      {/if}
    </div>
  {/each}
</form>
