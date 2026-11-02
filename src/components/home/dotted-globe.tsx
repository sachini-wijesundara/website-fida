"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import globeData from "./globe-dots.json";

function InstancedDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Set up the instanced mesh once
  useEffect(() => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const radius = 2.0;

    globeData.forEach((d, i) => {
      // Apply radius to the normalized coordinates
      matrix.setPosition(d[0] * radius, d[1] * radius, d[2] * radius);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Spin the entire globe group
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const customMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#CBD5E1") }, // Light silver-slate
      },
      vertexShader: `
        varying float vZ;
        void main() {
          vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vZ = worldPos.z;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vZ;
        void main() {
          if (vZ < -0.15) discard;
          // Smoothly fade the dots as they approach the curvature horizon
          float alpha = smoothstep(-0.15, 1.4, vZ) * 0.35;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, globeData.length]} material={customMaterial}>
        <sphereGeometry args={[0.007, 4, 4]} />
      </instancedMesh>
    </group>
  );
}

export default function DottedGlobe() {
  return (
    <div className="hero-globe">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent", pointerEvents: "none" }}
        dpr={[1, 1.25]}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: true,
          depth: false,
          stencil: false,
          precision: "mediump",
        }}
        performance={{ min: 0.5 }}
      >
        <InstancedDots />
      </Canvas>
      <div className="hero-globe__shine" />
    </div>
  );
}

