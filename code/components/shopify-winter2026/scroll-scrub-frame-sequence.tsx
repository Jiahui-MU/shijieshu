"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";

type ScrollScrubFrameSequenceProps = {
  progress: number;
  frameCount: number;
  basePath: string;
  className?: string;
  style?: CSSProperties;
  startProgress?: number;
  endProgress?: number;
  easing?: "linear" | "smooth";
  extension?: "jpg" | "png" | "webp";
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothStep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function padFrame(value: number) {
  return String(value).padStart(4, "0");
}

function coverDrawImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
) {
  const imageRatio = imageWidth / imageHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imageRatio;
    offsetX = (canvasWidth - drawWidth) * 0.5;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imageRatio;
    offsetY = (canvasHeight - drawHeight) * 0.5;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

export function ScrollScrubFrameSequence({
  progress,
  frameCount,
  basePath,
  className,
  style,
  startProgress = 0,
  endProgress = 1,
  easing = "smooth",
  extension = "jpg",
}: ScrollScrubFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const progressRef = useRef(progress);
  const frameRef = useRef(0);
  const lastDrawnSignatureRef = useRef("");

  const frameUrls = useMemo(
    () =>
      Array.from({ length: frameCount }, (_, index) => `${basePath}/frame-${padFrame(index + 1)}.${extension}`),
    [basePath, extension, frameCount],
  );

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    imagesRef.current = Array.from({ length: frameCount }, () => null);
    loadedRef.current = Array.from({ length: frameCount }, () => false);
    let disposed = false;

    frameUrls.forEach((url, index) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = url;
      image.onload = () => {
        if (disposed) return;
        imagesRef.current[index] = image;
        loadedRef.current[index] = true;
      };
      image.onerror = () => {
        if (disposed) return;
        loadedRef.current[index] = false;
      };
    });

    return () => {
      disposed = true;
      imagesRef.current = [];
      loadedRef.current = [];
    };
  }, [frameCount, frameUrls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(Math.floor(canvas.clientWidth * ratio), 1);
      const height = Math.max(Math.floor(canvas.clientHeight * ratio), 1);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const draw = () => {
      resizeCanvas();

      const normalized = clamp01((progressRef.current - startProgress) / Math.max(endProgress - startProgress, 0.0001));
      const eased = easing === "smooth" ? smoothStep(normalized) : normalized;
      const desiredFrame = Math.min(frameCount - 1, Math.max(0, eased * (frameCount - 1)));
      const lowerIndex = Math.floor(desiredFrame);
      const upperIndex = Math.min(frameCount - 1, lowerIndex + 1);
      const blend = desiredFrame - lowerIndex;

      let primaryIndex = lowerIndex;
      if (!loadedRef.current[primaryIndex]) {
        for (let radius = 1; radius < frameCount; radius += 1) {
          const before = lowerIndex - radius;
          const after = lowerIndex + radius;
          if (before >= 0 && loadedRef.current[before]) {
            primaryIndex = before;
            break;
          }
          if (after < frameCount && loadedRef.current[after]) {
            primaryIndex = after;
            break;
          }
        }
      }

      let secondaryIndex = upperIndex;
      if (!loadedRef.current[secondaryIndex]) {
        secondaryIndex = primaryIndex;
      }

      const signature = `${primaryIndex}:${secondaryIndex}:${blend.toFixed(3)}:${canvas.width}x${canvas.height}`;
      if (lastDrawnSignatureRef.current !== signature) {
        const primaryImage = imagesRef.current[primaryIndex];
        const secondaryImage = imagesRef.current[secondaryIndex];
        if (primaryImage) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.globalAlpha = secondaryImage && secondaryIndex !== primaryIndex ? 1 - blend : 1;
          coverDrawImage(context, primaryImage, canvas.width, canvas.height, primaryImage.naturalWidth, primaryImage.naturalHeight);

          if (secondaryImage && secondaryIndex !== primaryIndex) {
            context.globalAlpha = blend;
            coverDrawImage(
              context,
              secondaryImage,
              canvas.width,
              canvas.height,
              secondaryImage.naturalWidth,
              secondaryImage.naturalHeight,
            );
          }

          context.globalAlpha = 1;
          lastDrawnSignatureRef.current = signature;
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [easing, endProgress, frameCount, startProgress]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
