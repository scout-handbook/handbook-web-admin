<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { adminUri, frontendUri } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: avatar = $loginstate
    ? "data:image/png;base64," + $loginstate.avatar
    : $adminUri + "/avatar.png";
  $: name = $loginstate?.name;
</script>

<div id="user-account">
  <img id="user-avatar" alt="Account avatar" src={avatar} />
  <div id="user-name">
    {#if name}
      {name}
    {:else}
      &nbsp;
    {/if}
  </div>
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
