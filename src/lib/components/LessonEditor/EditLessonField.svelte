<script lang="ts" strictEvents>
  import Button from "$lib/components/Button.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";

  export let field: string | null;

  const initialField = field;
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    field = initialField;
    history.back();
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    history.back();
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
