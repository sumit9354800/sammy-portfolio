import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroSceneProps {
  intensity?: number;
  className?: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ intensity = 1.0, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Group for all rotating objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Inner Metallic Polyhedron Sculpture (Octahedron with bevel-like geometry)
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      metalness: 0.88,
      roughness: 0.22,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 2. Technical Wireframe Lattice
    const wireframeGeo = new THREE.IcosahedronGeometry(1.61, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x475569,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    mainGroup.add(wireframeMesh);

    // 3. Orbital Precision Rings
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.3,
    });

    const ring1Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ringGroup.add(ring2);

    // 4. Subtle Floating Technical Particles (Solid cold points)
    const particleCount = window.innerWidth < 768 ? 40 : 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 5. Lighting Setup (Solid directional & rim lights - strictly NO colored gradients)
    const ambientLight = new THREE.AmbientLight(0x181c24, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf1f5f9, 2.2 * intensity);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x334155, 1.2 * intensity);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x64748b, 1.8 * intensity);
    rimLight.position.set(0, 7, -5);
    scene.add(rimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    let animationFrameId: number;
    let isVisible = true;

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Base rotation
      mainGroup.rotation.y += delta * 0.18;
      mainGroup.rotation.x += delta * 0.08;

      // Mouse influence
      mainGroup.rotation.y += mouseX * 0.02;
      mainGroup.rotation.x += mouseY * 0.02;

      // Counter-rotating rings
      ring1.rotation.z += delta * 0.12;
      ring2.rotation.z -= delta * 0.15;

      // Slow particle drift
      particlePoints.rotation.y += delta * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  if (!hasWebGL) {
    return (
      <div className={`flex items-center justify-center border border-[#22252c] bg-[#121316] ${className}`}>
        <div className="text-center font-mono-code text-xs text-[#8b92a0]">
          <div className="w-16 h-16 mx-auto mb-2 border border-[#333842] flex items-center justify-center text-white">
            3D
          </div>
          METALLIC_GEOMETRY_ACTIVE
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="hero-3d-canvas-container"
      className={`relative w-full h-full pointer-events-none select-none ${className}`}
      aria-label="3D Futuristic Geometric Sculpture"
    />
  );
};
