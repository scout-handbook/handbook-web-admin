<script lang="ts" strictEvents>
  export let value: string;
</script>

<label>
  <div>Název:</div>
  <input class="form-text" autocomplete="off" type="text" bind:value />
</label>

<style>
  input {
    font-size: 1.5em;
    font-weight: bold;
    padding: 10px 16px;
  }

  div {
    font-size: 1.1em;
    font-style: italic;
    margin-bottom: 5px;
    margin-left: 5px;
  }
</style>
