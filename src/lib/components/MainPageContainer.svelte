<script lang="ts" strictEvents>
  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<div class="main-page-container">
  <div class="main-page">
    <slot />
  </div>
</div>

<style>
  .main-page {
    margin: 0 auto;
    max-width: 770px;
    padding: 20px;
  }

  .main-page-container {
    bottom: 0;
    left: 0;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 81px;
  }
</style>
