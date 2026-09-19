import React, { useState } from 'react';
import type { GroundingPolygon } from '../../types';
import { ShieldAlert, Waves } from 'lucide-react';

interface GroundingOverlayProps {
  features: GroundingPolygon[];
  selectedFeatureId: string | null;
  onSelectFeature: (id: string | null) => void;
  visible: boolean;
  showBoundingBoxes: boolean;
}

export const GroundingOverlay: React.FC<GroundingOverlayProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  visible,
  showBoundingBoxes,
}) => {
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);

  if (!visible) return null;

  const activeId = hoveredFeatureId || selectedFeatureId;
  const activeFeature = features.find((f) => f.id === activeId);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor="#06b6d4" floodOpacity="0.8" />
          </filter>
          <filter id="glow-danger" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor="#f43f5e" floodOpacity="0.8" />
          </filter>
        </defs>

        {features.map((feature) => {
          const isSelected = selectedFeatureId === feature.id;
          const isHovered = hoveredFeatureId === feature.id;
          const pointsStr = feature.points.map(([x, y]) => `${x},${y}`).join(' ');

          const [minX, minY, maxX, maxY] = feature.bbox;
          const bboxWidth = maxX - minX;
          const bboxHeight = maxY - minY;
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;

          const isDanger = feature.category === 'infrastructure_risk' || feature.category === 'ground_deformation';
          const strokeColor = isDanger ? '#f43f5e' : feature.color || '#06b6d4';

          return (
            <g key={feature.id} className="pointer-events-auto">
              {/* Optional Bounding Box */}
              {showBoundingBoxes && (
                <rect
                  x={minX}
                  y={minY}
                  width={bboxWidth}
                  height={bboxHeight}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="0.3"
                  strokeDasharray="1.2 1.2"
                  opacity={isSelected || isHovered ? 0.9 : 0.45}
                />
              )}

              {/* Polygon Area */}
              <polygon
                points={pointsStr}
                fill={strokeColor}
                fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
                stroke={strokeColor}
                strokeWidth={isSelected ? 0.7 : isHovered ? 0.5 : 0.35}
                strokeDasharray={isSelected ? 'none' : '1.5 0.7'}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectFeature(isSelected ? null : feature.id)}
                onMouseEnter={() => setHoveredFeatureId(feature.id)}
                onMouseLeave={() => setHoveredFeatureId(null)}
              />

              {/* Centroid Reticle / Crosshair */}
              <circle
                cx={centerX}
                cy={centerY}
                r={isSelected ? 1.2 : 0.8}
                fill={strokeColor}
                className="cursor-pointer"
                onClick={() => onSelectFeature(feature.id)}
              />

              {/* Minimal Corner Ticks on Bounding Box */}
              {showBoundingBoxes && (
                <g stroke={strokeColor} strokeWidth="0.4" opacity="0.8">
                  <path d={`M ${minX} ${minY + 1.5} L ${minX} ${minY} L ${minX + 1.5} ${minY}`} />
                  <path d={`M ${maxX - 1.5} ${minY} L ${maxX} ${minY} L ${maxX} ${minY + 1.5}`} />
                  <path d={`M ${minX} ${maxY - 1.5} L ${minX} ${maxY} L ${minX + 1.5} ${maxY}`} />
                  <path d={`M ${maxX - 1.5} ${maxY} L ${maxX} ${maxY} L ${maxX} ${maxY - 1.5}`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Grounding Feature Telemetry Callout */}
      {activeFeature && (
        <div
          style={{
            left: `${Math.min(75, Math.max(15, (activeFeature.bbox[0] + activeFeature.bbox[2]) / 2))}%`,
            top: `${Math.min(78, Math.max(20, activeFeature.bbox[1]))}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full mb-3 pointer-events-auto z-30 transition-all"
        >
          <div className="bg-sat-950/95 border border-sat-600 shadow-2xl p-3 rounded text-xs font-mono w-72 backdrop-blur-md">
            <div className="flex items-start justify-between gap-2 border-b border-sat-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                {activeFeature.category === 'infrastructure_risk' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-sat-100 block text-xs leading-tight">
                    {activeFeature.label}
                  </span>
                  <span className="text-sat-400 text-2xs uppercase tracking-wider">
                    {activeFeature.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="bg-sat-900 border border-sat-700 px-1.5 py-0.5 rounded text-2xs text-cyan-400 font-bold">
                {(activeFeature.confidence * 100).toFixed(1)}% CONF
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-2xs">
              <div className="bg-sat-900/80 p-1.5 rounded border border-sat-800/80">
                <span className="text-sat-400 block text-[10px]">SURFACE EXTENT</span>
                <span className="text-sat-100 font-bold text-xs">
                  {activeFeature.areaHectares.toLocaleString()} ha
                </span>
              </div>

              {activeFeature.telemetry.waterDepthEstimate && (
                <div className="bg-sat-900/80 p-1.5 rounded border border-sat-800/80">
                  <span className="text-sat-400 block text-[10px]">EST. WATER DEPTH</span>
                  <span className="text-cyan-300 font-bold text-xs">
                    {activeFeature.telemetry.waterDepthEstimate}
                  </span>
                </div>
              )}

              {activeFeature.telemetry.backscatterShiftDb && (
                <div className="bg-sat-900/80 p-1.5 rounded border border-sat-800/80 col-span-2">
                  <span className="text-sat-400 block text-[10px]">SAR BACKSCATTER ATTENUATION</span>
                  <span className="text-amber-400 font-bold">
                    {activeFeature.telemetry.backscatterShiftDb}
                  </span>
                </div>
              )}

              {activeFeature.telemetry.displacementRateMmYr && (
                <div className="bg-sat-900/80 p-1.5 rounded border border-sat-800/80 col-span-2">
                  <span className="text-sat-400 block text-[10px]">INSAR LOS DEFORMATION</span>
                  <span className="text-rose-400 font-bold">
                    {activeFeature.telemetry.displacementRateMmYr}
                  </span>
                </div>
              )}

              {activeFeature.telemetry.vegetationLossPct && (
                <div className="bg-sat-900/80 p-1.5 rounded border border-sat-800/80 col-span-2">
                  <span className="text-sat-400 block text-[10px]">CANOPY DEFOLIATION</span>
                  <span className="text-orange-400 font-bold">
                    {activeFeature.telemetry.vegetationLossPct}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-sat-800/80 flex items-center justify-between text-[10px] text-sat-400">
              <span>BOUNDS: [{activeFeature.bbox.join(', ')}]</span>
              <button
                type="button"
                onClick={() => onSelectFeature(activeFeature.id)}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
              >
                {selectedFeatureId === activeFeature.id ? 'Unpin' : 'Pin Telemetry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
