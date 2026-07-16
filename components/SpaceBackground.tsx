'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sections, SEP } from '@/content/sections';
import { useScroll } from './ScrollProvider';

/**
 * The entire Three.js scene. Mounted ONCE in the layout.
 * Its planet array is derived from `content/sections.ts` — add a section
 * there and a planet appears here automatically, in the right order.
 */
export default function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Read live scroll percent through a ref so the animation loop always
  // sees the latest value without re-running the (expensive) init effect.
  const { percent } = useScroll();
  const percentRef = useRef(0);
  percentRef.current = percent;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, w() / h(), 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w(), h());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight(0xffffff, 1.3);
    key.position.set(60, 40, 60);
    scene.add(key);
    const rim = new THREE.PointLight(0x88aaff, 0.5);
    rim.position.set(-80, -20, -40);
    scene.add(rim);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const verts: number[] = [];
    for (let i = 0; i < 6000; i++) {
      verts.push((Math.random() - 0.5) * 1600, (Math.random() - 0.5) * 1600, (Math.random() - 0.5) * 1600);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true }),
    );
    scene.add(stars);

    // One planet per section — DERIVED from the section list.
    const planets = sections.map((s, i) => {
      const p = s.planet;
      const geo = new THREE.SphereGeometry(p.size, 48, 48);
      const mat = new THREE.MeshPhongMaterial({
        color: p.color,
        shininess: p.earth ? 6 : 14,
        emissive: p.earth ? 0x0a1a3a : 0x000000,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.xOffset, p.yOffset, -i * SEP);
      scene.add(mesh);

      if (p.ring) {
        const rg = new THREE.RingGeometry(p.size * 1.5, p.size * 2.4, 64);
        const rm = new THREE.MeshBasicMaterial({
          color: p.ringColor ?? 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
        });
        const ring = new THREE.Mesh(rg, rm);
        ring.rotation.x = Math.PI / 2.3;
        ring.rotation.y = 0.3;
        mesh.add(ring);
      }

      if (p.earth) {
        const ag = new THREE.SphereGeometry(p.size * 1.06, 48, 48);
        const am = new THREE.MeshPhongMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide,
        });
        mesh.add(new THREE.Mesh(ag, am));
      }

      return { mesh, base: p.yOffset, spin: 0.0016 + Math.random() * 0.002, phase: i };
    });

    const START = 30; // camera z in front of the first planet
    const RANGE = (sections.length - 1) * SEP; // travel so the last planet is reached at scroll = 1
    let camZ = START;
    let raf = 0;

    const onResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    window.addEventListener('resize', onResize);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const sp = percentRef.current;

      const targetZ = START - sp * RANGE;
      camZ += (targetZ - camZ) * 0.08; // smoothing — never set position directly
      camera.position.z = camZ;
      camera.position.x += (Math.sin(sp * Math.PI) * 4 - camera.position.x) * 0.04;

      const t = Date.now() * 0.001;
      planets.forEach((p) => {
        p.mesh.rotation.y += p.spin;
        p.mesh.position.y = p.base + Math.sin(t + p.phase) * 0.6;
      });
      stars.rotation.y += 0.00016;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="space-bg" aria-hidden />;
}
