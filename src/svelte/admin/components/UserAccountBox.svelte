<script lang="ts">
  import { config, loginstate } from "../../../ts/admin/stores";
</script>

<div id="user-account">
  {#await $loginstate}
    <img
      id="user-avatar"
      alt="Account avatar"
      src={$config['admin-uri'] + "/avatar.png"}
    />
    <div id="user-name">&nbsp;</div>
  {:then state}
    {#if state.avatar}
      <img
        id="user-avatar"
        alt="Account avatar"
        src={"data:image/png;base64," + state.avatar}
      />
    {:else}
      <img
        id="user-avatar"
        alt="Account avatar"
        src={$config['admin-uri'] + "/avatar.png"}
      />
    {/if}
    <div id="user-name">{state.name}</div>
  {/await}
  <div id="log-link">
    <a
      href={$config[
        'admin-uri'
      ] + "/v1.0/logout?redirect-uri=" + encodeURIComponent(
        $config['frontend-uri']
      )}
    >
      Odhlásit
    </a>
    <a id="frontend-link" href="/">Zpět na web</a>
  </div>
</div>
