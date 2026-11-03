"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const logoControls = useAnimationControls();
  const overlayControls = useAnimationControls();
  const glowControls = useAnimationControls();

  useEffect(() => {
    async function runSequence() {
      // ── Phase 1: AJP logo springs in (0 → 1.0s) ─────────────────────────
      await logoControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
      });

      // Glow pulses behind the logo once it lands
      glowControls.start({
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.75, 0.4],
        transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
      });

      // Hold the logo for 0.5s so the user can read it
      await new Promise<void>((r) => setTimeout(r, 500));

      // ── Phase 2: Logo flows toward background (1.5 → 2.5s) ───────────────
      // Glow fades as logo moves away
      glowControls.stop();
      await Promise.all([
        logoControls.start({
          scale: 0.14,
          x: "22vw",
          y: "-10vh",
          opacity: 0,
          transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
        }),
        glowControls.start({
          opacity: 0,
          transition: { duration: 0.6 },
        }),
      ]);

      // ── Phase 3: Wait for 3D sculpture to grow (2.5 → 6.0s = 3.5s) ───────
      await new Promise<void>((r) => setTimeout(r, 3500));

      // ── Phase 4: Overlay dissolves — merge complete (6.0 → 7.0s) ─────────
      await overlayControls.start({
        opacity: 0,
        transition: { duration: 1.0, ease: "easeOut" },
      });

      onComplete();
    }

    runSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      animate={overlayControls}
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#09070f] flex items-center justify-center overflow-hidden"
    >
      {/* Radial purple aura behind logo */}
      <motion.div
        animate={glowControls}
        initial={{ opacity: 0, scale: 0.8 }}
        className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(109,40,217,0.12) 45%, transparent 70%)",
        }}
      />

      {/* Subtle noise grain overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* AJP logo */}
      <motion.div
        animate={logoControls}
        initial={{ opacity: 0, scale: 0.72, y: 32 }}
        className="relative z-10 select-none"
        style={{ willChange: "transform, opacity" }}
      >
        <span
          className="font-black tracking-[0.3em] text-transparent bg-clip-text
                     bg-gradient-to-b from-white via-purple-100 to-purple-400/70
                     font-[family-name:var(--font-syne)]"
          style={{ fontSize: "clamp(72px, 16vw, 160px)" }}
        >
          AJP
        </span>

        {/* Hairline underline that draws in after the letter spring lands */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 h-px w-full origin-left bg-gradient-to-r from-purple-400/80 via-violet-400/50 to-transparent"
        />
      </motion.div>

      {/* Skip button — bottom-right */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-[11px] font-mono uppercase
                   tracking-[0.2em] text-purple-300/40 hover:text-purple-300/80
                   transition-colors duration-300 flex items-center gap-1.5"
      >
        Skip
        <span className="text-purple-500/60">→</span>
      </button>
    </motion.div>
  );
}

