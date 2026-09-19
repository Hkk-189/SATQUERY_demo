import React from 'react';
import type { DagNodeTelemetry } from '../../types';
import { X, Cpu, Clock, FileText, Database, Code, Zap } from 'lucide-react';

interface NodeInspectorModalProps {
  node: DagNodeTelemetry | null;
  onClose: () => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sat-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-sat-900 border border-sat-700 rounded-lg shadow-2xl font-mono text-xs overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sat-800 bg-sat-950">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-2xs font-bold">
              STEP 0{node.stepNumber}
            </span>
            <h3 className="text-sm font-bold text-sat-100">
              {node.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-sat-400 hover:text-sat-100 hover:bg-sat-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Metadata Row */}
          <div className="grid grid-cols-3 gap-2 text-2xs">
            <div className="bg-sat-950 p-2 rounded border border-sat-800">
              <span className="text-sat-400 block mb-0.5">SPECIALIST MODEL</span>
              <div className="flex items-center gap-1 text-amber-300 font-semibold truncate">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{node.specialistModel}</span>
              </div>
            </div>

            <div className="bg-sat-950 p-2 rounded border border-sat-800">
              <span className="text-sat-400 block mb-0.5">LATENCY & STATUS</span>
              <div className="flex items-center gap-1.5 text-sat-100 font-semibold">
                <Clock className="w-3.5 h-3.5 text-sat-400" />
                <span>{node.latencyMs} ms</span>
                <span className="text-emerald-400 font-bold ml-1">• COMPLETED</span>
              </div>
            </div>

            <div className="bg-sat-950 p-2 rounded border border-sat-800">
              <span className="text-sat-400 block mb-0.5">MODEL CONFIDENCE</span>
              <div className="flex items-center gap-1 text-cyan-400 font-bold text-sm">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{(node.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Rationale & Explainability Section */}
          <div className="bg-sat-950/80 border border-sat-800 rounded p-3">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>AGENTIC REASONING & RATIONALE</span>
            </div>
            <p className="text-sat-200 text-xs leading-relaxed font-sans">
              {node.details.rationale}
            </p>
          </div>

          {/* Architecture & Weights */}
          <div className="bg-sat-950/60 border border-sat-800 rounded p-3 grid grid-cols-2 gap-3 text-2xs">
            <div>
              <span className="text-sat-400 block mb-0.5 font-bold">NEURAL ARCHITECTURE</span>
              <span className="text-sat-200 font-mono">{node.details.architecture}</span>
            </div>
            <div>
              <span className="text-sat-400 block mb-0.5 font-bold">MODEL WEIGHTS / CHECKPOINT</span>
              <span className="text-amber-400 font-mono">{node.details.weights}</span>
            </div>
            {node.details.tensorShape && (
              <div className="col-span-2 pt-2 border-t border-sat-800/80">
                <span className="text-sat-400 block mb-0.5 font-bold">RASTER TENSOR SPECIFICATION</span>
                <span className="text-cyan-300 font-mono">{node.details.tensorShape}</span>
              </div>
            )}
          </div>

          {/* Input & Output Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 text-sat-400 text-2xs font-bold mb-1">
                <Code className="w-3 h-3 text-blue-400" />
                <span>INPUT PARAMETERS</span>
              </div>
              <pre className="bg-sat-950 p-2.5 rounded border border-sat-800 text-[11px] text-sat-300 font-mono overflow-x-auto max-h-48">
                {JSON.stringify(node.details.inputs, null, 2)}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-1 text-sat-400 text-2xs font-bold mb-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>OUTPUT TELEMETRY</span>
              </div>
              <pre className="bg-sat-950 p-2.5 rounded border border-sat-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-48">
                {JSON.stringify(node.details.outputs, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-sat-800 bg-sat-950 text-2xs text-sat-400">
          <span>DAG NODE ID: {node.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-sat-800 hover:bg-sat-700 text-sat-200 rounded font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
