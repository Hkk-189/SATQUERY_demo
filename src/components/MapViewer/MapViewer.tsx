import React, { useState, useRef } from 'react';
import type { Scenario, ViewMode } from '../../types';
import { SatelliteCanvas } from './SatelliteCanvas';
import { ComparisonSlider } from './ComparisonSlider';
import { GroundingOverlay } from './GroundingOverlay';
import { TelemetryBar } from './TelemetryBar';
import { Activity } from 'lucide-react';

interface MapViewerProps {
  scenario: Scenario;
  selectedFeatureId: string | null;
  onSelectFeature: (id: string | null) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  scenario,
  selectedFeatureId,
  onSelectFeature,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Cartographic layer toggles
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [showBBoxes, setShowBBoxes] = useState<boolean>(true);
  const [showMetricsOverlay, setShowMetricsOverlay] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan & Zoom controls
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setCursorPos({ x: xPct, y: yPct });
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3.5, Math.max(0.7, prev + delta)));
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        setIsPanning(false);
        setCursorPos(null);
      }}
      onWheel={handleWheel}
      className="relative w-full h-full bg-sat-950 overflow-hidden border border-sat-800 flex flex-col cursor-crosshair select-none"
    >
      {/* Viewport Corner Cartographic Coordinates & Datum Watermarks */}
      <div className="absolute top-2 left-2 z-10 text-[9px] font-mono text-sat-500 pointer-events-none select-none">
        NW: {scenario.coordinates.bounds.north.toFixed(4)}°N, {scenario.coordinates.bounds.west.toFixed(4)}°E
      </div>
      <div className="absolute top-2 right-2 z-10 text-[9px] font-mono text-sat-500 pointer-events-none select-none">
        NE: {scenario.coordinates.bounds.north.toFixed(4)}°N, {scenario.coordinates.bounds.east.toFixed(4)}°E
      </div>
      <div className="absolute bottom-12 left-2 z-10 text-[9px] font-mono text-sat-500 pointer-events-none select-none">
        SW: {scenario.coordinates.bounds.south.toFixed(4)}°N, {scenario.coordinates.bounds.west.toFixed(4)}°E
      </div>
      <div className="absolute bottom-12 right-2 z-10 text-[9px] font-mono text-sat-500 pointer-events-none select-none">
        SE: {scenario.coordinates.bounds.south.toFixed(4)}°N, {scenario.coordinates.bounds.east.toFixed(4)}°E
      </div>

      {/* Main Imagery Rendering Canvas Container with Pan & Zoom transform */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
        className="relative w-full h-full"
      >
        {/* Layer 1: Pre-Event Baseline */}
        <div className="absolute inset-0">
          <SatelliteCanvas
            scenarioId={scenario.id}
            layerMode={scenario.preEvent.layerType}
          />
        </div>

        {/* Layer 2: Post-Event / Change Detection Layer */}
        {viewMode === 'split' && (
          <div
            style={{
              clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
            }}
            className="absolute inset-0"
          >
            <SatelliteCanvas
              scenarioId={scenario.id}
              layerMode={scenario.postEvent.layerType}
            />
          </div>
        )}

        {viewMode === 'post' && (
          <div className="absolute inset-0">
            <SatelliteCanvas
              scenarioId={scenario.id}
              layerMode={scenario.postEvent.layerType}
            />
          </div>
        )}

        {viewMode === 'difference' && (
          <div className="absolute inset-0">
            <SatelliteCanvas
              scenarioId={scenario.id}
              layerMode="change_mask"
            />
          </div>
        )}

        {/* Cartographic 1km Graticule Grid */}
        {showGrid && (
          <div className="absolute inset-0 bg-carto-grid pointer-events-none opacity-40 z-10" />
        )}

        {/* Center Target Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-25">
          <div className="w-12 h-12 border border-cyan-400/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400/60 rounded-full" />
          </div>
        </div>

        {/* Interactive Grounding Polygons & Bounding Boxes */}
        <GroundingOverlay
          features={scenario.groundingFeatures}
          selectedFeatureId={selectedFeatureId}
          onSelectFeature={onSelectFeature}
          visible={showPolygons}
          showBoundingBoxes={showBBoxes}
        />
      </div>

      {/* Bi-Temporal Split Comparison Slider */}
      <ComparisonSlider
        sliderPos={sliderPos}
        onSliderChange={setSliderPos}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        preDate={scenario.preEvent.date}
        preSensor={scenario.preEvent.satellite}
        postDate={scenario.postEvent.date}
        postSensor={scenario.postEvent.satellite}
      />

      {/* Floating Key Metrics Banner (Collapsible) */}
      {showMetricsOverlay && (
        <div className="absolute top-16 left-3 z-20 max-w-sm pointer-events-auto">
          <div className="bg-sat-950/95 border border-sat-700/80 rounded backdrop-blur-md p-2.5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-sat-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-sat-100 text-2xs uppercase tracking-wider">
                  SPATIAL ANOMALY TELEMETRY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMetricsOverlay(false)}
                className="text-sat-400 hover:text-sat-200 text-2xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {scenario.keyMetrics.map((metric, i) => (
                <div key={i} className="bg-sat-900/90 border border-sat-800 p-1.5 rounded">
                  <span className="text-sat-400 text-[10px] block leading-tight truncate">
                    {metric.label}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`text-sm font-bold ${
                        metric.severity === 'critical'
                          ? 'text-rose-400'
                          : metric.severity === 'warning'
                          ? 'text-amber-400'
                          : 'text-sat-100'
                      }`}
                    >
                      {metric.value}
                    </span>
                    <span className="text-sat-400 text-2xs">{metric.unit}</span>
                  </div>
                  {metric.change && (
                    <span className="text-sat-500 text-[9px] block leading-tight truncate mt-0.5">
                      {metric.change}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showMetricsOverlay && (
        <button
          type="button"
          onClick={() => setShowMetricsOverlay(true)}
          className="absolute top-16 left-3 z-20 bg-sat-900/90 border border-sat-700 hover:border-cyan-400 px-2 py-1 rounded text-2xs font-mono text-cyan-400 flex items-center gap-1 backdrop-blur-md shadow-lg"
        >
          <Activity className="w-3 h-3" />
          <span>Show Metrics</span>
        </button>
      )}

      {/* Bottom Cartographic Telemetry Bar */}
      <TelemetryBar
        scenario={scenario}
        cursorPos={cursorPos}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3.5, z + 0.25))}
        onZoomOut={() => setZoom((z) => Math.max(0.7, z - 0.25))}
        onResetView={resetView}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showPolygons={showPolygons}
        onTogglePolygons={() => setShowPolygons(!showPolygons)}
        showBBoxes={showBBoxes}
        onToggleBBoxes={() => setShowBBoxes(!showBBoxes)}
      />
    </div>
  );
};
