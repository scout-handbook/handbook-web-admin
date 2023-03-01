<script lang="ts" strictEvents>
  export let value: string;
</script>

<label>
  <div>Název:</div>
  <input autocomplete="off" type="text" bind:value />
</label>

<style>
  div {
    font-size: 1.1em;
    font-style: italic;
    margin-bottom: 5px;
    margin-left: 5px;
  }

  input {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-size: 1.5em;
    font-weight: bold;
    padding: 10px 16px;
    transition: border-color ease 0.15s, background-color ease 0.15s;
    width: 90%;
  }

  input:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
