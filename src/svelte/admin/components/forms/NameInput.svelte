<script lang="ts" strictEvents>
  export let value: string;
</script>

<input class="form-text" autocomplete="off" type="text" bind:value />

<style>
  input {
    font-size: 1.5em;
    font-weight: bold;
  }
</style>
