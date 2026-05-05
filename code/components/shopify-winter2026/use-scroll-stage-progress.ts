"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = 1 | -1;

export type StageProgressTarget<StageId extends string = string> = {
  id: StageId;
  elementId?: string;
  progressAnchor?: number;
  enterDistanceVh?: number;
};

export type StageProgress = {
  progress: number;
  enter: number;
  exit: number;
  velocity: number;
  direction: ScrollDirection;
  isPinned: boolean;
  top: number;
  bottom: number;
  height: number;
};

export type ScrollStageProgressState<StageId extends string = string> = {
  scrollY: number;
  viewportHeight: number;
  heroProgress: number;
  railVisible: boolean;
  velocity: number;
  direction: ScrollDirection;
  stages: Partial<Record<StageId, StageProgress>>;
  progressById: Partial<Record<StageId, number>>;
  enterById: Partial<Record<StageId, number>>;
};

type UseScrollStageProgressOptions = {
  heroDistanceVh?: number;
  railVisibleAfterVh?: number;
};

const DEFAULT_STAGE_PROGRESS: StageProgress = {
  progress: 0,
  enter: 0,
  exit: 0,
  velocity: 0,
  direction: 1,
  isPinned: false,
  top: 0,
  bottom: 0,
  height: 0,
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function makeInitialState<StageId extends string>(): ScrollStageProgressState<StageId> {
  return {
    scrollY: 0,
    viewportHeight: 1,
    heroProgress: 0,
    railVisible: false,
    velocity: 0,
    direction: 1,
    stages: {},
    progressById: {},
    enterById: {},
  };
}

function measureStage(
  target: StageProgressTarget,
  viewportHeight: number,
  velocity: number,
  direction: ScrollDirection,
): StageProgress {
  const element = document.getElementById(target.elementId ?? target.id);
  if (!element) {
    return {
      ...DEFAULT_STAGE_PROGRESS,
      velocity,
      direction,
    };
  }

  const rect = element.getBoundingClientRect();
  const height = Math.max(rect.height, 1);
  const progressAnchor = target.progressAnchor ?? 0.5;
  const enterDistanceVh = target.enterDistanceVh ?? 0.82;
  const denominator = Math.max(height - viewportHeight, 1);

  return {
    progress: clamp01((viewportHeight * progressAnchor - rect.top) / denominator),
    enter: clamp01((viewportHeight - rect.top) / Math.max(viewportHeight * enterDistanceVh, 1)),
    exit: clamp01((viewportHeight * progressAnchor - rect.bottom) / Math.max(viewportHeight, 1)),
    velocity,
    direction,
    isPinned: rect.top <= 0 && rect.bottom >= viewportHeight,
    top: rect.top,
    bottom: rect.bottom,
    height,
  };
}

export function useScrollStageProgress<StageId extends string>(
  targets: readonly StageProgressTarget<StageId>[],
  options: UseScrollStageProgressOptions = {},
): ScrollStageProgressState<StageId> {
  const [state, setState] = useState<ScrollStageProgressState<StageId>>(() => makeInitialState<StageId>());

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;

    const measure = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const timeDelta = Math.max(now - lastTime, 16);
      const scrollDelta = scrollY - lastScrollY;
      const direction: ScrollDirection = scrollDelta >= 0 ? 1 : -1;
      const instantVelocity = scrollDelta / timeDelta;

      velocity = velocity * 0.72 + instantVelocity * 0.28;
      lastScrollY = scrollY;
      lastTime = now;

      const stages = {} as Partial<Record<StageId, StageProgress>>;
      const progressById = {} as Partial<Record<StageId, number>>;
      const enterById = {} as Partial<Record<StageId, number>>;

      targets.forEach((target) => {
        const stage = measureStage(target, viewportHeight, velocity, direction);
        stages[target.id] = stage;
        progressById[target.id] = stage.progress;
        enterById[target.id] = stage.enter;
      });

      setState({
        scrollY,
        viewportHeight,
        heroProgress: clamp01(scrollY / Math.max(viewportHeight * (options.heroDistanceVh ?? 1.2), 1)),
        railVisible: scrollY > viewportHeight * (options.railVisibleAfterVh ?? 0.72),
        velocity,
        direction,
        stages,
        progressById,
        enterById,
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [options.heroDistanceVh, options.railVisibleAfterVh, targets]);

  return state;
}
