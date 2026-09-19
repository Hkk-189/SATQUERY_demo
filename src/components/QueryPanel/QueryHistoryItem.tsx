import React from 'react';
import type { QueryLogEntry } from '../../types';
import { Terminal, Layers, Clock } from 'lucide-react';

interface QueryHistoryItemProps {
  entry: QueryLogEntry;
  isActive: boolean;
  onSelect: () => void;
}

export const QueryHistoryItem: React.FC<QueryHistoryItemProps> = ({
  entry,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-3 rounded border font-mono text-xs cursor-pointer transition-all ${
        isActive
          ? 'bg-sat-900 border-cyan-400 ring-1 ring-cyan-400/40 shadow-telemetry'
          : 'bg-sat-950/80 border-sat-800 hover:border-sat-700 hover:bg-sat-900/60'
      }`}
    >
      {/* Header Log Meta */}
      <div className="flex items-center justify-between text-2xs text-sat-400 mb-1.5 pb-1 border-b border-sat-800/80">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span className="text-sat-300 font-semibold">{entry.timestamp}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-emerald-400 font-bold">
            {(entry.confidenceScore * 100).toFixed(1)}% CONF
          </span>
        </div>
      </div>

      {/* Query Text */}
      <div className="text-sat-100 font-medium text-xs mb-2 leading-snug">
        <span className="text-cyan-400 font-bold mr-1">&gt;</span>
        {entry.queryText}
      </div>

      {/* AOI and Sensor Tags */}
      <div className="flex flex-wrap items-center gap-1 mb-2">
        <span className="bg-sat-900 border border-sat-700/80 text-sat-300 text-[10px] px-1.5 py-0.5 rounded">
          AOI: {entry.aoiName}
        </span>
        {entry.sensorTags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-sat-900/90 border border-sat-800 text-cyan-300 text-[9px] px-1.5 py-0.2 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Summary Snippet */}
      <p className="text-sat-400 text-[11px] leading-relaxed line-clamp-2 bg-sat-950 p-1.5 rounded border border-sat-900">
        {entry.summarySnippet}
      </p>

      {/* Bottom Telemetry Bar */}
      <div className="mt-2 pt-1.5 border-t border-sat-800/80 flex items-center justify-between text-[10px] text-sat-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {entry.executionTimeSec}s
        </span>
        <span className="flex items-center gap-1 text-sat-400">
          <Layers className="w-3 h-3 text-cyan-400" />
          {entry.groundedFeatureCount} Grounded Polygons
        </span>
      </div>
    </div>
  );
};
