<script lang="ts" strictEvents>
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import LessonView from "$lib/views/LessonView.svelte";
</script>

<TopBar />
<MainPageContainer>
  <LessonView />
</MainPageContainer>
