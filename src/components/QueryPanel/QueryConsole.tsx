import React, { useState } from 'react';
import type {
  QueryLogEntry,
  Scenario,
  ScenarioId,
  SensorModality,
} from '../../types';
import { QueryHistoryItem } from './QueryHistoryItem';
import {
  Terminal,
  Send,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';

interface QueryConsoleProps {
  logs: QueryLogEntry[];
  activeScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  onSubmitQuery: (query: string, modality: SensorModality) => void;
  activeScenario: Scenario;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const QueryConsole: React.FC<QueryConsoleProps> = ({
  logs,
  activeScenarioId,
  onSelectScenario,
  onSubmitQuery,
  activeScenario,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [inputText, setInputText] = useState('');
  const [modality, setModality] = useState<SensorModality>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitQuery(inputText.trim(), modality);
    setInputText('');
  };

  const handlePresetClick = (presetQuery: string, targetScenarioId: ScenarioId) => {
    onSelectScenario(targetScenarioId);
    setInputText(presetQuery);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-sat-950 border-r border-sat-800 flex flex-col items-center py-3 justify-between z-30 shrink-0">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-sat-900 rounded transition-colors"
          title="Expand Query Console"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4 text-sat-400 font-mono text-2xs">
          <Terminal className="w-4 h-4 text-sat-500" />
          <span className="[writing-mode:vertical-rl] tracking-widest uppercase font-semibold text-sat-400">
            QUERY CONSOLE
          </span>
        </div>

        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
      </div>
    );
  }

  return (
    <div className="w-full md:w-[32%] lg:w-[28%] bg-sat-950 border-r border-sat-800 flex flex-col h-full font-mono text-xs z-30 shrink-0 select-none">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-sat-800 bg-sat-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <div>
            <h2 className="text-xs font-bold text-sat-100 tracking-wider">
              MISSION QUERY CONSOLE
            </h2>
            <span className="text-[10px] text-sat-400 block -mt-0.5">
              ISRO SAC • VLM Ground-Station
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Spatially Grounded Answer Briefing (Active Result Summary) */}
      <div className="p-3 bg-sat-900/60 border-b border-sat-800 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-2xs text-sat-300 font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>ACTIVE GROUNDING: {activeScenario.locationName}</span>
          </div>
          <span className="text-2xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
            SOLVED
          </span>
        </div>

        <p className="text-sat-200 text-xs font-sans leading-relaxed">
          {activeScenario.naturalAnswer}
        </p>

        <div className="mt-2 flex items-center justify-between text-[10px] text-sat-400 font-mono">
          <span>COORDINATES: {activeScenario.coordinates.lat}°N, {activeScenario.coordinates.lon}°E</span>
          <span className="text-cyan-400">{activeScenario.groundingFeatures.length} FEATURES ANCHORED</span>
        </div>
      </div>

      {/* Query History Log Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] text-sat-500 uppercase tracking-wider font-semibold px-1">
          <span>MISSION CONVERSATION LOG</span>
          <span>{logs.length} ENTRIES</span>
        </div>

        {logs.map((log) => (
          <QueryHistoryItem
            key={log.id}
            entry={log}
            isActive={log.scenarioId === activeScenarioId}
            onSelect={() => onSelectScenario(log.scenarioId)}
          />
        ))}

        {/* Suggested Quick Prompts */}
        <div className="pt-2 border-t border-sat-800/80">
          <span className="text-[10px] text-sat-500 uppercase tracking-wider font-semibold block mb-1.5 px-1">
            EXPLORE PRESET QUERIES
          </span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() =>
                handlePresetClick(
                  'Show me flooding near Kochi in the last month and identify impacted transport corridors',
                  'kochi-flood'
                )
              }
              className="w-full text-left p-2 rounded bg-sat-900/40 hover:bg-sat-900 border border-sat-800/80 hover:border-cyan-500/40 transition-colors text-2xs text-sat-300 font-mono cursor-pointer"
            >
              <span className="text-cyan-400 font-bold mr-1">[Kochi Flood]</span>
              Show flooding in Kochi backwaters & transport cutoffs
            </button>

            <button
              type="button"
              onClick={() =>
                handlePresetClick(
                  'Detect slope displacement and fault activation near Joshimath between 2022 and 2024',
                  'joshimath-subsidence'
                )
              }
              className="w-full text-left p-2 rounded bg-sat-900/40 hover:bg-sat-900 border border-sat-800/80 hover:border-amber-500/40 transition-colors text-2xs text-sat-300 font-mono cursor-pointer"
            >
              <span className="text-amber-400 font-bold mr-1">[Joshimath Subsidence]</span>
              Detect slope displacement & InSAR deformation velocity
            </button>

            <button
              type="button"
              onClick={() =>
                handlePresetClick(
                  'What changed in Sundarbans mangrove fringe after the recent cyclone landfall?',
                  'sundarbans-erosion'
                )
              }
              className="w-full text-left p-2 rounded bg-sat-900/40 hover:bg-sat-900 border border-sat-800/80 hover:border-rose-500/40 transition-colors text-2xs text-sat-300 font-mono cursor-pointer"
            >
              <span className="text-rose-400 font-bold mr-1">[Sundarbans Shoreline]</span>
              What changed in Sundarbans mangrove canopy & shoreline?
            </button>
          </div>
        </div>
      </div>

      {/* Input Form at Bottom */}
      <div className="p-3 border-t border-sat-800 bg-sat-900/95 backdrop-blur-md shrink-0">
        {/* Sensor Modality Filters */}
        <div className="flex items-center gap-1.5 mb-2 text-[10px]">
          <span className="text-sat-500 uppercase">MODALITY:</span>
          {(['all', 'sar', 'optical', 'multimodal'] as SensorModality[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModality(m)}
              className={`px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                modality === m
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50'
                  : 'text-sat-400 hover:text-sat-200 bg-sat-950 border border-sat-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Text Input & Submit */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-stretch rounded border border-sat-700 bg-sat-950 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/30 transition-all">
            <span className="flex items-center pl-2.5 text-cyan-400 font-bold">&gt;</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query satellite imagery in plain text..."
              className="w-full bg-transparent px-2.5 py-2 text-sat-100 placeholder-sat-500 text-xs font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3 bg-sat-800 hover:bg-cyan-600 disabled:opacity-40 disabled:hover:bg-sat-800 text-sat-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Execute Natural Language Spatial Query (Enter)"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-sat-500 mt-1.5 px-0.5">
            <span>PRESS [ENTER] TO DISPATCH AGENTS</span>
            <span className="text-sat-400">ISRO SAC / BHUVAN</span>
          </div>
        </form>
      </div>
    </div>
  );
};
