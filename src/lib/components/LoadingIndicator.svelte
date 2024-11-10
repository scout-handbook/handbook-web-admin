<script lang="ts">
  interface Props {
    darkBackground?: boolean;
    inline?: boolean;
  }

  let { darkBackground = false, inline = false }: Props = $props();
</script>

<div class:container={inline}>
  <div class="indicator" class:dark-background={darkBackground}></div>
</div>

<style>
  .container {
    height: 180px;
    position: relative;
  }

  .indicator {
    animation: spin 2s linear infinite;
    border-color: var(--border-color);
    border-radius: 50%;
    border-style: solid;
    border-top-color: var(--accent-color);
    border-width: 16px;
    height: 120px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    z-index: 9;
  }

  .dark-background {
    border-color: var(--background-darker);
    border-top-color: var(--accent-color);
  }

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
</style>
