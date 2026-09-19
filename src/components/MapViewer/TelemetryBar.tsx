import React from 'react';
import {
  Compass,
  Grid,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Sun,
  Radio,
  Eye,
} from 'lucide-react';
import type { Scenario } from '../../types';

interface TelemetryBarProps {
  scenario: Scenario;
  cursorPos: { x: number; y: number } | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showPolygons: boolean;
  onTogglePolygons: () => void;
  showBBoxes: boolean;
  onToggleBBoxes: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  scenario,
  cursorPos,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  showGrid,
  onToggleGrid,
  showPolygons,
  onTogglePolygons,
  showBBoxes,
  onToggleBBoxes,
}) => {
  // Compute interpolated coordinates based on cursor position inside bounds
  const bounds = scenario.coordinates.bounds;
  const lat = cursorPos
    ? (bounds.north - (cursorPos.y / 100) * (bounds.north - bounds.south)).toFixed(5)
    : scenario.coordinates.lat.toFixed(5);
  const lon = cursorPos
    ? (bounds.west + (cursorPos.x / 100) * (bounds.east - bounds.west)).toFixed(5)
    : scenario.coordinates.lon.toFixed(5);

  return (
    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
      {/* Left: Coordinate Telemetry & Metric Scale Bar */}
      <div className="flex items-center gap-2 bg-sat-950/90 backdrop-blur-md border border-sat-700/80 px-3 py-1.5 rounded text-xs font-mono shadow-xl pointer-events-auto">
        <div className="flex items-center gap-1.5 border-r border-sat-800 pr-2.5">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <div>
            <span className="text-sat-400 text-[10px] block leading-none">WGS84 LAT / LON</span>
            <span className="text-sat-100 font-bold">
              {lat}°N, {lon}°E
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-r border-sat-800 pr-2.5">
          <div>
            <span className="text-sat-400 text-[10px] block leading-none">UTM / MGRS</span>
            <span className="text-sat-200">
              {scenario.coordinates.utmZone} • {scenario.coordinates.mgrs}
            </span>
          </div>
        </div>

        {/* Dynamic Scale Bar */}
        <div className="flex flex-col items-center pl-1">
          <span className="text-sat-400 text-[9px] leading-none mb-0.5">
            {Math.round(1000 / zoom)} m
          </span>
          <div className="w-16 h-1 border-x border-b border-sat-300 relative flex">
            <div className="w-1/2 h-full bg-sat-200"></div>
            <div className="w-1/2 h-full bg-transparent"></div>
          </div>
        </div>
      </div>

      {/* Center: Sensor Sun Angle / GSD Telemetry */}
      <div className="hidden lg:flex items-center gap-3 bg-sat-950/90 backdrop-blur-md border border-sat-700/80 px-3 py-1.5 rounded text-xs font-mono shadow-xl pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-sat-400 text-2xs">GSD:</span>
          <span className="text-sat-100 font-semibold">{scenario.telemetry.gsd}</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-sat-800 pl-3">
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-sat-400 text-2xs">SUN ELEV:</span>
          <span className="text-sat-200">{scenario.telemetry.sunElevation}</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-sat-800 pl-3">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-sat-400 text-2xs">INCIDENCE:</span>
          <span className="text-sat-200">{scenario.telemetry.sensorIncidence}</span>
        </div>
      </div>

      {/* Right: Cartographic Overlays & Viewport Controls */}
      <div className="flex items-center gap-1.5 bg-sat-950/90 backdrop-blur-md border border-sat-700/80 p-1 rounded text-xs font-mono shadow-xl pointer-events-auto">
        {/* Graticule Grid Toggle */}
        <button
          type="button"
          onClick={onToggleGrid}
          className={`p-1.5 rounded transition-colors ${
            showGrid
              ? 'bg-sat-800 text-cyan-400 border border-cyan-400/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
          title="Toggle 1km Cartographic Graticule Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Polygons Toggle */}
        <button
          type="button"
          onClick={onTogglePolygons}
          className={`p-1.5 rounded transition-colors ${
            showPolygons
              ? 'bg-sat-800 text-mask-flood border border-mask-flood/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
          title="Toggle Grounding Polygons"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        {/* Bounding Box Toggle */}
        <button
          type="button"
          onClick={onToggleBBoxes}
          className={`p-1.5 rounded transition-colors ${
            showBBoxes
              ? 'bg-sat-800 text-amber-400 border border-amber-400/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
          title="Toggle Bounding Boxes"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-sat-800 mx-0.5"></div>

        {/* Zoom Controls */}
        <button
          type="button"
          onClick={onZoomOut}
          className="p-1.5 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] font-bold text-sat-200 px-1">
          {zoom.toFixed(1)}x
        </span>

        <button
          type="button"
          onClick={onZoomIn}
          className="p-1.5 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="p-1.5 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors ml-0.5"
          title="Reset Extent"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
