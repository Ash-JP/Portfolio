"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const logoControls     = useAnimationControls();
  const gradientControls = useAnimationControls();

  // Keep a stable ref to onComplete to prevent re-triggering the sequence if parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;

    async function runSequence() {
      // ── Phase 1: Logo springs in over the twilight ambient gradient (0s → 1.2s) ──
      await logoControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
      });

      if (cancelled) return;

      // ── Phase 2: Hold logo clearly visible (1.2s → 2.2s) ──────────────────────────
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      if (cancelled) return;

      // ── Phase 3: Logo shrinks inward into the center point (2.2s → 3.0s) ──────────
      // Exactly matching the video: collapses down to scale 0.15 at center
      await logoControls.start({
        opacity: 0,
        scale: 0.15,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      });

      if (cancelled) return;

      // ── Phase 4: 3D component unfolds at center (at 3.0s) ─────────────────────────
      // The lighter gradient background smoothly dissolves into the obsidian base
      // while the 3D sculpture expands and merges into the background (3.0s → 7.2s)
      gradientControls.start({
        opacity: 0,
        transition: { duration: 4.2, ease: [0.25, 0.1, 0.25, 1] },
      });

      // Wait for the 3D sculpture expansion and merge to complete
      await new Promise<void>((resolve) => setTimeout(resolve, 4300));
      if (cancelled) return;

      // ── Phase 5: Merge completed → reveal user details and content ────────────────
      onCompleteRef.current?.();
    }

    runSequence();
    return () => {
      cancelled = true;
    };
  }, [logoControls, gradientControls]);

  return (
    <>
      {/* ── Lighter Twilight Gradient Background Layer (z-0: BEHIND 3D canvas at z-[1]) ── */}
      <motion.div
        animate={gradientControls}
        initial={{ opacity: 1 }}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 50% 50%, rgba(67, 52, 107, 0.55) 0%, rgba(53, 42, 84, 0.45) 30%, rgba(30, 25, 48, 0.90) 65%, #13111e 100%)",
        }}
      />

      {/* ── Foreground Logo Layer (z-50: IN FRONT OF 3D canvas) ─────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* AJP Logo in Pearlescent Silk Lilac */}
        <motion.div
          animate={logoControls}
          initial={{ opacity: 0, scale: 0.74, y: 28 }}
          className="relative z-10 flex flex-col items-center select-none"
          style={{ willChange: "transform, opacity" }}
        >
          <span
            className="font-black tracking-[0.32em] text-transparent bg-clip-text
                       bg-gradient-to-b from-[#f5f3ff] via-[#d4cee2] to-[#9893ad]
                       font-[family-name:var(--font-syne)] drop-shadow-[0_0_40px_rgba(152,147,173,0.45)]"
            style={{ fontSize: "clamp(72px, 16vw, 150px)" }}
          >
            AJP
          </span>

          {/* Glowing hairline accent underline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 h-[2px] w-full origin-center
                       bg-gradient-to-r from-transparent via-[#d4cee2]/60 to-transparent shadow-[0_0_12px_rgba(212,206,226,0.6)]"
          />
        </motion.div>

        {/* Skip button for quick access */}
        <button
          onClick={() => onCompleteRef.current?.()}
          className="absolute bottom-8 right-8 pointer-events-auto text-[11px] font-mono
                     uppercase tracking-[0.22em] text-[#d4cee2]/60 hover:text-white
                     transition-all duration-300 px-3.5 py-1.5 rounded-full bg-[#1e1930]/60
                     border border-[#9893ad]/20 hover:border-[#d4cee2]/50 backdrop-blur-md shadow-[0_0_15px_rgba(53,42,84,0.3)]"
        >
          Skip →
        </button>
      </div>
    </>
  );
}
