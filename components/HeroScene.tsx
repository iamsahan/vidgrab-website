"use client";

import { useEffect, useRef } from "react";

const palettes: [string, string][] = [
  ["#3b2f8f", "#f0743e"], ["#0f6b5f", "#a6e3c9"], ["#24325e", "#7b72ff"],
  ["#5a1f4a", "#ffb547"], ["#183a5c", "#5ec8e6"], ["#2a2350", "#c4b5fd"],
];
const labels = ["1080p · MP4", "4K · MP4", "720p · MP4", "Audio · M4A", "1440p · MP4", "480p · MP4"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Video frames stream along a ribbon into a glowing ring: downloads arriving on the Mac. */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        return; // No WebGL: the hero still reads fine without the scene.
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 15);

      const textures = palettes.map(([a, b], i) => {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 288;
        const g = c.getContext("2d")!;
        const gradient = g.createLinearGradient(0, 0, 512, 288);
        gradient.addColorStop(0, a);
        gradient.addColorStop(1, b);
        g.fillStyle = gradient;
        g.beginPath(); g.roundRect(0, 0, 512, 288, 26); g.fill();
        g.fillStyle = "rgba(255,255,255,.88)";
        g.beginPath(); g.moveTo(232, 112); g.lineTo(232, 176); g.lineTo(286, 144); g.closePath(); g.fill();
        g.fillStyle = "rgba(0,0,0,.45)";
        g.beginPath(); g.roundRect(20, 236, 148, 34, 8); g.fill();
        g.beginPath(); g.roundRect(330, 20, 162, 34, 8); g.fill();
        g.fillStyle = "#ffffff";
        g.font = "500 20px Menlo, monospace";
        g.fillText(`00:0${i}:${pad((i * 17) % 60)}:${pad((i * 7) % 25)}`, 30, 260);
        g.fillText(labels[i] ?? "", 342, 44);
        g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(20, 214, 472, 6);
        g.fillStyle = "#ffffff"; g.fillRect(20, 214, 120 + ((i * 53) % 330), 6);
        const texture = new THREE.CanvasTexture(c);
        texture.anisotropy = 4;
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      });

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(11, 7, -12),
        new THREE.Vector3(7.5, 4.2, -6),
        new THREE.Vector3(4.6, 1.8, -2),
        new THREE.Vector3(4.8, -0.8, 1),
        new THREE.Vector3(6.4, -2.6, 2.2),
      ]);
      const geometry = new THREE.PlaneGeometry(2.6, 1.46);
      const frames = Array.from({ length: 16 }, (_, i) => {
        const material = new THREE.MeshBasicMaterial({ map: textures[i % textures.length]!, transparent: true, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { offset: i / 16, spin: (Math.random() - 0.5) * 0.6 };
        scene.add(mesh);
        return mesh;
      });

      const end = curve.getPoint(1);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 16, 80), new THREE.MeshBasicMaterial({ color: 0x7b72ff, transparent: true, opacity: 0.9 }));
      ring.position.copy(end);
      scene.add(ring);
      const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffb547, transparent: true, opacity: 0.8 });
      const pulse = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.02, 8, 80), pulseMaterial);
      pulse.position.copy(end);
      scene.add(pulse);

      const dustPositions: number[] = [];
      for (let i = 0; i < 420; i++) {
        const p = curve.getPoint(Math.random());
        dustPositions.push(p.x + (Math.random() - 0.5) * 3.2, p.y + (Math.random() - 0.5) * 2.4, p.z + (Math.random() - 0.5) * 3);
      }
      const dust = new THREE.BufferGeometry();
      dust.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
      const particles = new THREE.Points(dust, new THREE.PointsMaterial({ color: 0x9a92ff, size: 0.045, transparent: true, opacity: 0.7, depthWrite: false }));
      scene.add(particles);

      const resize = () => {
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Ribbon on the right on wide screens, behind the text on phones.
        camera.position.x = w < 700 ? 4.2 : 0;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizer = new ResizeObserver(resize);
      resizer.observe(hero);

      const mouse = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        mouse.x = e.clientX / innerWidth - 0.5;
        mouse.y = e.clientY / innerHeight - 0.5;
      };
      addEventListener("pointermove", onPointer, { passive: true });

      let visible = true;
      const watcher = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; });
      watcher.observe(hero);

      let flow = 0;
      let last = performance.now();
      const render = (now: number) => {
        // A rAF timestamp can be slightly earlier than the performance.now() taken before it;
        // never let time run backwards.
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        const scrolled = Math.min(1, scrollY / Math.max(1, hero.clientHeight));
        flow += dt * (0.045 + scrolled * 0.12);
        for (const mesh of frames) {
          const { offset, spin } = mesh.userData as { offset: number; spin: number };
          // Always within [0, 1): getPoint outside that range reads past the curve's points.
          const t = (((offset + flow) % 1) + 1) % 1;
          mesh.position.copy(curve.getPoint(t));
          mesh.scale.setScalar(Math.max(0.2, 1.15 - t * 0.85));
          mesh.rotation.set(-0.15 + t * 0.2, -0.55 + t * 0.4 + spin * (1 - t), spin * 0.3);
          mesh.material.opacity = Math.min(1, t * 6) * Math.min(1, (1 - t) * 5);
        }
        ring.rotation.z += dt * 0.6;
        const beat = (now / 1400) % 1;
        pulse.scale.setScalar(1 + beat * 0.9);
        pulseMaterial.opacity = 0.8 * (1 - beat);
        particles.rotation.y = Math.sin(now / 6000) * 0.08;
        camera.position.y += (-mouse.y * 1.2 - camera.position.y) * 0.04;
        camera.position.z = 15 + scrolled * 2;
        camera.lookAt(camera.position.x * 0.6 + mouse.x * 1.4, 0.4, 0);
        renderer.render(scene, camera);
      };

      let frame = 0;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        flow = 0.32;
        render(performance.now());
      } else {
        const loop = (now: number) => {
          if (visible) render(now); else last = now;
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        removeEventListener("pointermove", onPointer);
        resizer.disconnect();
        watcher.disconnect();
        geometry.dispose();
        dust.dispose();
        textures.forEach((t) => t.dispose());
        scene.traverse((object) => {
          const material = (object as { material?: { dispose(): void } }).material;
          material?.dispose();
        });
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
