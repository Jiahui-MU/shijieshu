"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./shopify-winter2026.module.css";

type SceneVariant = "hero" | "sidekick" | "agentic" | "retail" | "marketing" | "developer";

type RenaissanceThreeSceneProps = {
  variant: SceneVariant;
  progress: number;
  className?: string;
};

type Palette = {
  clear: THREE.ColorRepresentation;
  veilA: THREE.ColorRepresentation;
  veilB: THREE.ColorRepresentation;
  innerA: THREE.ColorRepresentation;
  innerB: THREE.ColorRepresentation;
  accent: THREE.ColorRepresentation;
  accentSoft: THREE.ColorRepresentation;
};

type TrackedMaterial = {
  material: THREE.Material & { opacity: number };
  baseOpacity: number;
};

type SceneRig = {
  group: THREE.Group;
  core: THREE.Object3D;
  rings: THREE.Object3D[];
  panels: THREE.Object3D[];
  ribbons: THREE.Object3D[];
  particles: THREE.Points;
  materials: TrackedMaterial[];
};

const palettes: Record<SceneVariant, Palette> = {
  hero: {
    clear: "#050505",
    veilA: "#697365",
    veilB: "#f0e5c2",
    innerA: "#111a10",
    innerB: "#e2d7b8",
    accent: "#fff4cf",
    accentSoft: "#98d8b7",
  },
  sidekick: {
    clear: "#dcdcce",
    veilA: "#d7d7c8",
    veilB: "#526366",
    innerA: "#18201b",
    innerB: "#f7f7ee",
    accent: "#f7f7ee",
    accentSoft: "#91dcb8",
  },
  agentic: {
    clear: "#050505",
    veilA: "#18100d",
    veilB: "#7b5138",
    innerA: "#090706",
    innerB: "#d6c0a8",
    accent: "#f7f7ee",
    accentSoft: "#b99b7d",
  },
  retail: {
    clear: "#050505",
    veilA: "#130f0c",
    veilB: "#9d8061",
    innerA: "#090909",
    innerB: "#56504b",
    accent: "#f2d09c",
    accentSoft: "#b79a78",
  },
  marketing: {
    clear: "#050505",
    veilA: "#23391f",
    veilB: "#b99755",
    innerA: "#07100b",
    innerB: "#dce4ba",
    accent: "#f7f7ee",
    accentSoft: "#d8ff70",
  },
  developer: {
    clear: "#dcdcce",
    veilA: "#d6ddd7",
    veilB: "#172c25",
    innerA: "#07100c",
    innerB: "#d9efe2",
    accent: "#9ee6cb",
    accentSoft: "#f7f7ee",
  },
};

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function makeOuterWorldTexture(variant: SceneVariant) {
  const palette = palettes[variant];
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, String(palette.veilB));
  gradient.addColorStop(0.44, variant === "retail" ? "#2f231b" : String(palette.veilA));
  gradient.addColorStop(1, String(palette.innerA));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const random = seededRandom(4100 + variant.length * 97);
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 34; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height * 0.82;
    const radius = 80 + random() * 240;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, "rgba(255, 248, 218, 0.23)");
    glow.addColorStop(0.5, "rgba(255, 248, 218, 0.06)");
    glow.addColorStop(1, "rgba(255, 248, 218, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "multiply";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(22, 24, 18, 0.18)";
  for (let i = 0; i < 28; i += 1) {
    const y = 110 + i * 26 + random() * 12;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= canvas.width; x += 54) {
      ctx.lineTo(x, y + Math.sin(x * 0.012 + i) * (18 + random() * 18));
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(247, 247, 238, 0.16)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const centerX = canvas.width * (0.2 + i * 0.16);
    const bottom = canvas.height * (0.88 + random() * 0.08);
    const width = 120 + random() * 90;
    const height = 260 + random() * 180;
    ctx.beginPath();
    ctx.moveTo(centerX - width * 0.5, bottom);
    ctx.bezierCurveTo(centerX - width * 0.5, bottom - height * 0.72, centerX + width * 0.5, bottom - height * 0.72, centerX + width * 0.5, bottom);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function makeTracked<T extends THREE.Material & { opacity: number }>(
  materials: TrackedMaterial[],
  material: T,
) {
  material.transparent = true;
  materials.push({ material, baseOpacity: material.opacity });
  return material;
}

function makeGlassMaterial(
  materials: TrackedMaterial[],
  color: THREE.ColorRepresentation,
  opacity: number,
  emissive: THREE.ColorRepresentation,
) {
  return makeTracked(
    materials,
    new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 0.2,
      metalness: 0.12,
      opacity,
      roughness: 0.34,
      side: THREE.DoubleSide,
      transparent: true,
    }),
  );
}

