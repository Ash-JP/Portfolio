"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Timing constants ─────────────────────────────────────────────────────────
const INTRO_DELAY   = 3.0;   // seconds: waits for logo to shrink & dissolve
const GROW_DURATION = 4.2;   // seconds: smooth expansion & drift into background

// Floating ambient particles for spatial depth
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#c4b5fd"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Single Unified Persistent Sculpture ──────────────────────────────────────
function UnifiedSculpture({
  introComplete,
  activePage,
}: {
  introComplete: boolean;
  activePage: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const spinAngle = useRef({ x: 0, y: 0 });

  // Direct window mouse listener ensures accurate, fluid tracking even with pointer-events-none
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Normalized coordinates: -1 (left/bottom) to +1 (right/top)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.x = x;
      mousePos.current.y = y;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;

    // Phase 0: While logo is displaying and collapsing, keep sculpture hidden
    if (elapsed < INTRO_DELAY && !introComplete) {
      meshRef.current.scale.set(0, 0, 0);
      meshRef.current.position.set(0, 0, 1.2);
      return;
    }

    // ── Target spatial anchor: positioned right behind the left profile / resume area ──
    // Shifted slightly to the right (-0.95) and slightly down vertically (-0.25)
    let sectionOffsetX = -0.95;
    let sectionOffsetY = -0.25;
    let sectionOffsetZ = -0.75;
    let sectionTargetScale = 1.42; // slightly decreased from 1.65 for refined proportions

    if (activePage === "projects") {
      sectionOffsetX = -0.85;
      sectionOffsetY = -0.15;
      sectionOffsetZ = -0.80;
      sectionTargetScale = 1.38;
    } else if (activePage === "contact") {
      sectionOffsetX = -0.75;
      sectionOffsetY = -0.30;
      sectionOffsetZ = -0.70;
      sectionTargetScale = 1.45;
    }

    // Normalized mouse positions (-1 to +1)
    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    // ── Accurate, slight yet noticeable cursor parallax offsets ───────────────
    // Translates ±0.45 on X, ±0.35 on Y, ±0.15 depth shift on Z
    const cursorOffsetX = mx * 0.45;
    const cursorOffsetY = my * 0.35;
    const cursorOffsetZ = mx * 0.15;

    const settledX = sectionOffsetX + cursorOffsetX;
    const settledY = sectionOffsetY + cursorOffsetY;
    const settledZ = sectionOffsetZ + cursorOffsetZ;

    let targetX: number;
    let targetY: number;
    let targetZ: number;
    let targetScale: number;

    // Calculate intro growth progress (0 to 1)
    const rawProgress = Math.min((elapsed - INTRO_DELAY) / GROW_DURATION, 1);
    const smoothProgress = rawProgress * rawProgress * (3 - 2 * rawProgress); // Hermite curve

    if (!introComplete && smoothProgress < 1) {
      // ── During Intro: Expand from center (0, 0, 1.2) into the left section ──
      const startX = 0;
      const startY = 0;
      const startZ = 1.2;

      targetX = THREE.MathUtils.lerp(startX, settledX, smoothProgress);
      targetY = THREE.MathUtils.lerp(startY, settledY, smoothProgress);
      targetZ = THREE.MathUtils.lerp(startZ, settledZ, smoothProgress);
      targetScale = THREE.MathUtils.lerp(0.16, sectionTargetScale, smoothProgress);
    } else {
      // ── Settled Background Phase: Seamless continuation ─────────────────────
      targetX = settledX;
      targetY = settledY;
      targetZ = settledZ;
      targetScale = sectionTargetScale;
    }

    // Responsive, fluid lerp for cursor motion
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.07);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.07);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.07);

    const smoothedScale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06);
    meshRef.current.scale.set(smoothedScale, smoothedScale, smoothedScale);

    // ── Continuous spin + Responsive 3D Cursor Tilt ───────────────────────────
    spinAngle.current.x += delta * 0.16;
    spinAngle.current.y += delta * 0.20;

    // Dynamic 3D tilt towards cursor position (catches highlights dynamically)
    const cursorInfluence = introComplete || smoothProgress >= 0.8 ? 1.0 : smoothProgress;
    const targetRotX = spinAngle.current.x - my * (0.28 * cursorInfluence);
    const targetRotY = spinAngle.current.y + mx * (0.36 * cursorInfluence);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 1.2]} scale={0}>
        <torusKnotGeometry args={[1, 0.32, 128, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#24193b"
          emissive="#120a1f"
          emissiveIntensity={0.12}
          distort={0.25}
          speed={1.4}
          roughness={0.16}
          metalness={0.92}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

// ─── Exported ThreeDBackground Component ───────────────────────────────────────
interface ThreeDBackgroundProps {
  introComplete: boolean;
  activePage?: string;
}

export function ThreeDBackground({ introComplete, activePage = "home" }: ThreeDBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-80 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />

        {/* Left Key Light: Silk Lavender directed toward profile area */}
        <directionalLight position={[-6, 7, 5]}    intensity={3.4} color="#c4b5fd" />

        {/* Soft point light near the sculpture for gentle specular definition */}
        <pointLight position={[-1.0, 0, 2.5]}      intensity={2.0} color="#e9d5ff" distance={8} />

        {/* Deep Velvet Fill Light from right/rear */}
        <directionalLight position={[6, -6, -4]}   intensity={2.2} color="#7c3aed" />

        {/* Soft Pearlescent Highlight */}
        <pointLight position={[0, 3, 4]}           intensity={1.4} color="#f5f3ff" />

        {/* Single persistent mesh — framed behind the left profile section */}
        <UnifiedSculpture introComplete={introComplete} activePage={activePage} />

        <AmbientDust />
      </Canvas>
    </div>
  );
}
