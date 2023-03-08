<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import Button from "../Button.svelte";
  import RadioGroup from "../forms/RadioGroup.svelte";
  import FieldProvider from "../swr-wrappers/FieldProvider.svelte";

  export let field: string | null;

  const navigate = useNavigate();

  const initialField = field;
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
    <RadioGroup options={fields} bind:selected={field}>
      <span slot="option" let:id let:value={currentField}>
        {#if id}
          {currentField.name}
        {:else}
          <span class="anonymous">Nezařazeno</span>
        {/if}
      </span>
    </RadioGroup>
  </FieldProvider>
</form>

<style>
  .anonymous {
    font-style: italic;
  }
</style>
