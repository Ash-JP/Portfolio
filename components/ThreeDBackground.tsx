"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Follow mouse slowly
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      
      // Rotate slowly
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial 
          color="#10b981" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
    </Float>
  );
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-60">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <AbstractShape />
      </Canvas>
    </div>
  );
}
