<script lang="ts" strictEvents>
  export let value: string;
</script>

<input autocomplete="off" type="text" bind:value />

<style>
  input {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-size: 1.5em;
    font-weight: bold;
    margin-left: 5px;
    padding: 10px 16px;
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
    width: 50px;
  }

  input:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
