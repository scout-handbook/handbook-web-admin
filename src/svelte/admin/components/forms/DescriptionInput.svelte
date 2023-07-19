<script lang="ts" strictEvents>
  export let value: string;
</script>

<textarea autocomplete="off" rows="5" bind:value />

<style>
  textarea {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    margin-top: 20px;
    padding: 5px 10px;
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
    width: 90%;
  }

  textarea:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
