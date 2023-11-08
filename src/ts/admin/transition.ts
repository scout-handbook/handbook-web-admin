import type { EasingFunction, TransitionConfig } from "svelte/transition";

const dirs = {
  bottom: "translateY(",
  left: "translateX(-",
  right: "translateX(",
  top: "translateY(-",
};

interface FlyParams {
  from: "bottom" | "left" | "right" | "top";
  delay?: number;
  duration?: number;
  easing?: EasingFunction;
}

export const fly = (
  node: HTMLElement,
  { from = "top", ...opts }: FlyParams,
): TransitionConfig => ({
  ...opts,
  tick: (t: number, u: number): void => {
    node.style.setProperty("transform", `${dirs[from]}${u * 100.0}%)`);
    node.style.setProperty("opacity", `${t}`);
  },
});
