import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeHeroScene — compact inline 3D canvas for the Today hero banner
 * Shows an animated glowing ring with orbiting spheres and a pulsing core
 */
const ThreeHeroScene = ({ width = 280, height = 160 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || width;
    const H = el.clientHeight || height;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 12);

    // ── Central glowing sphere (pulsing core) ──────────────
    const coreGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Outer glow ring ────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(2.4, 0.06, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#8b5cf6'),
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // ── Second ring (tilted) ───────────────────────────────
    const ring2Geo = new THREE.TorusGeometry(3.5, 0.04, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'),
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI * 0.25;
    ring2.rotation.y = Math.PI * 0.1;
    scene.add(ring2);

    // ── Orbiting spheres on ring 1 ─────────────────────────
    const orbConfigs = [
      { r: 2.4, speed: 0.9, size: 0.18, color: '#f59e0b', phase: 0 },
      { r: 2.4, speed: 0.9, size: 0.13, color: '#10b981', phase: Math.PI * 0.66 },
      { r: 2.4, speed: 0.9, size: 0.15, color: '#ec4899', phase: Math.PI * 1.33 },
    ];

    // ── Orbiting dots on ring 2 ────────────────────────────
    const orb2Configs = [
      { r: 3.5, speed: 0.55, size: 0.1, color: '#a78bfa', phase: 0, tiltX: Math.PI * 0.25, tiltY: Math.PI * 0.1 },
      { r: 3.5, speed: 0.55, size: 0.1, color: '#06b6d4', phase: Math.PI, tiltX: Math.PI * 0.25, tiltY: Math.PI * 0.1 },
    ];

    const orbs = [...orbConfigs, ...orb2Configs].map((c) => {
      const g = new THREE.SphereGeometry(c.size, 16, 16);
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(c.color) });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);
      return { mesh, ...c };
    });

    // ── Floating background particles ──────────────────────
    const ptCount = 200;
    const ptPos = new Float32Array(ptCount * 3);
    const ptCol = new Float32Array(ptCount * 3);
    const ptPalette = ['#6366f1', '#8b5cf6', '#a78bfa', '#10b981'].map((h) => new THREE.Color(h));
    for (let i = 0; i < ptCount; i++) {
      ptPos[i * 3] = (Math.random() - 0.5) * 16;
      ptPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      ptPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 4;
      const c = ptPalette[i % ptPalette.length];
      ptCol[i * 3] = c.r; ptCol[i * 3 + 1] = c.g; ptCol[i * 3 + 2] = c.b;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    ptGeo.setAttribute('color', new THREE.BufferAttribute(ptCol, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, transparent: true,
      opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pts = new THREE.Points(ptGeo, ptMat);
    scene.add(pts);

    // ── Wireframe icosahedron (very faint bg shape) ────────
    const icoGeo = new THREE.IcosahedronGeometry(4.8, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'), wireframe: true,
      transparent: true, opacity: 0.06,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Resize observer ────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    // ── Animation ──────────────────────────────────────────
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Pulse core
      const pulse = 1 + Math.sin(t * 2.5) * 0.08;
      core.scale.setScalar(pulse);
      coreMat.opacity = 0.75 + Math.sin(t * 2.5) * 0.15;

      // Rotate rings
      ring.rotation.z = t * 0.4;
      ring.rotation.y = t * 0.15;
      ring2.rotation.z = -t * 0.28;
      ring2.rotation.x = Math.PI * 0.25 + Math.sin(t * 0.3) * 0.08;

      // Rotate icosahedron
      ico.rotation.x = t * 0.06;
      ico.rotation.y = t * 0.09;

      // Rotate pts
      pts.rotation.y = t * 0.05;

      // Move orbs along rings
      orbs.forEach((o) => {
        const angle = t * o.speed + o.phase;
        if (o.tiltX !== undefined) {
          // ring 2 orbs — apply ring2 tilt
          const x = Math.cos(angle) * o.r;
          const y = Math.sin(angle) * o.r;
          // rotate around x-axis then y-axis
          const cosX = Math.cos(o.tiltX), sinX = Math.sin(o.tiltX);
          const cosY = Math.cos(o.tiltY + t * 0.06), sinY = Math.sin(o.tiltY + t * 0.06);
          o.mesh.position.x = x * cosY + (y * sinX) * sinY;
          o.mesh.position.y = y * cosX;
          o.mesh.position.z = -x * sinY + (y * sinX) * cosY;
        } else {
          // ring 1 orbs — flat (matches ring rotation)
          o.mesh.position.x = Math.cos(angle + ring.rotation.z) * o.r;
          o.mesh.position.y = Math.sin(angle + ring.rotation.z) * o.r;
          o.mesh.position.z = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', minHeight: height }}
      aria-hidden="true"
    />
  );
};

export default ThreeHeroScene;
