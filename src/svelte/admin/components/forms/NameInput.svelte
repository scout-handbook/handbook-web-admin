<script lang="ts" strictEvents>
  export let value: string;
</script>

<input class="form-text name-field" autocomplete="off" type="text" bind:value />

<style>
  .name-field {
    font-size: 1.5em;
    font-weight: bold;
  }
</style>
