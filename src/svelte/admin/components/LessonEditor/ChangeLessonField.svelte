<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import FieldProvider from "../swr-wrappers/FieldProvider.svelte";

  export let field: string | null;

  const navigate = useNavigate();

  const initialField = field;

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
<h1>Změnit oblast</h1>
<form>
  <FieldProvider let:fields>
    {#each fields as [id, field]}
      <div class="form-row">
        <label class="form-switch">
          <input name="field" type="radio" value={id} bind:group={field} />
          <span class="form-custom form-radio" />
        </label>
        {#if id}
          {field.name}
        {:else}
          <span class="anonymous-field">Nezařazeno</span>
        {/if}
      </div>
    {/each}
  </FieldProvider>
</form>
