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
      <span slot="null-option" class="anonymous">Nezařazeno</span>
      <span slot="option" let:value={currentField}>
        {currentField.name}
      </span>
    </RadioGroup>
  </FieldProvider>
</form>

<style>
  .anonymous {
    font-style: italic;
  }
</style>