function addEdges(mesh: THREE.Mesh, materials: TrackedMaterial[], color: THREE.ColorRepresentation, opacity = 0.36) {
  const material = makeTracked(
    materials,
    new THREE.LineBasicMaterial({
      color,
      opacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), material);
  mesh.add(edges);
  return edges;
}

function addPanel(
  group: THREE.Group,
  materials: TrackedMaterial[],
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  color: THREE.ColorRepresentation,
  accent: THREE.ColorRepresentation,
  opacity = 0.34,
) {
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.045),
    makeGlassMaterial(materials, color, opacity, accent),
  );
  panel.position.set(x, y, z);
  panel.rotation.set(y * 0.05, x * -0.05, (x + y) * 0.015);
  addEdges(panel, materials, accent, 0.42);
  group.add(panel);
  return panel;
}

function addRibbon(
  group: THREE.Group,
  materials: TrackedMaterial[],
  color: THREE.ColorRepresentation,
  offset: number,
) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.9, -1.9 + offset, -1.1),
    new THREE.Vector3(-2.2, 1.2 - offset * 0.4, -2.6),
    new THREE.Vector3(0.4, -0.55 + offset, -1.2),
    new THREE.Vector3(2.4, 1.6 - offset, -3.6),
    new THREE.Vector3(4.9, -0.6 + offset * 0.25, -2.2),
  ]);
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 140, 0.022, 9, false),
    makeTracked(
      materials,
      new THREE.MeshBasicMaterial({
        color,
        opacity: 0.48,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  );
  group.add(mesh);
  return mesh;
}

function addTunnel(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const rings: THREE.Object3D[] = [];
  for (let index = 0; index < 15; index += 1) {
    const radius = 1.18 + index * 0.24;
    const tube = index % 3 === 0 ? 0.016 : 0.01;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, 180),
      makeTracked(
        materials,
        new THREE.MeshBasicMaterial({
          color: index % 2 ? palette.accentSoft : palette.accent,
          opacity: 0.18 + (index % 5) * 0.018,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );
    ring.position.z = -0.65 - index * 0.42;
    ring.rotation.z = index * 0.22;
    group.add(ring);
    rings.push(ring);
  }
  return rings;
}

function addParticleField(group: THREE.Group, materials: TrackedMaterial[], palette: Palette, variant: SceneVariant) {
  const count = variant === "hero" ? 1200 : 820;
  const random = seededRandom(7000 + variant.length * 113);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new THREE.Color(palette.accent);
  const colorB = new THREE.Color(palette.innerB);

  for (let index = 0; index < count; index += 1) {
    const depth = random() * 9.6;
    const angle = random() * Math.PI * 2 + depth * 0.58;
    const radius = 0.28 + random() * (2.4 + depth * 0.22);
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius * (0.72 + random() * 0.45);
    positions[index * 3 + 2] = -0.35 - depth;

    const color = colorA.clone().lerp(colorB, random() * 0.85);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    geometry,
    makeTracked(
      materials,
      new THREE.PointsMaterial({
        size: variant === "retail" ? 0.024 : 0.032,
        vertexColors: true,
        opacity: 0.72,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  );
  group.add(particles);
  return particles;
}

function addHeroArchitecture(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const architecture = new THREE.Group();
  const stone = makeGlassMaterial(materials, "#c7bf9f", 0.34, palette.accent);
  const columnGeometry = new THREE.CylinderGeometry(0.055, 0.075, 2.6, 18);
  const beamGeometry = new THREE.BoxGeometry(3.6, 0.08, 0.08);
  for (let index = 0; index < 5; index += 1) {
    const x = -1.8 + index * 0.9;
    const column = new THREE.Mesh(columnGeometry, stone);
    column.position.set(x, -0.7, -2.2 - index * 0.18);
    architecture.add(column);
  }
  for (let index = 0; index < 3; index += 1) {
    const beam = new THREE.Mesh(beamGeometry, stone);
    beam.position.set(0, 0.35 + index * 0.42, -2.15 - index * 0.4);
    beam.rotation.z = index % 2 ? 0.02 : -0.02;
    architecture.add(beam);
  }
  for (let index = 0; index < 8; index += 1) {
    const panel = addPanel(
      architecture,
      materials,
      Math.cos(index * 0.85) * (1.8 + (index % 3) * 0.28),
      Math.sin(index * 1.17) * 1.1,
      -1.1 - index * 0.38,
      0.74 + (index % 3) * 0.18,
      0.46 + (index % 2) * 0.18,
      "#f7f1da",
      palette.accent,
      0.24,
    );
    panel.rotation.z += index * 0.12;
  }
  group.add(architecture);
  return architecture;
}

function addSidekickObjects(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const cards = new THREE.Group();
  const rows = [
    [-1.55, 0.75, -1.05, 1.55, 0.36],
    [1.15, 0.16, -1.55, 1.85, 0.42],
    [-0.82, -0.5, -2.1, 2.1, 0.5],
    [1.6, -1.12, -2.8, 1.35, 0.32],
  ];
  rows.forEach(([x, y, z, width, height], index) => {
    const card = addPanel(cards, materials, x, y, z, width, height, "#f7f7ee", palette.accentSoft, index === 2 ? 0.48 : 0.38);
    for (let lineIndex = 0; lineIndex < 3; lineIndex += 1) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(width * (0.42 + lineIndex * 0.16), 0.018, 0.016),
        makeGlassMaterial(materials, index === 2 ? "#171717" : "#292919", 0.52, palette.accentSoft),
      );
      line.position.set(-width * 0.18, height * 0.14 - lineIndex * 0.1, 0.04);
      card.add(line);
    }
  });
  cards.rotation.set(-0.06, -0.16, -0.02);
  group.add(cards);
  return cards;
}

function addAgenticObjects(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const agentic = new THREE.Group();
  const catalog = new THREE.Group();
  for (let index = 0; index < 12; index += 1) {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const card = addPanel(
      catalog,
      materials,
      -1.65 + column * 1.1,
      0.92 - row * 0.72,
      -1.15 - index * 0.09,
      0.78,
      0.56,
      index % 3 === 0 ? "#f7f7ee" : "#c7b090",
      palette.accent,
      0.34,
    );
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.24, 0.02),
      makeGlassMaterial(materials, index % 2 ? "#7b4f37" : "#202018", 0.58, palette.accentSoft),
    );
    tile.position.set(-0.16, 0.08, 0.04);
    card.add(tile);
    const textLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.018, 0.018),
      makeGlassMaterial(materials, "#2b241d", 0.42, palette.accent),
    );
    textLine.position.set(0.08, -0.12, 0.04);
    card.add(textLine);
  }
  catalog.position.set(0.3, 0.2, -1.2);
  catalog.rotation.set(-0.5, -0.22, 0.2);
  agentic.add(catalog);

  const chat = addPanel(agentic, materials, 1.5, -1.1, -1.0, 2.0, 0.46, "#f7f7ee", palette.accentSoft, 0.58);
  for (let index = 0; index < 3; index += 1) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.68 - index * 0.08, 0.018, 0.018),
      makeGlassMaterial(materials, "#211912", 0.48, palette.accentSoft),
    );
    line.position.set(-0.34 + index * 0.08, 0.12 - index * 0.11, 0.04);
    chat.add(line);
  }

  const archMaterial = makeGlassMaterial(materials, "#8e6041", 0.28, palette.accent);
  for (let index = 0; index < 4; index += 1) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.2 + index * 0.32, 0.012, 8, 96, Math.PI), archMaterial);
    arch.position.set(-1.65, -0.2, -2.2 - index * 0.34);
    arch.rotation.set(0, Math.PI * 0.5, Math.PI * 0.5);
    agentic.add(arch);
  }
  agentic.rotation.set(-0.06, 0.16, -0.06);
  group.add(agentic);
  return agentic;
}

