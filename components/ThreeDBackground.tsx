"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Timing constants — must match IntroAnimation.tsx phases exactly
const INTRO_DELAY   = 2.5;  // seconds: when sculpture starts growing (after logo flows away)
const GROW_DURATION = 3.5;  // seconds: 2.5s → 6.0s total

// Floating ambient lavender particles for spatial depth
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 140;

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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#c084fc"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Sculptural element: starts microscopic, grows into background over GROW_DURATION seconds
function LuxurySculpture() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      const elapsed = state.clock.elapsedTime;

      // ── Growth progress: 0 before INTRO_DELAY, then 0 → 1 over GROW_DURATION ──
      const rawProgress = Math.max(
        0,
        Math.min((elapsed - INTRO_DELAY) / GROW_DURATION, 1)
      );
      // Smooth Hermite (ease-in-out) curve
      const smoothProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

      // ── Target resting position (follows mouse gently once settled) ──
      const settledX = (mouse.x * viewport.width)  / 6 + 1.6;
      const settledY = (mouse.y * viewport.height) / 6 - 0.4;
      const settledZ = -0.8;

      // ── Starting position: near center of screen, close to camera ──
      const startX = 0;
      const startY = 0;
      const startZ = 2.5; // close to camera so even tiny scale is visible

      // Interpolate position targets
      const currentTargetX = THREE.MathUtils.lerp(startX, settledX, smoothProgress);
      const currentTargetY = THREE.MathUtils.lerp(startY, settledY, smoothProgress);
      const currentTargetZ = THREE.MathUtils.lerp(startZ, settledZ, smoothProgress);

      // Smooth lag on position (feels organic)
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, currentTargetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, currentTargetY, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, currentTargetZ, 0.05);

      // ── Scale: starts near-invisible (0.04) → settles at background size (1.25) ──
      const targetScale = THREE.MathUtils.lerp(0.04, 1.25, smoothProgress);
      const currentScale = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        targetScale,
        0.04
      );
      meshRef.current.scale.set(currentScale, currentScale, currentScale);

      // ── Spin: fast micro-spin at start, slows to ambient rotation ──
      const spinSpeed = THREE.MathUtils.lerp(1.2, 0.15, smoothProgress);
      meshRef.current.rotation.x += delta * spinSpeed;
      meshRef.current.rotation.y += delta * (spinSpeed * 1.3);
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.1}>
      {/* Start at scale 0 — the useFrame above drives it up from 0.04 */}
      <mesh ref={meshRef} position={[0, 0, 2.5]} scale={0.04}>
        <torusKnotGeometry args={[1, 0.32, 128, 32, 2, 3]} />
        <MeshDistortMaterial
          color="#2e1065"
          distort={0.28}
          speed={1.4}
          roughness={0.16}
          metalness={0.92}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-55 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.45} />
        {/* Radiance Lavender Key Light */}
        <directionalLight position={[10, 10, 5]}   intensity={3.0} color="#c084fc" />
        {/* Deep Violet Fill Light */}
        <directionalLight position={[-10, -8, -5]} intensity={2.2} color="#8b5cf6" />
        {/* Soft Pearlescent Highlight */}
        <pointLight       position={[0, 4, 3]}     intensity={1.5} color="#f5f3ff" />
        <LuxurySculpture />
        <AmbientDust />
      </Canvas>
    </div>
  );
}
