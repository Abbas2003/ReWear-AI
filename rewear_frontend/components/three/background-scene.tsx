"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue } from "motion/react";

interface WavingLatticeProps {
  scrollProgress?: MotionValue<number> | number;
  isTabVisible: React.RefObject<boolean>;
}

function WavingLattice({ scrollProgress, isTabVisible }: WavingLatticeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);
  const pointerPos = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current || !isTabVisible.current) return;

    // Smoothly lerp pointer tracking for calm parallax
    pointerPos.current.x += (state.pointer.x - pointerPos.current.x) * 0.04;
    pointerPos.current.y += (state.pointer.y - pointerPos.current.y) * 0.04;

    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    const wirePos = wireframeRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    const wireArray = wirePos.array as Float32Array;
    const count = pos.count;

    // Get current hero scroll progress
    const sp =
      typeof scrollProgress === "number"
        ? scrollProgress
        : scrollProgress && "get" in scrollProgress
        ? scrollProgress.get()
        : 0;

    // Enhanced amplitude: visible soft folds reacting calmly to scroll and cursor
    const baseAmp = 0.52 + sp * 0.44;
    const mx = pointerPos.current.x * 0.42;
    const my = pointerPos.current.y * 0.32;

    for (let i = 0; i < count; i++) {
      const x = array[i * 3];
      const y = array[i * 3 + 1];

      // Multi-frequency smooth wave
      const wave =
        Math.sin(x * 0.36 + t * 0.28 + mx) * Math.cos(y * 0.28 + t * 0.22 + my) * baseAmp +
        Math.sin(x * 0.72 + y * 0.54 + t * 0.18) * 0.18;

      array[i * 3 + 2] = wave;
      wireArray[i * 3 + 2] = wave;
    }

    pos.needsUpdate = true;
    wirePos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Camera tilt and scroll translation
    state.camera.position.x = mx * 0.55;
    state.camera.position.y = my * 0.45 - sp * 0.7;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group rotation={[-Math.PI / 6.2, 0, 0]} position={[0, 0.4, -2.2]}>
      {/* Silk cloth base in paper ivory with rich soft shading */}
      <mesh ref={meshRef}>
        <planeGeometry args={[22, 15, 80, 56]} />
        <meshStandardMaterial
          color="#EFECE3"
          roughness={0.62}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fine architectural contour grid in ink black at 14% opacity */}
      <mesh ref={wireframeRef} position={[0, 0, 0.003]}>
        <planeGeometry args={[22, 15, 80, 56]} />
        <meshBasicMaterial
          color="#0E0E0E"
          wireframe={true}
          transparent={true}
          opacity={0.14}
          polygonOffset={true}
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
}

interface BackgroundSceneProps {
  scrollProgress?: MotionValue<number> | number;
}

export default function BackgroundScene({ scrollProgress }: BackgroundSceneProps) {
  const isTabVisible = useRef(true);

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisible.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 44 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Soft balanced ambient light */}
        <ambientLight intensity={0.55} />

        {/* Key light: bright ivory highlights along wave ridges */}
        <directionalLight position={[6, 8, 5]} intensity={1.15} color="#FFFDF7" />

        {/* Fill light: soft warm-gray contrast in wave valleys */}
        <directionalLight position={[-5, -4, 3]} intensity={0.5} color="#C4BEB0" />

        {/* Grazing top rim light */}
        <directionalLight position={[0, 6, 2]} intensity={0.25} color="#FFFFFF" />

        <WavingLattice scrollProgress={scrollProgress} isTabVisible={isTabVisible} />
      </Canvas>
    </div>
  );
}
