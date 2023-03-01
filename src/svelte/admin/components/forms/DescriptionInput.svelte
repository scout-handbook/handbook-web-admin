<script lang="ts" strictEvents>
  export let value: string;
</script>

<textarea
  class="form-text description"
  autocomplete="off"
  rows="5"
  bind:value
/>

<style>
  textarea {
    margin-top: 20px;
  }
</style>
