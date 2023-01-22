<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { customProperties } from "../../../ts/admin/stores";

  export let cyan = false;
  export let green = false;
  export let red = false;
  export let yellow = false;
  export let icon = "";

  const dispatch = createEventDispatcher<{ click: never }>();

  $: ({
    "--button-accent-cyan": buttonAccentCyan,
    "--button-accent-green": buttonAccentGreen,
    "--button-accent-red": buttonAccentRed,
    "--button-accent-yellow": buttonAccentYellow,
    "--button-border": buttonBorder,
  } = $customProperties);

  $: accentColor = cyan
    ? buttonAccentCyan
    : green
    ? buttonAccentGreen
    : red
    ? buttonAccentRed
    : yellow
    ? buttonAccentYellow
    : buttonBorder;

  function callback(): void {
    dispatch("click");
  }
</script>

<!-- eslint-disable svelte/require-optimized-style-attribute -->
<div
  style={"--accent-color: " + accentColor}
  on:click={callback}
  on:keypress={callback}
>
  <!-- eslint-enable svelte/require-optimized-style-attribute -->
  {#if icon !== ""}
    <i class={"icon-" + icon} />
  {/if}
  <slot />
</div>

<style>
  div {
    background-clip: padding-box;
    background-color: var(--accent-color);
    border: 1px solid #fff;
    border: 1px solid rgba(255, 255, 255, 0%);
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    height: 35px;
    line-height: 35px;
    margin-bottom: -10px;
    margin-right: 15px;
    max-width: 400px;
    overflow: hidden;
    padding: 0 12px 0 8px;
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 20%);
    transition: box-shadow ease 0.15s, border-color ease 0.15s;
  }

  div:hover {
    border-color: var(--accent-color);
    box-shadow: rgba(0, 0, 0, 20%) 1px 1px 4px 1px;
    text-decoration: none;
  }
</style>
