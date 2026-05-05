"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import type { ScrollDirection } from "./use-scroll-stage-progress";

type SparkleParticle = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  depth: number;
  alpha: number;
  colorIndex: number;
  kind: "dot" | "glint" | "dust";
};

export type SparkleFieldCanvasProps = {
  progress: number;
  velocity?: number;
  direction?: ScrollDirection;
  density?: number;
  intensity?: number;
  twinkle?: number;
  scrollInfluence?: number;
  pointerInfluence?: number;
  seed?: number;
  colorPalette?: string[];
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_COLORS = ["#fff8d9", "#e8d4ff", "#bfe9ff", "#ffffff"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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

function makeParticles(width: number, height: number, density: number, seed: number, colorCount: number) {
  const area = width * height;
  const count = Math.round(clamp(area / 10000, 24, 190) * clamp(density, 0.15, 2.5));

  return Array.from({ length: count }, (_, index): SparkleParticle => {
    const base = seed + index * 17;
    const kindRoll = seededNoise(base + 5);
    return {
      x: seededNoise(base + 1),
      y: seededNoise(base + 2),
      radius: 0.45 + seededNoise(base + 3) * 2.4,
      phase: seededNoise(base + 4) * Math.PI * 2,
      speed: 0.08 + seededNoise(base + 6) * 0.42,
      depth: 0.25 + seededNoise(base + 7) * 0.95,
      alpha: 0.18 + seededNoise(base + 8) * 0.72,
      colorIndex: Math.floor(seededNoise(base + 9) * colorCount),
      kind: kindRoll > 0.92 ? "glint" : kindRoll > 0.55 ? "dust" : "dot",
    };
  });
}

function drawGlint(context: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, color: string) {
  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = Math.max(0.7, size * 0.18);
  context.beginPath();
  context.moveTo(x - size, y);
  context.lineTo(x + size, y);
  context.moveTo(x, y - size);
  context.lineTo(x, y + size);
  context.stroke();
  context.restore();
}

export function SparkleFieldCanvas({
  progress,
  velocity = 0,
  direction = 1,
  density = 1,
  intensity = 1,
  twinkle = 1,
  scrollInfluence = 1,
  pointerInfluence = 1,
  seed = 1,
  colorPalette = DEFAULT_COLORS,
  className,
  style,
}: SparkleFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const propsRef = useRef({
    progress,
    velocity,
    direction,
    intensity,
    twinkle,
    scrollInfluence,
    pointerInfluence,
    colorPalette,
  });

  useEffect(() => {
    propsRef.current = {
      progress,
      velocity,
      direction,
      intensity,
      twinkle,
      scrollInfluence,
      pointerInfluence,
      colorPalette,
    };
  }, [colorPalette, direction, intensity, pointerInfluence, progress, scrollInfluence, twinkle, velocity]);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2,
        y: (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2,
      };
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let frame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const dpr = window.devicePixelRatio || 1;

      resizeCanvas(canvas, width, height, dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (Math.round(width) !== lastWidth || Math.round(height) !== lastHeight || particlesRef.current.length === 0) {
        particlesRef.current = makeParticles(width, height, density, seed, colorPalette.length);
        lastWidth = Math.round(width);
        lastHeight = Math.round(height);
      }

      const { progress: currentProgress, velocity: currentVelocity, direction: currentDirection } = propsRef.current;
      const palette = propsRef.current.colorPalette.length > 0 ? propsRef.current.colorPalette : DEFAULT_COLORS;
      const currentIntensity = clamp(propsRef.current.intensity, 0, 3);
      const currentTwinkle = clamp(propsRef.current.twinkle, 0, 3);
      const pointer = pointerRef.current;
      const time = reducedMotion ? 0 : now * 0.001;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      particlesRef.current.forEach((particle, index) => {
        const localTime = time * particle.speed + particle.phase;
        const depth = particle.depth;
        const scrollDrift = currentProgress * height * 0.18 * propsRef.current.scrollInfluence * depth;
        const velocityDrift = clamp(Math.abs(currentVelocity) * 28, 0, 18) * currentDirection * depth;
        const pointerX = pointer.x * propsRef.current.pointerInfluence * depth * 18;
        const pointerY = pointer.y * propsRef.current.pointerInfluence * depth * 12;
        const waveX = Math.sin(localTime * 1.7 + index) * 10 * depth;
        const waveY = Math.cos(localTime * 1.2 + index * 0.7) * 8 * depth;

        const x = (particle.x * width + pointerX + waveX + width) % width;
        const y = (particle.y * height - scrollDrift + pointerY + waveY + velocityDrift + height * 2) % height;
        const pulse = 0.45 + Math.sin(localTime * (2.2 + currentTwinkle)) * 0.35 + seededNoise(index + seed * 19) * 0.2;
        const alpha = clamp(particle.alpha * pulse * currentIntensity, 0, 1);
        const color = palette[particle.colorIndex % palette.length] ?? DEFAULT_COLORS[0];
        const size = particle.radius * (0.8 + depth * 0.9);

        if (particle.kind === "glint") {
          drawGlint(context, x, y, size * 3.6, alpha * 0.42, color);
          return;
        }

        const gradient = context.createRadialGradient(x, y, 0, x, y, size * (particle.kind === "dust" ? 2.2 : 3.2));
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        context.globalAlpha = alpha * (particle.kind === "dust" ? 0.18 : 0.38);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, size * (particle.kind === "dust" ? 2 : 2.6), 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [colorPalette.length, density, seed]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
