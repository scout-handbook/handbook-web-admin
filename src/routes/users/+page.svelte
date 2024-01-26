<script lang="ts" strictEvents>
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import UserView from "$lib/views/UserView.svelte";
</script>

<TopBar />
<MainPageContainer>
  <UserView />
</MainPageContainer>
