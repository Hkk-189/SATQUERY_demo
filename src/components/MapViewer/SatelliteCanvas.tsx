import React, { useEffect, useRef } from 'react';
import type { ScenarioId, ImageryLayerType } from '../../types';

interface SatelliteCanvasProps {
  scenarioId: ScenarioId;
  layerMode: ImageryLayerType;
  opacity?: number;
  showSpeckle?: boolean;
}

export const SatelliteCanvas: React.FC<SatelliteCanvasProps> = ({
  scenarioId,
  layerMode,
  opacity = 1,
  showSpeckle = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = 1200);
    const height = (canvas.height = 900);

    ctx.clearRect(0, 0, width, height);

    // Render scenario-specific base terrain and satellite telemetry features
    if (scenarioId === 'kochi-flood') {
      renderKochiScene(ctx, width, height, layerMode, showSpeckle);
    } else if (scenarioId === 'joshimath-subsidence') {
      renderJoshimathScene(ctx, width, height, layerMode);
    } else {
      renderSundarbansScene(ctx, width, height, layerMode);
    }
  }, [scenarioId, layerMode, showSpeckle]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover block select-none pointer-events-none"
      style={{ opacity }}
    />
  );
};

// ==========================================
// SCENARIO 1: KOCHI PERIYAR FLOODS
// ==========================================
function renderKochiScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mode: string,
  speckle: boolean
) {
  const isSar = mode === 'sar_inundation';
  const isMask = mode === 'change_mask';

  // Base background
  if (isSar) {
    // SAR C-Band radar: dark charcoal with backscatter variance
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#10151c');
    bgGrad.addColorStop(1, '#0b0f15');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Optical Sentinel-2: Lush Kerala coastal vegetation, agricultural soils, urban grey
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#1a2820'); // deep vegetation green
    bgGrad.addColorStop(0.5, '#1e3025');
    bgGrad.addColorStop(1, '#23382c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // Coastline & Arabian Sea on the left
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.16, 0);
  ctx.bezierCurveTo(w * 0.18, h * 0.3, w * 0.12, h * 0.7, w * 0.15, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  if (isSar) {
    ctx.fillStyle = '#060a0f'; // Radar specular reflection on open calm water = near black
  } else {
    ctx.fillStyle = '#102235'; // Deep ocean blue
  }
  ctx.fill();
  ctx.restore();

  // Vembanad Lake & Backwaters estuary network
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.16, h * 0.45);
  ctx.bezierCurveTo(w * 0.28, h * 0.4, w * 0.32, h * 0.65, w * 0.22, h * 0.88);
  ctx.bezierCurveTo(w * 0.18, h * 0.95, w * 0.12, h * 0.85, w * 0.15, h * 0.7);
  ctx.closePath();
  if (isSar) {
    ctx.fillStyle = '#070b10';
  } else {
    ctx.fillStyle = '#152d42';
  }
  ctx.fill();
  ctx.restore();

  // Periyar River (winding from NE to estuary)
  ctx.save();
  ctx.lineWidth = isSar && !isMask ? 28 : 24;
  ctx.strokeStyle = isSar ? '#05090e' : '#1e3a52';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.95, h * 0.1);
  ctx.bezierCurveTo(w * 0.75, h * 0.18, w * 0.55, h * 0.15, w * 0.45, h * 0.28);
  ctx.bezierCurveTo(w * 0.38, h * 0.38, w * 0.32, h * 0.42, w * 0.25, h * 0.48);
  ctx.stroke();
  ctx.restore();

  // Urban Clusters (Kochi city, Aluva, Kalamassery)
  const urbanClusters = [
    { x: w * 0.35, y: h * 0.65, r: 85 }, // Central Kochi
    { x: w * 0.45, y: h * 0.28, r: 55 }, // Aluva town
    { x: w * 0.58, y: h * 0.45, r: 45 }, // Kalamassery industrial
    { x: w * 0.28, y: h * 0.55, r: 40 }, // Ernakulam port
    { x: w * 0.72, y: h * 0.30, r: 35 }, // Perumbavoor
  ];

  urbanClusters.forEach((c) => {
    ctx.save();
    const uGrad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.r);
    if (isSar) {
      // High SAR backscatter (double-bounce on building corners)
      uGrad.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
      uGrad.addColorStop(0.5, 'rgba(200, 210, 225, 0.3)');
      uGrad.addColorStop(1, 'transparent');
    } else {
      // Optical concrete reflectance
      uGrad.addColorStop(0, 'rgba(90, 105, 120, 0.55)');
      uGrad.addColorStop(0.7, 'rgba(60, 75, 88, 0.35)');
      uGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = uGrad;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Road Network (NH-544, Seaport-Airport road)
  ctx.save();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = isSar ? 'rgba(160, 175, 195, 0.4)' : 'rgba(130, 140, 150, 0.5)';
  ctx.beginPath();
  // NH-544 diagonal highway
  ctx.moveTo(w * 0.3, h * 0.7);
  ctx.lineTo(w * 0.52, h * 0.45);
  ctx.lineTo(w * 0.78, h * 0.15);
  ctx.stroke();

  // Secondary highway
  ctx.moveTo(w * 0.22, h * 0.35);
  ctx.lineTo(w * 0.48, h * 0.32);
  ctx.lineTo(w * 0.65, h * 0.52);
  ctx.stroke();
  ctx.restore();

  // FLOOD INUNDATION LAYER (Only active in SAR or change_mask mode)
  if (isSar || isMask) {
    ctx.save();
    // Flood spillway 1: Aluva lowlands
    const flood1 = ctx.createRadialGradient(w * 0.42, h * 0.28, 10, w * 0.42, h * 0.28, 140);
    if (isMask) {
      flood1.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
      flood1.addColorStop(0.7, 'rgba(16, 185, 129, 0.65)');
      flood1.addColorStop(1, 'transparent');
    } else {
      flood1.addColorStop(0, 'rgba(4, 9, 14, 0.95)'); // Specular attenuation
      flood1.addColorStop(0.6, 'rgba(6, 182, 212, 0.45)'); // False-color SDWI water accent
      flood1.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = flood1;
    ctx.beginPath();
    ctx.ellipse(w * 0.42, h * 0.28, 160, 95, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Flood spillway 2: Kalamassery industrial belt
    const flood2 = ctx.createRadialGradient(w * 0.65, h * 0.46, 10, w * 0.65, h * 0.46, 110);
    if (isMask) {
      flood2.addColorStop(0, 'rgba(244, 63, 94, 0.85)');
      flood2.addColorStop(0.7, 'rgba(249, 115, 22, 0.6)');
      flood2.addColorStop(1, 'transparent');
    } else {
      flood2.addColorStop(0, 'rgba(6, 182, 212, 0.55)');
      flood2.addColorStop(0.8, 'rgba(4, 9, 14, 0.9)');
      flood2.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = flood2;
    ctx.beginPath();
    ctx.ellipse(w * 0.65, h * 0.46, 115, 80, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Flood spillway 3: Vembanad wetland expansion
    const flood3 = ctx.createRadialGradient(w * 0.24, h * 0.65, 20, w * 0.24, h * 0.65, 180);
    flood3.addColorStop(0, isMask ? 'rgba(16, 185, 129, 0.8)' : 'rgba(6, 182, 212, 0.5)');
    flood3.addColorStop(1, 'transparent');
    ctx.fillStyle = flood3;
    ctx.beginPath();
    ctx.ellipse(w * 0.24, h * 0.65, 150, 190, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // SAR Radar Speckle Noise simulation
  if (isSar && speckle) {
    drawSarSpeckleNoise(ctx, w, h, 0.08);
  }
}

// ==========================================
// SCENARIO 2: JOSHIMATH HIMALAYAN SUBSIDENCE
// ==========================================
function renderJoshimathScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mode: string
) {
  const isDeformation = mode === 'insar_deformation';

  // Base mountain terrain (topography & hillshade)
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#221e1a');
  bgGrad.addColorStop(0.4, '#1b221e');
  bgGrad.addColorStop(1, '#161c18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Alaknanda & Dhauliganga River gorge deep cleft
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#0f2430';
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.95);
  ctx.bezierCurveTo(w * 0.35, h * 0.75, w * 0.6, h * 0.55, w * 0.85, h * 0.2);
  ctx.stroke();
  ctx.restore();

  // Topographic contour lines
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(120, 140, 160, 0.15)';
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    const yOff = h * (0.15 + i * 0.09);
    ctx.moveTo(0, yOff);
    ctx.bezierCurveTo(w * 0.3, yOff - 40, w * 0.7, yOff + 40, w, yOff - 20);
    ctx.stroke();
  }
  ctx.restore();

  // Town footprint of Joshimath on the slope
  ctx.save();
  const townGrad = ctx.createRadialGradient(w * 0.48, h * 0.44, 10, w * 0.48, h * 0.44, 120);
  townGrad.addColorStop(0, 'rgba(180, 160, 140, 0.35)');
  townGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = townGrad;
  ctx.beginPath();
  ctx.ellipse(w * 0.48, h * 0.44, 130, 90, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // InSAR Phase Interferometric Velocity Map (Cyclic rainbow fringe rings)
  if (isDeformation) {
    ctx.save();
    const cx = w * 0.48;
    const cy = w * 0.44 * (h / w);

    // Subsidence deformation core (Sunil & Manohar Bagh)
    const fringes = [
      { r: 160, color: 'rgba(56, 189, 248, 0.25)' },   // -10 mm/yr
      { r: 125, color: 'rgba(16, 185, 129, 0.35)' },   // -25 mm/yr
      { r: 95, color: 'rgba(234, 179, 8, 0.45)' },     // -45 mm/yr
      { r: 65, color: 'rgba(249, 115, 22, 0.55)' },    // -60 mm/yr
      { r: 35, color: 'rgba(244, 63, 94, 0.75)' },     // -72 mm/yr PEAK
    ];

    fringes.forEach((f) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, f.r * 1.3, f.r * 0.85, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
    });

    // Scarp headwall tension fracture fault line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#f43f5e';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(w * 0.32, h * 0.34);
    ctx.lineTo(w * 0.58, h * 0.28);
    ctx.lineTo(w * 0.72, h * 0.42);
    ctx.stroke();
    ctx.restore();
  }
}

// ==========================================
// SCENARIO 3: SUNDARBANS MANGROVE DIEBACK
// ==========================================
function renderSundarbansScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mode: string
) {
  const isCyclone = mode === 'cyclone_surge';

  // Base deltaic estuarine water
  ctx.fillStyle = isCyclone ? '#132832' : '#0e202a';
  ctx.fillRect(0, 0, w, h);

  // Island 1: Ghoramara Island
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.24, h * 0.28);
  ctx.bezierCurveTo(w * 0.42, h * 0.24, w * 0.45, h * 0.52, w * 0.35, h * 0.65);
  ctx.bezierCurveTo(w * 0.22, h * 0.68, w * 0.16, h * 0.48, w * 0.24, h * 0.28);
  ctx.closePath();
  if (isCyclone) {
    ctx.fillStyle = '#2d2e1c'; // Scoured, damaged vegetation
  } else {
    ctx.fillStyle = '#1c3e24'; // Healthy dense mangrove green
  }
  ctx.fill();
  ctx.restore();

  // Island 2: Jambudwip Mangrove Reserve
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.52, h * 0.48);
  ctx.bezierCurveTo(w * 0.75, h * 0.42, w * 0.82, h * 0.72, w * 0.68, h * 0.82);
  ctx.bezierCurveTo(w * 0.48, h * 0.78, w * 0.44, h * 0.62, w * 0.52, h * 0.48);
  ctx.closePath();
  ctx.fillStyle = isCyclone ? '#323422' : '#174020';
  ctx.fill();
  ctx.restore();

  // Tidal surge erosion and sediment plume in cyclone mode
  if (isCyclone) {
    ctx.save();
    // Eroded western flank of Ghoramara
    const erosionGrad = ctx.createRadialGradient(w * 0.24, h * 0.45, 5, w * 0.24, h * 0.45, 90);
    erosionGrad.addColorStop(0, 'rgba(244, 63, 94, 0.75)');
    erosionGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.45)');
    erosionGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = erosionGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.24, h * 0.45, 80, 110, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Defoliated canopy zone in Jambudwip
    const defoliationGrad = ctx.createRadialGradient(w * 0.65, h * 0.64, 10, w * 0.65, h * 0.64, 120);
    defoliationGrad.addColorStop(0, 'rgba(249, 115, 22, 0.7)');
    defoliationGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.4)');
    defoliationGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = defoliationGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.65, h * 0.64, 110, 85, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Utility: Synthetic radar speckle
function drawSarSpeckleNoise(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
) {
  const step = 4;
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      if (Math.random() < 0.28) {
        const val = Math.random() * 255;
        ctx.fillStyle = `rgba(${val}, ${val}, ${val}, ${intensity})`;
        ctx.fillRect(x, y, step, step);
      }
    }
  }
}
