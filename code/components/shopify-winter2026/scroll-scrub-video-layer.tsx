"use client";

import type { CSSProperties, VideoHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

export type ScrollScrubEasing = "linear" | "smooth";

export type ScrollScrubVideoLayerProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "controls" | "onProgress" | "src" | "style"
> & {
  src: string;
  progress: number;
  startProgress?: number;
  endProgress?: number;
  easing?: ScrollScrubEasing;
  className?: string;
  style?: CSSProperties;
  holdFirstFrame?: boolean;
  holdLastFrame?: boolean;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothStep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function mapProgressToScrubTime({
  progress,
  duration,
  startProgress = 0,
  endProgress = 1,
  easing = "linear",
}: {
  progress: number;
  duration: number;
  startProgress?: number;
  endProgress?: number;
  easing?: ScrollScrubEasing;
}) {
  const span = Math.max(endProgress - startProgress, 0.0001);
  const normalized = clamp01((progress - startProgress) / span);
  const eased = easing === "smooth" ? smoothStep(normalized) : normalized;
  return eased * Math.max(duration, 0);
}

export function ScrollScrubVideoLayer({
  src,
  progress,
  startProgress = 0,
  endProgress = 1,
  easing = "linear",
  className,
  style,
  holdFirstFrame = true,
  holdLastFrame = true,
  muted = true,
  playsInline = true,
  preload = "auto",
  ...videoProps
}: ScrollScrubVideoLayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef(0);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);
  const progressRef = useRef(progress);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const updateDuration = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    };

    updateDuration();
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);

    return () => {
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
    };
  }, [src]);

  useEffect(() => {
    targetTimeRef.current = mapProgressToScrubTime({
      progress,
      duration,
      startProgress,
      endProgress,
      easing,
    });
  }, [duration, easing, endProgress, holdFirstFrame, holdLastFrame, progress, startProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || duration <= 0) return undefined;

    smoothedTimeRef.current = targetTimeRef.current;

    const tick = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo) return;

      const liveProgress = progressRef.current;
      const beforeStart = liveProgress < startProgress;
      const afterEnd = liveProgress > endProgress;
      if ((beforeStart && !holdFirstFrame) || (afterEnd && !holdLastFrame)) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const targetTime = targetTimeRef.current;
      const deltaToTarget = targetTime - smoothedTimeRef.current;
      const catchup = Math.abs(deltaToTarget) > 0.45 ? 0.38 : 0.22;

      smoothedTimeRef.current += deltaToTarget * catchup;
      if (Math.abs(deltaToTarget) < 0.012) {
        smoothedTimeRef.current = targetTime;
      }

      const seekTime = Math.min(duration, Math.max(0, smoothedTimeRef.current));
      const seekDelta = Math.abs(currentVideo.currentTime - seekTime);

      if (seekDelta > 0.025) {
        try {
          if (typeof currentVideo.fastSeek === "function" && seekDelta > 0.18) {
            currentVideo.fastSeek(seekTime);
          } else {
            currentVideo.currentTime = seekTime;
          }
        } catch {
          // Some browsers can reject seeks while metadata is still settling.
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [duration, endProgress, holdFirstFrame, holdLastFrame, startProgress]);

  return (
    <video
      {...videoProps}
      ref={videoRef}
      src={src}
      className={className}
      style={style}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      controls={false}
      autoPlay={false}
    />
  );
}
