import type {
  EasingFunction,
  FadeParams,
  TransitionConfig,
} from "svelte/transition";

export function fade(
  node: HTMLElement,
  params: FadeParams = {},
): TransitionConfig {
  const o = +getComputedStyle(node).opacity;
  return {
    ...params,
    tick: (t: number): void => {
      node.style.setProperty("opacity", (t * o).toString());
    },
  };
}

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
  { from = "top", ...params }: FlyParams,
): TransitionConfig => ({
  ...params,
  tick: (t: number, u: number): void => {
    node.style.setProperty(
      "transform",
      `${dirs[from]}${(u * 100.0).toString()}%)`,
    );
    node.style.setProperty("opacity", t.toString());
  },
});
