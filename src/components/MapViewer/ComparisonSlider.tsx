import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sliders, Eye } from 'lucide-react';
import type { ViewMode } from '../../types';

interface ComparisonSliderProps {
  sliderPos: number; // 0 to 100
  onSliderChange: (pos: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  preDate: string;
  preSensor: string;
  postDate: string;
  postSensor: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  sliderPos,
  onSliderChange,
  viewMode,
  onViewModeChange,
  preDate,
  preSensor,
  postDate,
  postSensor,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      onSliderChange(Math.round(pct));
    },
    [isDragging, onSliderChange]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSliderChange(Math.max(0, sliderPos - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSliderChange(Math.min(100, sliderPos + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSliderChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSliderChange(100);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden"
    >
      {/* Top Banner with Bi-Temporal Sensor Identifiers & View Mode Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto gap-2">
        {/* Pre-Event Badge */}
        <div className="flex items-center gap-2 bg-sat-950/90 backdrop-blur-md border border-sat-700/80 px-2.5 py-1.5 rounded text-xs font-mono shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-optical-cyan animate-pulse-subtle"></span>
          <div>
            <span className="text-sat-400 text-2xs block uppercase font-semibold">T1 • Pre-Event</span>
            <span className="text-sat-100 font-medium">{preDate}</span>
            <span className="text-sat-400 text-2xs ml-1.5 hidden sm:inline">[{preSensor}]</span>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center bg-sat-950/90 backdrop-blur-md border border-sat-700/80 p-0.5 rounded text-xs font-mono shadow-lg">
          <button
            type="button"
            onClick={() => onViewModeChange('split')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-sat-800 text-optical-cyan border border-optical-cyan/30 shadow-sm'
                : 'text-sat-400 hover:text-sat-200'
            }`}
            title="Bi-temporal Split Swipe"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split Swipe</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('difference')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'difference'
                ? 'bg-sat-800 text-mask-flood border border-mask-flood/30 shadow-sm'
                : 'text-sat-400 hover:text-sat-200'
            }`}
            title="Change Detection Mask"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Change Mask</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('pre')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'pre'
                ? 'bg-sat-800 text-sat-100 border border-sat-600'
                : 'text-sat-400 hover:text-sat-200'
            }`}
            title="T1 Baseline Only"
          >
            T1
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('post')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'post'
                ? 'bg-sat-800 text-sar-gold border border-sar-gold/40'
                : 'text-sat-400 hover:text-sat-200'
            }`}
            title="T2 Post-Event Only"
          >
            T2
          </button>
        </div>

        {/* Post-Event Badge */}
        <div className="flex items-center gap-2 bg-sat-950/90 backdrop-blur-md border border-sat-700/80 px-2.5 py-1.5 rounded text-xs font-mono shadow-lg">
          <div className="text-right">
            <span className="text-sar-gold text-2xs block uppercase font-semibold">T2 • Post-Event</span>
            <span className="text-sat-100 font-medium">{postDate}</span>
            <span className="text-sat-400 text-2xs ml-1.5 hidden sm:inline">[{postSensor}]</span>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-sar-gold animate-pulse-subtle"></span>
        </div>
      </div>

      {/* Interactive Split Divider (Active in 'split' mode) */}
      {viewMode === 'split' && (
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-0 -translate-x-1/2 flex items-center justify-center pointer-events-auto"
        >
          {/* Hairline Divider Line */}
          <div className="w-[2px] h-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />

          {/* Draggable Telemetry Thumb / Handle */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Bi-temporal Imagery Comparison Split"
            aria-valuenow={sliderPos}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className={`absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-sat-900 border-2 border-cyan-400 rounded cursor-ew-resize flex flex-col items-center justify-center gap-0.5 shadow-xl transition-transform active:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-sat-950 ${
              isDragging ? 'scale-110 border-white' : ''
            }`}
          >
            <div className="flex items-center justify-center text-cyan-400">
              <ChevronLeft className="w-3.5 h-3.5 -mr-1" />
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-sat-200 leading-none">
              {sliderPos}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
