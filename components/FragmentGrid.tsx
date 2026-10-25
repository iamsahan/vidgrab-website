"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

const SIZE = 6;
const STEP = 1.16;

/**
 * An isometric grid of glowing boxes standing for the fragments VidGrab downloads in parallel.
 * A sweep lights them up in turn like fragments completing; boxes under the pointer rise.
 */
export function FragmentGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.set(9, 9.5, 9);
      camera.lookAt(0, 0.4, 0);

      const half = ((SIZE - 1) * STEP) / 2;
      const violet = new THREE.Color("#a855f7");
      const blue = new THREE.Color("#60a5fa");
      const amber = new THREE.Color("#ffb547");
      const ink = new THREE.Color("#0a0c1a");
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);

      type Box = {
        mesh: InstanceType<typeof THREE.Mesh>;
        face: InstanceType<typeof THREE.MeshBasicMaterial>;
        edge: InstanceType<typeof THREE.LineBasicMaterial>;
        base: InstanceType<typeof THREE.Color>;
        i: number;
        j: number;
        lift: number;
      };
      const boxes: Box[] = [];
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const base = violet.clone().lerp(blue, (i + j) / (2 * (SIZE - 1)));
          const face = new THREE.MeshBasicMaterial({ color: ink.clone() });
          const edge = new THREE.LineBasicMaterial({ color: base.clone(), transparent: true, opacity: 0.9 });
          const mesh = new THREE.Mesh(boxGeometry, face);
          mesh.position.set(i * STEP - half, 0.5, j * STEP - half);
          mesh.add(new THREE.LineSegments(edgeGeometry, edge));
          mesh.userData.index = boxes.length;
          scene.add(mesh);
          boxes.push({ mesh, face, edge, base, i, j, lift: 0 });
        }
      }

      // Glowing floor under the grid.
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 256;
      const g = glowCanvas.getContext("2d")!;
      const radial = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      radial.addColorStop(0, "rgba(96,165,250,0.95)");
      radial.addColorStop(0.45, "rgba(124,92,255,0.55)");
      radial.addColorStop(1, "rgba(124,92,255,0)");
      g.fillStyle = radial;
      g.fillRect(0, 0, 256, 256);
      const glowTexture = new THREE.CanvasTexture(glowCanvas);
      const floorMaterial = new THREE.MeshBasicMaterial({ map: glowTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(SIZE * STEP * 1.9, SIZE * STEP * 1.9), floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.01;
      scene.add(floor);

      // Sparse dust around the scene.
      const dustPositions: number[] = [];
      for (let k = 0; k < 360; k++) {
        dustPositions.push((Math.random() - 0.5) * 22, Math.random() * 9 - 1, (Math.random() - 0.5) * 22);
      }
      const dust = new THREE.BufferGeometry();
      dust.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0x7c86ff, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false });
      const particles = new THREE.Points(dust, dustMaterial);
      scene.add(particles);

      const resize = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h, false);
        const aspect = w / h;
        const view = w < 700 ? 13 : 11.5;
        camera.left = (-view * aspect) / 2;
        camera.right = (view * aspect) / 2;
        camera.top = view / 2;
        camera.bottom = -view / 2;
        // Shift the grid to the right on wide screens, leaving room for the copy on the left.
        camera.position.set(9 - (w > 900 ? aspect * 2.2 : 0), 9.5, 9 + (w > 900 ? aspect * 2.2 : 0));
        camera.lookAt(w > 900 ? -aspect * 1.6 : 0, w > 900 ? -0.6 : 0.4, w > 900 ? aspect * 1.6 : 0);
        camera.updateProjectionMatrix();
      };
      resize();
      const resizer = new ResizeObserver(resize);
      resizer.observe(stage);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2(-10, -10);
      let hovered: Box | null = null;
      const onPointer = (event: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
      };
      const onLeave = () => pointer.set(-10, -10);
      stage.addEventListener("pointermove", onPointer);
      stage.addEventListener("pointerleave", onLeave);

      let visible = true;
      const watcher = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; });
      watcher.observe(stage);

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const meshes = boxes.map((b) => b.mesh);
      const glow = new THREE.Color();
      const render = (time: number) => {
        const t = time / 1000;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        hovered = hit ? boxes[hit.object.userData.index as number] ?? null : null;

        // The sweep travels corner to corner every few seconds, like fragments completing.
        const sweep = reduced ? 0.55 : ((t * 0.22) % 1.5) - 0.2;
        for (const box of boxes) {
          const phase = (box.i + box.j) / (2 * (SIZE - 1));
          const since = sweep - phase;
          const lit = since > 0 && since < 0.32 ? Math.sin((since / 0.32) * Math.PI) : 0;
          let hover = 0;
          if (hovered) {
            const distance = Math.hypot(box.i - hovered.i, box.j - hovered.j);
            hover = Math.max(0, 1 - distance / 2.4);
          }
          const target = hover * 1.1 + lit * 0.32;
          box.lift += (target - box.lift) * 0.12;
          box.mesh.position.y = 0.5 + box.lift;
          glow.copy(box.base).lerp(amber, lit * 0.85).lerp(new THREE.Color("#ffffff"), hover * 0.35);
          box.edge.color.copy(glow);
          box.edge.opacity = 0.75 + Math.max(lit, hover) * 0.25;
          box.face.color.copy(ink).lerp(glow, 0.06 + lit * 0.22 + hover * 0.18);
        }
        particles.rotation.y = t * 0.02;
        floorMaterial.opacity = 0.85 + Math.sin(t * 1.4) * 0.12;
        renderer.render(scene, camera);
      };

      let frame = 0;
      const loop = (now: number) => {
        if (visible) render(now);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizer.disconnect();
        watcher.disconnect();
        stage.removeEventListener("pointermove", onPointer);
        stage.removeEventListener("pointerleave", onLeave);
        boxGeometry.dispose();
        edgeGeometry.dispose();
        dust.dispose();
        glowTexture.dispose();
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

  return (
    <section className="fragments-section" aria-labelledby="fragments-title">
      <div className="fragments-stage">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="wrap fragments-copy">
        <div className="fragments-main">
          <span className="eyebrow">Under the hood</span>
          <h2 id="fragments-title">Every stream, split eight ways.</h2>
          <p className="fragments-tags">HLS <span>\</span> DASH <span>\</span> MP4 <span>\</span> 4K <span>\</span> M4A</p>
        </div>
        <div className="fragments-side">
          <p>Each video downloads as parallel fragments. If the connection drops, VidGrab asks what already arrived and carries on from there.</p>
          <div className="cta-row">
            <a className="btn ghost-dark" href={site.repo} target="_blank" rel="noopener noreferrer">View source</a>
            <Link className="btn plus" href="/download/">Get VidGrab <span aria-hidden="true">+</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