function addRetailObjects(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const hardware = new THREE.Group();
  const bodyMaterial = makeGlassMaterial(materials, "#222222", 0.92, palette.accent);
  const darkGlass = makeGlassMaterial(materials, "#050505", 0.68, palette.accentSoft);
  const hub = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.0, 0.32), bodyMaterial);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.66, 0.08), darkGlass);
  screen.position.set(-0.18, 0.05, 0.22);
  const dock = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.24, 0.34), bodyMaterial);
  dock.position.set(1.08, -0.44, 0.02);
  hardware.add(hub, screen, dock);

  const scanner = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.32, 0.22), bodyMaterial);
  scanner.position.set(-1.45, 0.92, -0.46);
  scanner.rotation.set(-0.34, 0.24, -0.24);
  hardware.add(scanner);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, -0.42, 0.16),
    new THREE.Vector3(-1.1, -0.9, -0.2),
    new THREE.Vector3(-2.1, -0.48, -0.7),
    new THREE.Vector3(-2.35, 0.55, -0.5),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 90, 0.025, 8, false),
    makeGlassMaterial(materials, "#111111", 0.72, palette.accent),
  );
  hardware.add(cable);
  hardware.position.set(0.58, 0.2, -1.72);
  hardware.rotation.set(-0.2, -0.34, -0.08);
  group.add(hardware);
  return hardware;
}

