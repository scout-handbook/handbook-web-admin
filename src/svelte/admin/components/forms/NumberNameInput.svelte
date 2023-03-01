<script lang="ts" strictEvents>
  export let value: number;
</script>

<input class="form-name" autocomplete="off" type="text" bind:value />

<style>
  input {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    margin-left: 5px;
    padding: 5px 10px;
    transition: border-color ease 0.15s, background-color ease 0.15s;
    width: 50px;
  }

  input:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
