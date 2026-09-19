import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Clock,
  Network,
} from 'lucide-react';
import type { ScenarioId, Scenario } from '../types';

interface HeaderProps {
  currentScenario: Scenario;
  onSelectScenario: (id: ScenarioId) => void;
  isTraceOpen: boolean;
  onToggleTrace: () => void;
  traceLayoutMode: 'bottom' | 'right';
  onToggleTraceLayout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  onSelectScenario,
  isTraceOpen,
  onToggleTrace,
}) => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-sat-950 border-b border-sat-800 px-3 flex items-center justify-between font-mono text-xs z-40 select-none shrink-0">
      {/* Left: Ground Station Identity & SIH / ISRO Mission Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-sat-100 tracking-wider">
                SATQUERY<span className="text-cyan-400">.AI</span>
              </h1>
              <span className="bg-sat-900 border border-sat-700 text-sat-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                GROUND-STATION v2.4
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-sat-400">
              <span className="text-amber-400 font-semibold">SIH 2026</span>
              <span>•</span>
              <span>ISRO / Space Applications Centre (SAC)</span>
              <span>•</span>
              <span className="text-sat-400 hidden sm:inline">Space Technology</span>
            </div>
          </div>
        </div>

        {/* Live Satellite Orbital Constellation Feed */}
        <div className="hidden xl:flex items-center gap-2 border-l border-sat-800 pl-3 text-[11px]">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle"></span>
            <span className="font-bold">ORBITAL PASS:</span>
          </div>
          <div className="flex items-center gap-1 text-sat-300">
            {currentScenario.telemetry.constellation.map((sat, i) => (
              <span
                key={i}
                className="bg-sat-900 border border-sat-800 px-1.5 py-0.5 rounded text-2xs text-sat-200"
              >
                {sat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Scenario Switcher Dropdown / Quick Selector */}
      <div className="hidden md:flex items-center gap-1 bg-sat-900 border border-sat-800 p-1 rounded">
        <span className="text-sat-400 text-2xs uppercase px-1.5 font-bold">AOI TARGET:</span>
        <button
          type="button"
          onClick={() => onSelectScenario('kochi-flood')}
          className={`px-2.5 py-1 rounded text-2xs font-semibold transition-colors cursor-pointer ${
            currentScenario.id === 'kochi-flood'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
        >
          Kochi Floods (SAR)
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('joshimath-subsidence')}
          className={`px-2.5 py-1 rounded text-2xs font-semibold transition-colors cursor-pointer ${
            currentScenario.id === 'joshimath-subsidence'
              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
        >
          Joshimath InSAR
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('sundarbans-erosion')}
          className={`px-2.5 py-1 rounded text-2xs font-semibold transition-colors cursor-pointer ${
            currentScenario.id === 'sundarbans-erosion'
              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
              : 'text-sat-400 hover:text-sat-200'
          }`}
        >
          Sundarbans Canopy
        </button>
      </div>

      {/* Right: Live UTC Clock & Trace Drawer Toggles */}
      <div className="flex items-center gap-3">
        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-sat-300 bg-sat-900/80 border border-sat-800 px-2.5 py-1 rounded text-2xs">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{utcTime || '14:42:18 UTC'}</span>
        </div>

        {/* Toggle Execution DAG Panel */}
        <button
          type="button"
          onClick={onToggleTrace}
          className={`px-2.5 py-1.5 rounded text-2xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
            isTraceOpen
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-telemetry'
              : 'bg-sat-900 text-sat-300 border-sat-700 hover:border-sat-500'
          }`}
          title="Toggle Explainable Agentic Execution DAG"
        >
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>EXECUTION DAG</span>
        </button>
      </div>
    </header>
  );
};
