<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    cyan?: boolean;
    green?: boolean;
    icon?: string;
    onclick(this: void): void;
    red?: boolean;
    yellow?: boolean;
  }

  let {
    children,
    cyan = false,
    green = false,
    icon = "",
    onclick,
    red = false,
    yellow = false,
  }: Props = $props();
</script>

<button class:cyan class:green class:red class:yellow {onclick} type="button">
  {#if icon !== ""}
    <i class={`icon-${icon}`}></i>
  {/if}
  {@render children()}
</button>

<style>
  button {
    background-clip: padding-box;
    background-color: var(--button-border);
    border: 1px solid #fff;
    border: 1px solid rgba(255, 255, 255, 0%);
    border-radius: 5px;
    box-sizing: content-box;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    height: 35px;
    line-height: 35px;
    margin-bottom: -10px;
    margin-right: 15px;
    max-width: 400px;
    overflow: hidden;
    padding: 0 12px 0 8px;
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 20%);
    transition:
      box-shadow ease 0.15s,
      border-color ease 0.15s;
  }

  button:hover {
    border-color: var(--button-border);
    box-shadow: rgba(0, 0, 0, 20%) 1px 1px 4px 1px;
    text-decoration: none;
  }

  .cyan {
    background-color: var(--button-accent-cyan);
  }

  .cyan:hover {
    border-color: var(--button-accent-cyan);
  }

  .green {
    background-color: var(--button-accent-green);
  }

  .green:hover {
    border-color: var(--button-accent-green);
  }

  .red {
    background-color: var(--button-accent-red);
  }

  .red:hover {
    border-color: var(--button-accent-red);
  }

  .yellow {
    background-color: var(--button-accent-yellow);
  }

  .yellow:hover {
    border-color: var(--button-accent-yellow);
  }
</style>
