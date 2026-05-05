"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

export type TornPaperOrientation = "top" | "bottom";
export type TornPaperMode = "paper" | "dark";

type PaperPoint = {
  x: number;
  y: number;
};

export type TornPaperCanvasProps = {
  progress: number;
  motion?: number;
  fill?: string;
  mode?: TornPaperMode;
  orientation?: TornPaperOrientation;
  seed?: number;
  amplitude?: number;
  fiberDensity?: number;
  shadowStrength?: number;
  className?: string;
  surfaceClassName?: string;
  effectsClassName?: string;
  style?: CSSProperties;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function seededNoise(value: number) {
  const next = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return next - Math.floor(next);
}

function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
  const targetWidth = Math.max(1, Math.round(width * dpr));
  const targetHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

function sampleProfile(profile: number[], progress: number) {
  const index = progress * (profile.length - 1);
  const start = Math.floor(index);
  return mix(profile[start], profile[Math.min(profile.length - 1, start + 1)], index - start);
}

function makeTornEdge(width: number, height: number, progress: number, motion: number, seed: number, amplitude: number) {
  const count = 180;
  const eased = smoothStep(progress);
  const phase = motion * Math.PI * 7.6;
  const base = height * mix(0.46, 0.36, eased);
  const profile = [0.04, -0.03, 0.06, -0.08, 0.02, -0.1, 0.08, 0.02, -0.05, 0.09, -0.04, 0.01, -0.07, 0.05];

  const raw = Array.from({ length: count }, (_, index): PaperPoint => {
    const xProgress = index / (count - 1);
    const profileY = sampleProfile(profile, xProgress) * height * amplitude;
    const broad =
      Math.sin(xProgress * Math.PI * 4.6 + phase) * height * 0.025 * amplitude +
      Math.sin(xProgress * Math.PI * 9.4 - phase * 0.72) * height * 0.014 * amplitude;
    const fiber =
      Math.sin(xProgress * Math.PI * 41 + phase * 1.4) * height * 0.004 +
      (seededNoise(seed + index * 13 + Math.round(motion * 60) * 101) - 0.5) * height * 0.016 * amplitude;

    return {
      x: xProgress * width,
      y: base + profileY + broad + fiber,
    };
  });

  return raw.map((point, index, points) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    return {
      x: point.x,
      y: prev.y * 0.12 + point.y * 0.76 + next.y * 0.12,
    };
  });
}

function traceEdge(context: CanvasRenderingContext2D, points: PaperPoint[], offset = 0) {
  context.beginPath();
  context.moveTo(points[0]?.x ?? 0, (points[0]?.y ?? 0) + offset);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y + offset);
  }
}

function edgeYAt(points: PaperPoint[], x: number) {
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (x >= current.x && x <= next.x) {
      return mix(current.y, next.y, (x - current.x) / Math.max(next.x - current.x, 1));
    }
  }

  return points[points.length - 1]?.y ?? 0;
}

function fillTornShape(
  context: CanvasRenderingContext2D,
  points: PaperPoint[],
  width: number,
  height: number,
  orientation: TornPaperOrientation,
) {
  traceEdge(context, points);
  if (orientation === "top") {
    context.lineTo(width, 0);
    context.lineTo(0, 0);
  } else {
    context.lineTo(width, height);
    context.lineTo(0, height);
  }
  context.closePath();
}

