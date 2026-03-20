import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeWeekScene — compact 3D scene for the Timetable hero banner
 * 7 floating day-columns with animated class-block quads + particle field
 */
const ThreeWeekScene = ({ height = 110 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 300;
    const H = el.clientHeight || height;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
    camera.position.set(0, 0, 14);

    const dayColors = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4','#f97316'];
    const dayGroups = [];

    // 7 columns of stacked blocks
    for (let d = 0; d < 7; d++) {
      const group = new THREE.Group();
      const xPos = (d - 3) * 1.5;

      // Column header cap
      const capGeo = new THREE.BoxGeometry(1.1, 0.25, 0.15);
      const capMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(dayColors[d]),
        transparent: true, opacity: 0.75,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 2.6;
      group.add(cap);

      // Random class blocks per column
      const blockCount = 2 + Math.floor(Math.random() * 3);
      for (let b = 0; b < blockCount; b++) {
        const h = 0.45 + Math.random() * 0.45;
        const geo = new THREE.BoxGeometry(1.0, h, 0.15);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(dayColors[(d + b) % dayColors.length]),
          transparent: true,
          opacity: 0.55 + Math.random() * 0.3,
        });
        const block = new THREE.Mesh(geo, mat);
        block.position.y = 1.8 - b * 1.05;
        group.add(block);
      }

      group.position.x = xPos;
      group.position.y = 0;
      scene.add(group);
      dayGroups.push({ group, phase: (d / 7) * Math.PI * 2 });
    }

    // Highlight plane behind "today" column (index 4)
    const highlightGeo = new THREE.PlaneGeometry(1.3, 6.5);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#6366f1'), transparent: true, opacity: 0.07, side: THREE.DoubleSide,
    });
    const highlight = new THREE.Mesh(highlightGeo, highlightMat);
    highlight.position.set(1.5, 0, -0.1);
    scene.add(highlight);

    // Horizontal time-line
    const lineGeo = new THREE.BoxGeometry(12, 0.025, 0.05);
    const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#6366f1'), transparent: true, opacity: 0.5 });
    const timeLine = new THREE.Mesh(lineGeo, lineMat);
    timeLine.position.y = 0.3;
    scene.add(timeLine);

    // Small sphere on time-line
    const dotGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#6366f1') });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.y = 0.3;
    dot.position.x = -5.5;
    scene.add(dot);

    // Background particles
    const pCount = 150;
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const pPal = dayColors.map((c) => new THREE.Color(c));
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*20;
      pPos[i*3+1] = (Math.random()-0.5)*12;
      pPos[i*3+2] = (Math.random()-0.5)*4 - 3;
      const c = pPal[i % pPal.length];
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07, vertexColors: true, transparent: true,
      opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Float columns
      dayGroups.forEach(({ group, phase }) => {
        group.position.y = Math.sin(t * 0.6 + phase) * 0.25;
        group.rotation.y = Math.sin(t * 0.3 + phase) * 0.08;
      });

      // Slide dot along time-line
      dot.position.x = -5.5 + ((t * 0.6) % 11);

      // Pulse highlight
      highlightMat.opacity = 0.05 + Math.sin(t * 1.5) * 0.04;

      // Slow camera drift
      camera.position.y = Math.sin(t * 0.15) * 0.4;
      camera.lookAt(scene.position);

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

export default ThreeWeekScene;