function addMarketingObjects(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const marketing = new THREE.Group();
  const billboardMaterial = makeGlassMaterial(materials, "#101010", 0.82, palette.accentSoft);
  const billboard = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.28, 0.12), billboardMaterial);
  billboard.position.set(0.85, 0.72, -1.5);
  billboard.rotation.set(-0.16, -0.34, 0.08);
  addEdges(billboard, materials, palette.accentSoft, 0.46);
  marketing.add(billboard);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.95, 1.0, 1, 1),
    makeGlassMaterial(materials, "#d8ff70", 0.42, palette.accentSoft),
  );
  screen.position.set(0, 0, 0.08);
  billboard.add(screen);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.075, 2.4, 18),
    makeGlassMaterial(materials, "#4f4834", 0.6, palette.accent),
  );
  pole.position.set(1.0, -1.02, -1.64);
  pole.rotation.z = -0.02;
  marketing.add(pole);

  for (let index = 0; index < 9; index += 1) {
    const angle = -0.9 + index * 0.22;
    const radius = 1.45 + (index % 3) * 0.32;
    const product = new THREE.Mesh(
      new THREE.BoxGeometry(0.35 + (index % 2) * 0.12, 0.22, 0.045),
      makeGlassMaterial(materials, index % 2 ? "#f7f7ee" : "#d8ff70", 0.44, palette.accentSoft),
    );
    product.position.set(Math.cos(angle) * radius - 1.2, Math.sin(angle) * 0.9 - 0.35, -0.7 - index * 0.18);
    product.rotation.set(0.12, -0.3 + index * 0.04, angle * 0.3);
    addEdges(product, materials, palette.accent, 0.3);
    marketing.add(product);
  }

  const pathMaterial = makeTracked(
    materials,
    new THREE.LineBasicMaterial({
      color: palette.accentSoft,
      opacity: 0.34,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  for (let index = 0; index < 4; index += 1) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, -1.2 + index * 0.28, -1.1),
      new THREE.Vector3(-0.4, 0.6 - index * 0.08, -2.0),
      new THREE.Vector3(1.9, 0.3 + index * 0.1, -1.5),
      new THREE.Vector3(3.1, -0.8 + index * 0.22, -2.8),
    ]);
    marketing.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), pathMaterial));
  }
  marketing.rotation.set(-0.04, -0.08, 0.02);
  group.add(marketing);
  return marketing;
}