function drawTornPaper(
  surface: HTMLCanvasElement,
  effects: HTMLCanvasElement,
  options: Required<Omit<TornPaperCanvasProps, "className" | "surfaceClassName" | "effectsClassName" | "style">>,
) {
  const rect = surface.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const dpr = window.devicePixelRatio || 1;
  const width = rect.width;
  const height = rect.height;
  const progress = clamp(options.progress);
  const motion = options.motion;
  const points = makeTornEdge(width, height, progress, motion, options.seed, options.amplitude);
  const phase = motion * Math.PI * 8;

  [surface, effects].forEach((canvas) => resizeCanvas(canvas, width, height, dpr));

  const surfaceContext = surface.getContext("2d");
  const effectsContext = effects.getContext("2d");
  if (!surfaceContext || !effectsContext) return;

  [surfaceContext, effectsContext].forEach((context) => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
  });

  fillTornShape(surfaceContext, points, width, height, options.orientation);
  surfaceContext.fillStyle = options.fill;
  surfaceContext.fill();

  surfaceContext.save();
  fillTornShape(surfaceContext, points, width, height, options.orientation);
  surfaceContext.clip();
  const glow = surfaceContext.createRadialGradient(width * 0.54, height * 0.28, 1, width * 0.54, height * 0.28, width * 0.62);
  glow.addColorStop(0, options.mode === "paper" ? "rgba(255,255,247,0.2)" : "rgba(255,255,255,0.055)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  surfaceContext.fillStyle = glow;
  surfaceContext.fillRect(0, 0, width, height);
  surfaceContext.restore();

  const edgeDirection = options.orientation === "top" ? 1 : -1;

  effectsContext.save();
  effectsContext.filter = "blur(9px)";
  effectsContext.strokeStyle = options.mode === "paper" ? `rgba(20,24,24,${0.12 * options.shadowStrength})` : `rgba(0,0,0,${0.24 * options.shadowStrength})`;
  effectsContext.lineWidth = options.mode === "paper" ? 24 : 20;
  effectsContext.lineCap = "round";
  traceEdge(effectsContext, points, 13 * edgeDirection);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.filter = "blur(1px)";
  effectsContext.strokeStyle = options.mode === "paper" ? "rgba(252,252,242,0.42)" : "rgba(220,220,206,0.16)";
  effectsContext.lineWidth = 5;
  traceEdge(effectsContext, points, -1 * edgeDirection);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.strokeStyle = options.mode === "paper" ? "rgba(255,255,247,0.64)" : "rgba(220,220,206,0.2)";
  effectsContext.lineWidth = 1.1;
  traceEdge(effectsContext, points);
  effectsContext.stroke();
  effectsContext.restore();

  if (options.mode === "paper") {
    const fiberCount = Math.round(220 * clamp(options.fiberDensity, 0, 2.5));
    for (let index = 0; index < fiberCount; index += 1) {
      const x = (seededNoise(options.seed + index * 23) * width + motion * 38 + width) % width;
      const edgeY = edgeYAt(points, x);
      const y = edgeY + (seededNoise(options.seed + index * 29) - 0.78) * 14 * edgeDirection + Math.sin(phase + index) * 0.5;
      const radius = 0.12 + seededNoise(options.seed + index * 31) * 0.45;
      effectsContext.globalAlpha = 0.022 + seededNoise(options.seed + index * 37) * 0.08;
      effectsContext.fillStyle = "#fbfbf1";
      effectsContext.beginPath();
      effectsContext.ellipse(x, y, radius * 1.9, radius * 0.72, seededNoise(options.seed + index * 41) * Math.PI, 0, Math.PI * 2);
      effectsContext.fill();
    }
    effectsContext.globalAlpha = 1;
  }
}

export function TornPaperCanvas({
  progress,
  motion = progress,
  fill = "#0b1428",
  mode = "paper",
  orientation = "top",
  seed = 1,
  amplitude = 1,
  fiberDensity = 1,
  shadowStrength = 1,
  className,
  surfaceClassName,
  effectsClassName,
  style,
}: TornPaperCanvasProps) {
  const surfaceRef = useRef<HTMLCanvasElement | null>(null);
  const effectsRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const effects = effectsRef.current;
    if (!surface || !effects) return undefined;

    const draw = () =>
      drawTornPaper(surface, effects, {
        progress,
        motion,
        fill,
        mode,
        orientation,
        seed,
        amplitude,
        fiberDensity,
        shadowStrength,
      });

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [amplitude, fiberDensity, fill, mode, motion, orientation, progress, seed, shadowStrength]);

  return (
    <div className={className} style={style} aria-hidden="true">
      <canvas ref={surfaceRef} className={surfaceClassName} />
      <canvas ref={effectsRef} className={effectsClassName} />
    </div>
  );
}
