"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { portfolioData } from "@/lib/data";

// Updated with reliable solid shapes for Mail and Github
const SVG_ICONS = {
  // Solid GitHub Cat Silhouette (The pure cat, not the circle with the hole!)
  github: `<svg viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" /></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 0 0-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.359 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>`
};

const iconKeys = Object.keys(SVG_ICONS) as Array<keyof typeof SVG_ICONS>;
const TOTAL_PARTICLES = 40000;
const VOLUME_DEPTH = 0.5;

// --- MORPHING VERTEX SHADER ---
const vertexShader = `
uniform float uTime;
uniform float uProgress;
attribute vec3 aTarget;
attribute float aRandom;

varying vec3 vViewPosition;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vec3 pos = mix(position, aTarget, uProgress);
    float dispersion = sin(uProgress * 3.14159);
    
    float nTime = uTime * 0.5;
    vec3 noisePos = vec3(
        snoise(vec3(position.y * 0.1, position.z * 0.1, nTime + aRandom * 10.0)),
        snoise(vec3(position.x * 0.1, position.z * 0.1, nTime + 20.0 + aRandom * 10.0)),
        snoise(vec3(position.x * 0.1, position.y * 0.1, nTime + 30.0 + aRandom * 10.0))
    );
    
    pos += noisePos * 0.2; 
    pos += noisePos * (dispersion * 15.0); 
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_PointSize = (0.8 * aRandom + 0.5) * (10.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uLightPos;

varying vec3 vViewPosition;

void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    
    vec3 normal = vec3(cxy, sqrt(1.0 - r));
    
    vec3 lightDir = normalize(uLightPos);
    float diffuse = max(0.0, dot(normal, lightDir));
    
    vec3 finalColor = uColor * (0.2 + 0.8 * diffuse);
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

function generateAllIconData() {
  const loader = new SVGLoader();
  const allPositions: Record<string, Float32Array> = {};
  const randoms = new Float32Array(TOTAL_PARTICLES);

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    randoms[i] = Math.random();
  }

  iconKeys.forEach((key) => {
    const svgData = loader.parse(SVG_ICONS[key as keyof typeof SVG_ICONS]);
    // IMPORTANT FIX: Instagram MUST have holes extracted to make the camera lens empty.
    // The Github SVG is highly complex (FontAwesome Octocat). If we use toShapes(true),
    // Three.js fails to calculate the intersecting subpaths and returns an empty array, 
    // causing a fallback to a generic square (which looks like Instagram!).
    // By passing 'false' for Github, we force it to render the solid silhouette and bypass the crash!
    const extractHoles = key === 'instagram';
    const shapeData = svgData.paths.flatMap(path => (path as any).toShapes(extractHoles).map((s: any) => s.extractPoints(12)));

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    shapeData.forEach(({ shape }) => {
      shape.forEach((p: any) => {
        if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
      });
    });

    if (minX === Infinity) {
      minX = 0; maxX = 24; minY = 0; maxY = 24;
      shapeData.push({
        shape: [new THREE.Vector2(0, 0), new THREE.Vector2(24, 0), new THREE.Vector2(24, 24), new THREE.Vector2(0, 24)],
        holes: []
      });
    }

    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    let validPoints = 0;
    const maxAttempts = TOTAL_PARTICLES * 500;

    const isPointInPolygon = (point: THREE.Vector2, polygon: THREE.Vector2[]) => {
      let isInside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
      }
      return isInside;
    };

    for (let attempts = 0; validPoints < TOTAL_PARTICLES && attempts < maxAttempts; attempts++) {
      const px = minX + Math.random() * (maxX - minX);
      const py = minY + Math.random() * (maxY - minY);
      const pz = (Math.random() - 0.5) * VOLUME_DEPTH;

      const point2D = new THREE.Vector2(px, py);
      let isInside = false;

      for (let i = 0; i < shapeData.length; i++) {
        const { shape, holes } = shapeData[i];
        if (isPointInPolygon(point2D, shape)) {
          let inHole = false;
          for (let j = 0; j < holes.length; j++) {
            if (isPointInPolygon(point2D, holes[j])) {
              inHole = true; break;
            }
          }
          if (!inHole) { isInside = true; break; }
        }
      }

      if (isInside) {
        const width = maxX - minX;
        const height = maxY - minY;
        const maxDim = Math.max(width, height) || 1;
        const scale = 24.0 / maxDim;

        const nx = (px - minX - width / 2) * scale;
        const ny = (py - minY - height / 2) * scale;

        positions[validPoints * 3] = nx;
        positions[validPoints * 3 + 1] = ny;
        positions[validPoints * 3 + 2] = pz;
        validPoints++;
      }
    }
    allPositions[key] = positions;
  });

  return { allPositions, randoms };
}

function MorphingSandIcon({ setCurrentIconIdx }: { setCurrentIconIdx: (idx: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const lastMorphTimeRef = useRef(0);
  const clockTimeRef = useRef(0);

  const currentIndexRef = useRef(0);

  const { allPositions, randoms } = useMemo(() => generateAllIconData(), []);

  const particlesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Wrapping the array in a `new Float32Array(...)` makes a true copy.
    // This stops the transition from mutating the original 'github' position data in memory!
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(allPositions[iconKeys[0]]), 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(new Float32Array(allPositions[iconKeys[0]]), 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.computeBoundingBox();

    return geo;
  }, [allPositions, randoms]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color("#c084fc") },
    uLightPos: { value: new THREE.Vector3(10, 10, 10) }
  }), []);

  const triggerMorph = () => {
    if (isAnimatingRef.current || !particlesGeometry) return;

    const nextIdx = (currentIndexRef.current + 1) % iconKeys.length;
    const targetAttribute = particlesGeometry.getAttribute('aTarget') as THREE.BufferAttribute;

    // Set the new target for the morph function to interpolate towards
    targetAttribute.array.set(allPositions[iconKeys[nextIdx]]);
    targetAttribute.needsUpdate = true;

    isAnimatingRef.current = true;
    setIsAnimating(true);
    lastMorphTimeRef.current = clockTimeRef.current;
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    clockTimeRef.current = t;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;

      if (isAnimatingRef.current) {
        let newProgress = materialRef.current.uniforms.uProgress.value + 0.015;

        if (newProgress >= 1) {
          newProgress = 0;
          isAnimatingRef.current = false;
          setIsAnimating(false);
          lastMorphTimeRef.current = t;

          const nextIdx = (currentIndexRef.current + 1) % iconKeys.length;
          const posAttribute = particlesGeometry.getAttribute('position') as THREE.BufferAttribute;

          // Set position to exactly match the target we just morphed into
          posAttribute.array.set(allPositions[iconKeys[nextIdx]]);
          posAttribute.needsUpdate = true;

          currentIndexRef.current = nextIdx;
          setCurrentIconIdx(nextIdx);
        }
        materialRef.current.uniforms.uProgress.value = newProgress;
      } else {
        // Auto-morphs every 3.5 seconds autonomously without needing user interaction
        if (t - lastMorphTimeRef.current >= 3.5) {
          triggerMorph();
        }
      }
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  // Ensure body cursor returns to auto if unmounted while hovering
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <group
      ref={groupRef}
      scale={[0.11, -0.11, 0.11]}
      onClick={triggerMorph}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <Center>
        <points geometry={particlesGeometry}>
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent={true}
            depthWrite={false}
          />
        </points>
      </Center>
    </group>
  );
}

export function IglooStyleIcons() {
  const [currentIconIdx, setCurrentIconIdx] = useState(0);

  const currentKey = iconKeys[currentIconIdx];
  const linkMap: Record<string, string> = {
    github: portfolioData.socials.github,
    linkedin: portfolioData.socials.linkedin,
    mail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolioData.contactEmail)}`,
    instagram: portfolioData.socials.instagram
  };

  const nameMap: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    mail: "Email",
    instagram: "Instagram"
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent rounded-xl">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <MorphingSandIcon setCurrentIconIdx={setCurrentIconIdx} />
      </Canvas>
      <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">
          Auto-Morphing · Click to Cycle
        </p>
        <a
          href={linkMap[currentKey]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 font-bold tracking-widest uppercase hover:text-purple-300 transition-colors flex items-center gap-1.5 text-sm"
        >
          {nameMap[currentKey]}
        </a>
      </div>
    </div>
  );
}