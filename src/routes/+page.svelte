<script lang="ts" strictEvents>
  import TopBar from "$lib/components/TopBar.svelte";
  import LessonView from "$lib/views/LessonView.svelte";
</script>

<TopBar />
<div class="main-page-container">
  <div class="main-page">
    <LessonView />
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