function addDeveloperObjects(group: THREE.Group, materials: TrackedMaterial[], palette: Palette) {
  const dev = new THREE.Group();
  for (let index = 0; index < 10; index += 1) {
    const slab = addPanel(
      dev,
      materials,
      -2.8 + (index % 5) * 1.35,
      0.9 - Math.floor(index / 5) * 1.25,
      -1.2 - index * 0.24,
      0.9,
      0.72,
      index % 2 ? "#0b1b15" : "#e5f3e9",
      palette.accent,
      index % 2 ? 0.5 : 0.28,
    );
    for (let lineIndex = 0; lineIndex < 4; lineIndex += 1) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.46 + lineIndex * 0.08, 0.015, 0.018),
        makeGlassMaterial(materials, index % 2 ? "#9ee6cb" : "#102119", 0.58, palette.accent),
      );
      line.position.set(-0.18, 0.2 - lineIndex * 0.13, 0.04);
      slab.add(line);
    }
  }

  const connectionMaterial = makeTracked(
    materials,
    new THREE.LineBasicMaterial({
      color: palette.accent,
      opacity: 0.3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const points = [
    new THREE.Vector3(-2.8, 1.1, -0.9),
    new THREE.Vector3(-1.2, -0.3, -1.7),
    new THREE.Vector3(0.3, 0.9, -2.4),
    new THREE.Vector3(1.8, -0.55, -2.0),
    new THREE.Vector3(3.0, 0.65, -3.1),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  dev.add(new THREE.Line(geometry, connectionMaterial));
  dev.rotation.set(-0.04, 0.12, 0.02);
  group.add(dev);
  return dev;
}

function createInnerWorld(variant: SceneVariant): SceneRig {
  const palette = palettes[variant];
  const group = new THREE.Group();
  const materials: TrackedMaterial[] = [];
  const rings = addTunnel(group, materials, palette);
  const particles = addParticleField(group, materials, palette, variant);
  const ribbons = [
    addRibbon(group, materials, palette.accent, -0.32),
    addRibbon(group, materials, palette.accentSoft, 0.5),
  ];

  const core = new THREE.Mesh(
    variant === "retail" ? new THREE.OctahedronGeometry(0.48, 1) : new THREE.IcosahedronGeometry(0.58, 3),
    makeTracked(
      materials,
      new THREE.MeshStandardMaterial({
        color: palette.accent,
        emissive: palette.accent,
        emissiveIntensity: 0.36,
        metalness: 0.18,
        opacity: 0.82,
        roughness: 0.22,
        transparent: true,
        wireframe: variant !== "retail",
      }),
    ),
  );
  core.position.set(0.36, 0.05, -1.35);
  group.add(core);

  const panels: THREE.Object3D[] = [];
  if (variant === "hero") {
    panels.push(addHeroArchitecture(group, materials, palette));
  } else if (variant === "agentic") {
    panels.push(addAgenticObjects(group, materials, palette));
  } else if (variant === "retail") {
    panels.push(addRetailObjects(group, materials, palette));
  } else if (variant === "marketing") {
    panels.push(addMarketingObjects(group, materials, palette));
  } else if (variant === "developer") {
    panels.push(addDeveloperObjects(group, materials, palette));
  } else {
    panels.push(addSidekickObjects(group, materials, palette));
  }

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2;
    const radius = variant === "hero" ? 3.15 : 2.55;
    panels.push(
      addPanel(
        group,
        materials,
        Math.cos(angle) * radius,
        Math.sin(angle * 1.35) * 1.15,
        -1.4 - index * 0.42,
        0.58 + (index % 3) * 0.2,
        0.28 + (index % 2) * 0.16,
        variant === "retail" ? "#2c2a27" : "#f7f7ee",
        palette.accent,
        0.18,
      ),
    );
  }

  group.position.z = -2.4;
  return { group, core, rings, panels, ribbons, particles, materials };
}

function makeOuterMaterial(texture: THREE.Texture, palette: Palette) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uShellOpacity: { value: 1 },
      uEdgeFade: { value: 0 },
      uVeilA: { value: new THREE.Color(palette.veilA) },
      uVeilB: { value: new THREE.Color(palette.veilB) },
      uAccent: { value: new THREE.Color(palette.accent) },
    },
    vertexShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uMouse;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float reveal = smoothstep(0.02, 0.95, uProgress);
        float center = 1.0 - smoothstep(0.05, 0.74, distance(uv, vec2(0.5, 0.52)));
        float vertical = smoothstep(0.0, 1.0, reveal - uv.y * 0.72);
        float wave = sin(uv.x * 22.0 + uTime * 1.4) * 0.08 + sin(uv.y * 18.0 - uTime * 0.9) * 0.06;
        pos.z += (center * 1.85 + wave * 2.0) * reveal;
        pos.y -= vertical * reveal * (1.15 + center * 1.25);
        pos.x += (wave + uMouse.x * 0.16) * (0.25 + reveal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uProgress;
      uniform float uTime;
      uniform float uShellOpacity;
      uniform float uEdgeFade;
      uniform vec2 uMouse;
      uniform vec3 uVeilA;
      uniform vec3 uVeilB;
      uniform vec3 uAccent;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.05;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        float reveal = smoothstep(0.0, 1.0, uProgress);
        float turbulence = fbm(uv * 5.0 + vec2(uTime * 0.05, -uTime * 0.08));
        float detail = fbm(uv * 21.0 + turbulence + uMouse * 0.35);
        vec4 tex = texture2D(uTexture, uv + (detail - 0.5) * 0.028 * (0.4 + reveal));
        vec3 veil = mix(uVeilA, uVeilB, uv.y + turbulence * 0.24);
        vec3 color = mix(veil, tex.rgb, 0.56);

        vec2 center = vec2(0.5 + uMouse.x * 0.035, 0.52 + uMouse.y * 0.025);
        vec2 portalUv = (uv - center) * vec2(1.18, 1.0);
        float radius = mix(0.03, 0.66, reveal);
        float distortedDistance = length(portalUv) + (detail - 0.5) * 0.15;
        float hole = 1.0 - smoothstep(radius - 0.1, radius + 0.13, distortedDistance);
        float meltedDown = smoothstep(0.16, 0.92, reveal - uv.y * 0.72 + turbulence * 0.22);
        float streaks = smoothstep(0.62, 0.98, noise(vec2(uv.x * 38.0, uv.y * 3.0 - uTime * 0.18)));
        float drip = meltedDown * streaks * 0.55;
        float rim = 1.0 - smoothstep(0.0, 0.035, abs(distortedDistance - radius));
        color += uAccent * rim * (0.24 + reveal * 0.72);
        color += uAccent * drip * 0.16;
        color += uAccent * (1.0 - reveal) * 0.18 * (0.35 + turbulence);

        float alpha = 0.96 - hole * (0.74 + reveal * 0.28) - meltedDown * 0.28 - drip * 0.22;
        float edgeFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x) * smoothstep(0.0, 0.1, uv.y) * smoothstep(0.0, 0.1, 1.0 - uv.y);
        alpha *= mix(1.0, edgeFade, uEdgeFade);
        alpha = clamp(alpha, 0.0, 0.98) * uShellOpacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function makeInnerBackdropMaterial(palette: Palette) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uInnerA: { value: new THREE.Color(palette.innerA) },
      uInnerB: { value: new THREE.Color(palette.innerB) },
      uAccent: { value: new THREE.Color(palette.accent) },
    },
    vertexShader: `
      precision mediump float;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uReveal;
      uniform float uProgress;
      uniform vec2 uMouse;
      uniform vec3 uInnerA;
      uniform vec3 uInnerB;
      uniform vec3 uAccent;

      float line(float value, float width) {
        return 1.0 - smoothstep(0.0, width, abs(value));
      }

      void main() {
        vec2 uv = vUv;
        vec2 centered = uv - 0.5 + uMouse * 0.035;
        centered.x *= 1.55;
        float dist = length(centered);
        float angle = atan(centered.y, centered.x);
        float tunnel = line(sin(dist * 28.0 - uTime * 2.0 - uProgress * 9.0), 0.06);
        float rays = pow(abs(sin(angle * 9.0 + uTime * 0.42)), 18.0);
        float grid = max(line(fract(uv.x * 18.0 + uProgress * 0.55) - 0.5, 0.012), line(fract(uv.y * 12.0 - uTime * 0.035) - 0.5, 0.012));
        float core = 1.0 - smoothstep(0.0, 0.64, dist);
        vec3 color = mix(uInnerA, uInnerB, core * 0.46 + tunnel * 0.16);
        color += uAccent * (tunnel * 0.24 + rays * 0.3 + grid * 0.08);
        float alpha = uReveal * (0.58 + tunnel * 0.25 + rays * 0.2);
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.92));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function disposeScene(scene: THREE.Scene, textures: THREE.Texture[], renderer: THREE.WebGLRenderer) {
  scene.traverse((child) => {
    const object = child as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    object.geometry?.dispose();
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => material.dispose());
    } else {
      object.material?.dispose();
    }
  });
  textures.forEach((texture) => texture.dispose());
  renderer.dispose();
  renderer.domElement.remove();
}

export function RenaissanceThreeScene({ variant, progress, className }: RenaissanceThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  const invalidateRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    progressRef.current = progress;
    invalidateRef.current();
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const palette = palettes[variant];
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(palette.clear), variant === "hero" ? 0.025 : 0.034);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 90);
    camera.position.set(0, 0, variant === "hero" ? 7.8 : 7.1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = variant === "retail" ? 1.05 : 1.18;
    renderer.setClearColor(new THREE.Color(palette.clear), 0);
    renderer.domElement.dataset.webglVariant = variant;
    mount.appendChild(renderer.domElement);

    const outerTexture = makeOuterWorldTexture(variant);
    const outerMaterial = makeOuterMaterial(outerTexture, palette);
    const innerBackdropMaterial = makeInnerBackdropMaterial(palette);
    const textures = [outerTexture];

    const innerBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(14.8, 9.4, 1, 1), innerBackdropMaterial);
    innerBackdrop.position.z = -7.6;
    scene.add(innerBackdrop);

    const rig = createInnerWorld(variant);
    scene.add(rig.group);
    const ringBases = rig.rings.map((ring) => ({
      rotationZ: ring.rotation.z,
      scale: ring.scale.x,
    }));
    const panelBases = rig.panels.map((panel) => ({
      y: panel.position.y,
      rotationY: panel.rotation.y,
    }));
    const ribbonBases = rig.ribbons.map((ribbon) => ({
      rotationY: ribbon.rotation.y,
      rotationZ: ribbon.rotation.z,
    }));

    const outerPlane = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 8.2, 128, 96), outerMaterial);
    outerPlane.position.z = variant === "hero" ? 1.05 : 0.35;
    scene.add(outerPlane);

    const ambient = new THREE.AmbientLight(palette.innerB, variant === "retail" ? 1.2 : 1.45);
    const key = new THREE.PointLight(palette.accent, variant === "hero" ? 8.4 : 6.8, 24);
    key.position.set(2.6, 2.4, 3.6);
    const rim = new THREE.PointLight(palette.accentSoft, 3.6, 18);
    rim.position.set(-3.2, -1.8, 1.8);
    scene.add(ambient, key, rim);

    const targetMouse = new THREE.Vector2(0, 0);
    const sceneMouse = new THREE.Vector2(0, 0);
    let motionEnergy = 0;
    let motionTime = 0;
    let lastNow = 0;
    let lastProgressValue = progressRef.current;
    let isInView = true;
    let animationFrame = 0;
    let disposed = false;
    let renderReady = false;
    let render: FrameRequestCallback = () => undefined;

    const boostMotion = (amount: number) => {
      motionEnergy = Math.min(2.25, motionEnergy + amount);
    };

    const scheduleRender = () => {
      if (disposed || animationFrame || !renderReady) return;
      animationFrame = requestAnimationFrame(render);
    };

    const invalidate = () => {
      scheduleRender();
    };
    invalidateRef.current = invalidate;

    const isMountNearViewport = () => {
      const rect = mount.getBoundingClientRect();
      return rect.bottom >= 0 && rect.top <= window.innerHeight;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nextX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1.25, 1.25);
      const nextY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * -2, -1.25, 1.25);
      const pointerDelta = Math.hypot(nextX - targetMouse.x, nextY - targetMouse.y);
      const hardwareDelta = Math.min(0.75, (Math.abs(event.movementX) + Math.abs(event.movementY)) * 0.0035);
      targetMouse.set(nextX, nextY);
      if (isMountNearViewport()) {
        boostMotion(Math.min(1.1, pointerDelta * 1.65 + hardwareDelta));
        invalidate();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!isMountNearViewport()) return;
      boostMotion(Math.min(0.85, (Math.abs(event.deltaX) + Math.abs(event.deltaY)) * 0.0016));
      invalidate();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      invalidate();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? true;
        if (isInView) invalidate();
      },
      { rootMargin: "45% 0px" },
    );
    intersectionObserver.observe(mount);

    render = (now: number) => {
      animationFrame = 0;
      if (!isInView) return;

      const delta = lastNow ? Math.min(0.05, (now - lastNow) * 0.001) : 0.016;
      lastNow = now;
      const progressValue = progressRef.current;
      const progressDelta = Math.abs(progressValue - lastProgressValue);
      lastProgressValue = progressValue;
      if (progressDelta > 0.0001) {
        boostMotion(Math.min(0.9, progressDelta * 5.5));
      }
      const mouseEase = 1 - Math.exp(-delta * 22);
      sceneMouse.lerp(targetMouse, mouseEase);
      const pointerLag = sceneMouse.distanceTo(targetMouse);
      const motionLevel = THREE.MathUtils.clamp(motionEnergy + pointerLag * 2.8, 0, 1);
      if (motionEnergy > 0.0005 || pointerLag > 0.0005 || progressDelta > 0.0001) {
        motionTime += delta * (motionEnergy * 2.2 + pointerLag * 3.2 + progressDelta * 16);
      }
      motionEnergy = Math.max(0, motionEnergy - delta * 4.2);
      if (motionEnergy < 0.01 && pointerLag < 0.006) {
        sceneMouse.copy(targetMouse);
      }
      const mouse = sceneMouse;
      const heroReveal = THREE.MathUtils.smoothstep(progressValue, 0.06, 0.88);
      const reveal = variant === "hero" ? heroReveal : 0.78 + progressValue * 0.22;
      const outerProgress = variant === "hero" ? progressValue : 0.78 + progressValue * 0.18;
      const pulse = motionLevel * (0.5 + Math.sin(motionTime * 0.75) * 0.5);

      outerMaterial.uniforms.uTime.value = motionTime;
      outerMaterial.uniforms.uProgress.value = outerProgress;
      outerMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);
      outerMaterial.uniforms.uShellOpacity.value = variant === "hero" ? 1 : 0.34;
      outerMaterial.uniforms.uEdgeFade.value = variant === "hero" ? 0 : 1;
      innerBackdropMaterial.uniforms.uTime.value = motionTime;
      innerBackdropMaterial.uniforms.uReveal.value = reveal;
      innerBackdropMaterial.uniforms.uProgress.value = progressValue;
      innerBackdropMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

      const targetCameraX = mouse.x * (0.42 + reveal * 0.36);
      const targetCameraY = mouse.y * (0.3 + reveal * 0.22);
      const targetCameraZ = variant === "hero" ? 7.8 - reveal * 1.65 : 7.05 - progressValue * 0.38;
      const cameraEase = 1 - Math.exp(-delta * 18);
      camera.position.x += (targetCameraX - camera.position.x) * cameraEase;
      camera.position.y += (targetCameraY - camera.position.y) * cameraEase;
      camera.position.z += (targetCameraZ - camera.position.z) * cameraEase;
      if (
        Math.abs(camera.position.x - targetCameraX) < 0.006 &&
        Math.abs(camera.position.y - targetCameraY) < 0.006 &&
        Math.abs(camera.position.z - targetCameraZ) < 0.006
      ) {
        camera.position.set(targetCameraX, targetCameraY, targetCameraZ);
      }
      camera.lookAt(mouse.x * 0.32, mouse.y * 0.2, -2.6 - reveal * 0.42);

      rig.group.visible = reveal > 0.015;
      rig.group.position.x = mouse.x * 0.22;
      rig.group.position.y = mouse.y * 0.14;
      rig.group.position.z = variant === "hero" ? -4.25 + reveal * 2.15 : -2.75 + progressValue * 0.34;
      rig.group.rotation.x = mouse.y * 0.05;
      rig.group.rotation.y = mouse.x * 0.18 + motionTime * (variant === "retail" ? 0.045 : 0.07);
      rig.group.scale.setScalar(variant === "hero" ? 0.68 + reveal * 0.32 : 0.86 + progressValue * 0.12);

      rig.rings.forEach((ring, index) => {
        const base = ringBases[index];
        ring.rotation.z = base.rotationZ + motionTime * (0.06 + index * 0.003) + progressValue * 1.4 + mouse.x * 0.06;
        const ringScale = base.scale + Math.sin(motionTime * 0.72 + index * 0.4) * 0.022 * motionLevel + reveal * 0.045;
        ring.scale.setScalar(ringScale);
      });
      rig.panels.forEach((panel, index) => {
        const base = panelBases[index];
        panel.position.y = base.y + Math.sin(motionTime * 0.7 + index * 0.75) * 0.052 * motionLevel + mouse.y * 0.035;
        panel.rotation.y = base.rotationY + Math.sin(motionTime * 0.4 + index) * 0.04 * motionLevel + mouse.x * 0.065;
      });
      rig.ribbons.forEach((ribbon, index) => {
        const base = ribbonBases[index];
        ribbon.rotation.z = base.rotationZ + Math.sin(motionTime * 0.38 + index) * 0.12 * motionLevel + mouse.x * 0.07;
        ribbon.rotation.y = base.rotationY + motionTime * (index ? -0.035 : 0.028) + mouse.y * 0.03;
      });
      rig.core.rotation.x = motionTime * 0.42 + progressValue * 1.7 + mouse.y * 0.46;
      rig.core.rotation.y = motionTime * 0.36 + mouse.x * 0.62;
      rig.core.scale.setScalar(1 + pulse * 0.07 + reveal * 0.08);
      rig.particles.rotation.z = motionTime * 0.025 + mouse.y * 0.035;
      rig.particles.rotation.y = motionTime * 0.04 + mouse.x * 0.16;

      const materialFade = Math.max(0.04, reveal);
      rig.materials.forEach(({ material, baseOpacity }) => {
        material.opacity = baseOpacity * materialFade;
      });

      renderer.render(scene, camera);
      const cameraDelta =
        Math.abs(camera.position.x - targetCameraX) +
        Math.abs(camera.position.y - targetCameraY) +
        Math.abs(camera.position.z - targetCameraZ);
      const shouldContinue =
        motionEnergy > 0.01 || pointerLag > 0.006 || progressDelta > 0.0001 || cameraDelta > 0.02;
      if (shouldContinue) {
        scheduleRender();
      }
    };
    renderReady = true;
    scheduleRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", onWheel);
      invalidateRef.current = () => undefined;
      disposeScene(scene, textures, renderer);
    };
  }, [variant]);

  return <div ref={mountRef} className={`${styles.threeScene} ${className ?? ""}`} data-scene-variant={variant} />;
}
