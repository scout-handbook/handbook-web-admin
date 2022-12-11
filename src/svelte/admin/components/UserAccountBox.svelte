<script lang="ts">
  import { adminUri, frontendUri, loginstate } from "../../../ts/admin/stores";
</script>

<div id="user-account">
  {#if $loginstate === null}
    <img
      id="user-avatar"
      alt="Account avatar"
      src={$adminUri + "/avatar.png"}
    />
    <div id="user-name">&nbsp;</div>
  {:else}
    {#if $loginstate.avatar}
      <img
        id="user-avatar"
        alt="Account avatar"
        src={"data:image/png;base64," + $loginstate.avatar}
      />
    {:else}
      <img
        id="user-avatar"
        alt="Account avatar"
        src={$adminUri + "/avatar.png"}
      />
    {/if}
    <div id="user-name">{$loginstate.name}</div>
  {/if}
  <div id="log-link">
    <a
      href={$adminUri +
        "/v1.0/logout?redirect-uri=" +
        encodeURIComponent($frontendUri)}
    >
      Odhlásit
    </a>
    <a id="frontend-link" href="/">Zpět na web</a>
  </div>
</div>
