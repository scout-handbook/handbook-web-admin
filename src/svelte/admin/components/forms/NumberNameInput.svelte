<script lang="ts" strictEvents>
  export let value: number;
</script>

<input class="form-text form-name" autocomplete="off" type="text" bind:value />

<style>
  input {
    margin-left: 5px;
    width: 50px;
  }
</style>
