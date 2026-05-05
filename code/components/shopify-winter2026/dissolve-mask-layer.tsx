"use client";

import type { CSSProperties, ReactNode } from "react";

export type DissolveOrigin = {
  x: number;
  y: number;
};

export type DissolveMaskLayerProps = {
  progress: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  origin?: DissolveOrigin;
  softness?: number;
  drift?: number;
  grain?: number;
  invert?: boolean;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function pct(value: number) {
  return `${value.toFixed(3)}%`;
}

export function buildDissolveMaskStyle({
  progress,
  origin = { x: 50, y: 50 },
  softness = 16,
  drift = 0,
  grain = 1,
  invert = false,
}: {
  progress: number;
  origin?: DissolveOrigin;
  softness?: number;
  drift?: number;
  grain?: number;
  invert?: boolean;
}): CSSProperties {
  const eased = smoothStep(progress);
  const amount = invert ? 1 - eased : eased;
  const edge = amount * 142 - 18;
  const soft = Math.max(4, softness);
  const grainScale = clamp(grain, 0, 3);
  const driftX = Math.sin(amount * Math.PI * 2.1) * drift;
  const driftY = Math.cos(amount * Math.PI * 1.7) * drift * 0.62;
  const coreX = clamp(origin.x + driftX, -20, 120);
  const coreY = clamp(origin.y + driftY, -20, 120);
  const scatterA = edge - soft * (0.9 + grainScale * 0.28);
  const scatterB = edge + soft * (0.55 + grainScale * 0.22);
  const scatterC = edge + soft * (1.35 + grainScale * 0.38);

  const maskImage = [
    `radial-gradient(circle at ${pct(coreX)} ${pct(coreY)}, #000 0%, #000 ${pct(scatterA)}, rgba(0,0,0,.86) ${pct(edge)}, rgba(0,0,0,.28) ${pct(scatterB)}, transparent ${pct(scatterC)})`,
    `radial-gradient(circle at ${pct(coreX + 18)} ${pct(coreY - 12)}, #000 0%, rgba(0,0,0,.72) ${pct(edge - soft * 1.4)}, transparent ${pct(edge + soft * 0.72)})`,
    `radial-gradient(circle at ${pct(coreX - 22)} ${pct(coreY + 18)}, #000 0%, rgba(0,0,0,.52) ${pct(edge - soft * 1.2)}, transparent ${pct(edge + soft * 0.56)})`,
    `linear-gradient(110deg, rgba(0,0,0,${0.05 + amount * 0.95}) 0%, rgba(0,0,0,${amount}) 48%, rgba(0,0,0,${Math.max(0, amount - 0.08)}) 100%)`,
  ].join(", ");

  return {
    opacity: clamp(amount * 1.12),
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  };
}

export function DissolveMaskLayer({
  progress,
  children,
  className,
  style,
  origin,
  softness,
  drift,
  grain,
  invert,
}: DissolveMaskLayerProps) {
  return (
    <div
      className={className}
      style={{
        ...buildDissolveMaskStyle({
          progress,
          origin,
          softness,
          drift,
          grain,
          invert,
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
