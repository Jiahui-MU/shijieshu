"use client";

import type { CSSProperties, ReactNode } from "react";
import { DissolveMaskLayer, type DissolveMaskLayerProps } from "./dissolve-mask-layer";
import { ScrollScrubVideoLayer, type ScrollScrubVideoLayerProps } from "./scroll-scrub-video-layer";
import { SparkleFieldCanvas, type SparkleFieldCanvasProps } from "./sparkle-field-canvas";
import { TornPaperCanvas, type TornPaperCanvasProps } from "./torn-paper-canvas";
import type { ScrollDirection } from "./use-scroll-stage-progress";

type DissolveOptions = Omit<DissolveMaskLayerProps, "progress" | "children"> & {
  startProgress?: number;
  endProgress?: number;
};

type ScrubVideoOptions = Omit<ScrollScrubVideoLayerProps, "progress"> & {
  startProgress?: number;
  endProgress?: number;
};

type SparkleOptions = Omit<SparkleFieldCanvasProps, "progress" | "velocity" | "direction">;

type TearOptions = Omit<TornPaperCanvasProps, "progress" | "motion"> & {
  progress?: number;
  motion?: number;
  startProgress?: number;
  endProgress?: number;
};

export type ChapterIntroStageProps = {
  progress: number;
  velocity?: number;
  direction?: ScrollDirection;
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  scrubVideo?: ScrubVideoOptions;
  dissolve?: DissolveOptions;
  sparkles?: boolean | SparkleOptions;
  tear?: TearOptions;
  className?: string;
  beforeClassName?: string;
  afterClassName?: string;
  videoClassName?: string;
  sparkleClassName?: string;
  tearClassName?: string;
  contentClassName?: string;
  style?: CSSProperties;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function mapProgress(progress: number, start = 0, end = 1) {
  return clamp((progress - start) / Math.max(end - start, 0.0001));
}

const fillLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

export function ChapterIntroStage({
  progress,
  velocity = 0,
  direction = 1,
  before,
  after,
  children,
  scrubVideo,
  dissolve,
  sparkles = false,
  tear,
  className,
  beforeClassName,
  afterClassName,
  videoClassName,
  sparkleClassName,
  tearClassName,
  contentClassName,
  style,
}: ChapterIntroStageProps) {
  const dissolveProgress = mapProgress(progress, dissolve?.startProgress ?? 0.18, dissolve?.endProgress ?? 0.62);
  const beforeOpacity = 1 - smoothStep(dissolveProgress);
  const sparkleProps = typeof sparkles === "object" ? sparkles : {};
  const tearProgress = tear?.progress ?? mapProgress(progress, tear?.startProgress ?? 0.46, tear?.endProgress ?? 0.78);
  const tearMotion = tear?.motion ?? progress;

  let videoLayer: ReactNode = null;
  if (scrubVideo) {
    const {
      startProgress: scrubStartProgress = 0,
      endProgress: scrubEndProgress = 1,
      className: scrubClassName,
      style: scrubStyle,
      ...videoProps
    } = scrubVideo;
    videoLayer = (
      <ScrollScrubVideoLayer
        {...videoProps}
        progress={mapProgress(progress, scrubStartProgress, scrubEndProgress)}
        className={videoClassName ?? scrubClassName}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          ...scrubStyle,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        isolation: "isolate",
        ...style,
      }}
    >
      {before ? (
        <div
          className={beforeClassName}
          style={{
            ...fillLayerStyle,
            opacity: beforeOpacity,
          }}
        >
          {before}
        </div>
      ) : null}

      {after || videoLayer ? (
        <DissolveMaskLayer
          {...dissolve}
          progress={dissolveProgress}
          className={afterClassName ?? dissolve?.className}
          style={{
            ...fillLayerStyle,
            ...dissolve?.style,
          }}
        >
          {videoLayer}
          {after}
        </DissolveMaskLayer>
      ) : null}

      {sparkles ? (
        <SparkleFieldCanvas
          {...sparkleProps}
          progress={progress}
          velocity={velocity}
          direction={direction}
          className={sparkleClassName ?? sparkleProps.className}
          style={{
            ...fillLayerStyle,
            pointerEvents: "none",
            ...sparkleProps.style,
          }}
        />
      ) : null}

      {tear ? (
        <TornPaperCanvas
          {...tear}
          progress={tearProgress}
          motion={tearMotion}
          className={tearClassName ?? tear.className}
          style={{
            ...fillLayerStyle,
            pointerEvents: "none",
            ...tear.style,
          }}
        />
      ) : null}

      {children ? (
        <div
          className={contentClassName}
          style={{
            ...fillLayerStyle,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
