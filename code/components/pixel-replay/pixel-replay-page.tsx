import type { CSSProperties } from "react";
import styles from "./pixel-replay.module.css";

type Frame = {
  label: string;
  image: string;
  height: number;
};

function createFrames(dir: string, count: number, height: number, label: string): Frame[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `${label} frame ${index + 1}`,
    image: `${dir}/frame-${String(index).padStart(3, "0")}.png`,
    height,
  }));
}

const desktopFrames = createFrames("replay-desktop", 124, 900, "Desktop");
const mobileFrames = createFrames("replay-mobile", 145, 844, "Mobile");

function FrameStack({ frames }: { frames: Frame[] }) {
  return (
    <>
      {frames.map((frame, index) => (
        <section
          key={`${frame.label}-${frame.image}`}
          className={styles.frame}
          style={{ "--frame-height": `${frame.height}px` } as CSSProperties}
          aria-label={frame.label}
        >
          <div className={styles.stickyFrame}>
            <img src={`/reference/${frame.image}`} alt="" draggable={false} />
          </div>
          <span className={styles.frameIndex}>{String(index + 1).padStart(2, "0")}</span>
        </section>
      ))}
    </>
  );
}

export function PixelReplayPage() {
  return (
    <main className={styles.page} aria-label="Shopify Editions Winter 2026 pixel replay">
      <div className={styles.desktopReplay}>
        <FrameStack frames={desktopFrames} />
      </div>
      <div className={styles.mobileReplay}>
        <FrameStack frames={mobileFrames} />
      </div>
    </main>
  );
}
