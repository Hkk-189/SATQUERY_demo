import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CheckCircle2, Clock, Cpu, ArrowUpRight, Loader2 } from 'lucide-react';
import type { DagNodeTelemetry } from '../../types';

export const DagNode: React.FC<NodeProps> = ({ data, selected }) => {
  const node = data as unknown as DagNodeTelemetry & {
    onSelectNode?: (node: DagNodeTelemetry) => void;
  };

  const isCompleted = node.status === 'completed';
  const isRunning = node.status === 'running';

  const categoryColors = {
    ingest: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    alignment: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    spectroradiometry: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    segmentation: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    vlm_reasoning: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    synthesis: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  };

  const catStyle = categoryColors[node.category] || categoryColors.ingest;

  return (
    <div
      onClick={() => node.onSelectNode && node.onSelectNode(node)}
      className={`relative w-72 bg-sat-900 border rounded-md font-mono text-xs shadow-2xl transition-all cursor-pointer group ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-glow'
          : isRunning
          ? 'border-cyan-500 animate-pulse-subtle'
          : 'border-sat-700 hover:border-sat-500'
      }`}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-sat-600 !border-2 !border-sat-900 group-hover:!bg-cyan-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-sat-600 !border-2 !border-sat-900 group-hover:!bg-cyan-400"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-sat-800 bg-sat-950/60 rounded-t-md">
        <div className="flex items-center gap-1.5">
          <span className="text-sat-400 text-2xs font-bold tracking-wider">
            STEP 0{node.stepNumber}
          </span>
          <span className={`text-[9px] uppercase font-semibold px-1 py-0.2 rounded border ${catStyle}`}>
            {node.category}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-400 text-2xs font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>OK</span>
            </span>
          )}
          {isRunning && (
            <span className="flex items-center gap-1 text-cyan-400 text-2xs font-semibold">
              <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              <span>RUN</span>
            </span>
          )}
          {node.status === 'queued' && (
            <span className="text-sat-500 text-2xs">QUEUE</span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h4 className="text-sat-100 font-semibold text-xs leading-snug group-hover:text-cyan-300 transition-colors">
            {node.title}
          </h4>
          <ArrowUpRight className="w-3.5 h-3.5 text-sat-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center gap-1 text-sat-400 text-2xs mb-2">
          <Cpu className="w-3 h-3 text-amber-400/80" />
          <span className="truncate">{node.specialistModel}</span>
        </div>

        {/* Snippet */}
        <p className="text-sat-300 text-[11px] leading-relaxed line-clamp-2 mb-2.5 bg-sat-950/40 p-1.5 rounded border border-sat-800/80">
          {node.summary}
        </p>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-sat-800 text-[10px] text-sat-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-sat-400" />
            <span>{node.latencyMs} ms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sat-400">CONF:</span>
            <span className="text-cyan-400 font-bold">
              {(node.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
