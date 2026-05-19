import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero 3D background — vanilla Three.js (no R3F JSX) to keep it compatible with
 * the visual-edits babel plugin that injects JSX-source attributes.
 *
 * Scene swaps palette based on theme:
 *   - dark:  deep navy wireframe + cyan/blue particles, subtle deep vignette
 *   - light: navy/blue wireframe + cyan particles, airy vignette
 */
const PALETTES = {
  dark: {
    inner: 0x79c2cf, innerOpacity: 0.48,
    outer: 0x0767b3, outerOpacity: 0.18,
    primary: 0x00b5d5, secondary: 0x79c2cf,
    coolThreshold: 0.62,
    pointOpacity: 0.84,
    vignette:
      "radial-gradient(60% 50% at 50% 45%, rgba(8,6,86,0) 0%, rgba(8,6,86,0.52) 72%, rgba(5,3,56,0.95) 100%)",
  },
  light: {
    inner: 0x0767b3, innerOpacity: 0.46,
    outer: 0x79c2cf, outerOpacity: 0.28,
    primary: 0x00b5d5, secondary: 0x0767b3,
    coolThreshold: 0.57,
    pointOpacity: 0.78,
    vignette:
      "radial-gradient(60% 50% at 50% 45%, rgba(176,228,250,0) 0%, rgba(176,228,250,0.45) 70%, rgba(176,228,250,0.95) 100%)",
  },
};

export const HeroBackground = ({ theme = "light" }) => {
  const wrapRef = useRef(null);
  const vignetteRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const palette = PALETTES[theme] || PALETTES.light;
    if (vignetteRef.current) vignetteRef.current.style.background = palette.vignette;

    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const root = new THREE.Group();
    scene.add(root);

    const core = new THREE.Group();
    root.add(core);

    const innerGeom = new THREE.IcosahedronGeometry(1.7, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: palette.inner,
      wireframe: true,
      transparent: true,
      opacity: palette.innerOpacity,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    core.add(innerMesh);

    const outerGeom = new THREE.IcosahedronGeometry(2.6, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: palette.outer,
      wireframe: true,
      transparent: true,
      opacity: palette.outerOpacity,
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    core.add(outerMesh);

    const PARTICLES = 280;
    const posArr = new Float32Array(PARTICLES * 3);
    const colArr = new Float32Array(PARTICLES * 3);
    const cPrimary = new THREE.Color(palette.primary);
    const cSecondary = new THREE.Color(palette.secondary);
    for (let i = 0; i < PARTICLES; i++) {
      const r = 3.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      posArr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArr[i * 3 + 2] = r * Math.cos(phi);
      const useSecondary = Math.random() > palette.coolThreshold;
      const c = useSecondary ? cSecondary : cPrimary;
      colArr[i * 3 + 0] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    pGeom.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: palette.pointOpacity,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeom, pMat);
    root.add(points);

    const timer = new THREE.Timer();
    let frameId;
    const tick = () => {
      timer.update();
      const t = timer.getElapsed();
      core.rotation.x = t * 0.08;
      core.rotation.y = t * 0.12;
      const s = 1 + Math.sin(t * 0.6) * 0.04;
      core.scale.set(s, s, s);
      points.rotation.y = t * 0.05;
      points.rotation.x = Math.sin(t * 0.12) * 0.15;
      target.current.x += (mouse.current.x * 0.25 - target.current.x) * 0.04;
      target.current.y += (mouse.current.y * 0.25 - target.current.y) * 0.04;
      root.rotation.y = target.current.x;
      root.rotation.x = target.current.y;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    const onMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current.x = (cx / w) * 2 - 1;
      mouse.current.y = -((cy / h) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    const onVis = () => {
      if (document.hidden) {
        if (frameId) cancelAnimationFrame(frameId);
      } else {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      innerGeom.dispose();
      outerGeom.dispose();
      pGeom.dispose();
      innerMat.dispose();
      outerMat.dispose();
      pMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true" data-testid="hero-3d-canvas-wrapper">
      <div ref={wrapRef} className="absolute inset-0" />
      <div ref={vignetteRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default HeroBackground;
