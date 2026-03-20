import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Full-page background canvas: soft glowing orbs + drifting star-dust particles
 * Sits behind all content, perfectly performance-safe (one shared, non-interactive canvas)
 */
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 40);

    // ── Star-dust particles ───────────────────────────────
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#10b981'),
      new THREE.Color('#06b6d4'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = 30 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 20;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.3 + Math.random() * 0.9;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Floating glowing orbs ──────────────────────────────
    const orbData = [];
    const orbColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#10b981', '#06b6d4', '#f59e0b'];
    for (let i = 0; i < 7; i++) {
      const geo = new THREE.SphereGeometry(1.2 + Math.random() * 1.4, 24, 24);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(orbColors[i % orbColors.length]),
        transparent: true,
        opacity: 0.12 + Math.random() * 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const spread = 28;
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.6,
        -10 + (Math.random() - 0.5) * 10,
      );
      scene.add(mesh);
      orbData.push({
        mesh,
        speed: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        amplitude: 1.5 + Math.random() * 2,
        originY: mesh.position.y,
      });
    }

    // ── Wireframe torus knot (subtle, deep background) ─────
    const torusGeo = new THREE.TorusKnotGeometry(6, 1.2, 120, 18);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'),
      wireframe: true,
      transparent: true,
      opacity: 0.055,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(16, -6, -25);
    scene.add(torus);

    // ── Ring geometry (top-left accent) ───────────────────
    const ringGeo = new THREE.TorusGeometry(7, 0.15, 12, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#8b5cf6'),
      transparent: true,
      opacity: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-18, 10, -20);
    ring.rotation.x = Math.PI * 0.3;
    scene.add(ring);

    // ── Mouse parallax ─────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    const handleMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    // ── Resize ─────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation loop ─────────────────────────────────────
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slowly rotate particle cloud
      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.008;

      // Float orbs
      orbData.forEach(({ mesh, speed, phase, amplitude, originY }) => {
        mesh.position.y = originY + Math.sin(t * speed + phase) * amplitude;
        mesh.position.x += Math.cos(t * speed * 0.5 + phase) * 0.003;
      });

      // Rotate torus & ring
      torus.rotation.x = t * 0.07;
      torus.rotation.y = t * 0.05;
      ring.rotation.z = t * 0.04;
      ring.rotation.y = t * 0.02;

      // Soft camera parallax
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 1.2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
