import React, { useState } from 'react';
import type { DagNodeTelemetry } from '../../types';
import { ExecutionDag } from './ExecutionDag';
import { NodeInspectorModal } from './NodeInspectorModal';
import {
  Network,
  Play,
  PanelBottomClose,
  PanelRightClose,
  Minimize2,
  Clock,
  Zap,
  Cpu,
} from 'lucide-react';

interface TracePanelProps {
  dagNodes: DagNodeTelemetry[];
  layoutMode: 'bottom' | 'right';
  onToggleLayoutMode: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSimulateExecution?: () => void;
  activeRunningStep?: number | null;
}

export const TracePanel: React.FC<TracePanelProps> = ({
  dagNodes,
  layoutMode,
  onToggleLayoutMode,
  isOpen,
  onToggleOpen,
  onSimulateExecution,
  activeRunningStep = null,
}) => {
  const [selectedNode, setSelectedNode] = useState<DagNodeTelemetry | null>(null);

  const totalLatency = dagNodes.reduce((acc, n) => acc + n.latencyMs, 0);
  const avgConfidence =
    dagNodes.length > 0
      ? (dagNodes.reduce((acc, n) => acc + n.confidence, 0) / dagNodes.length) * 100
      : 0;

  if (!isOpen) {
    return (
      <div className="bg-sat-900 border-t sm:border-t-0 sm:border-l border-sat-800 p-2 flex items-center justify-between font-mono text-xs z-30">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
        >
          <Network className="w-4 h-4" />
          <span>SHOW EXECUTION DAG ({dagNodes.length} NODES)</span>
        </button>
        <div className="flex items-center gap-3 text-sat-400 text-2xs">
          <span>LATENCY: {totalLatency}ms</span>
          <span>CONF: {avgConfidence.toFixed(1)}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-sat-950 border-t sm:border-t-0 sm:border-l border-sat-800 font-mono text-xs overflow-hidden">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-sat-800 bg-sat-900/90 backdrop-blur-md shrink-0">
        {/* Left Title & Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sat-100 font-bold">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="tracking-wide">EXPLAINABLE EXECUTION DAG</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-2xs">
            <span className="bg-sat-950 border border-sat-800 px-2 py-0.5 rounded text-sat-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sat-400" />
              <span>{totalLatency} ms</span>
            </span>

            <span className="bg-sat-950 border border-sat-800 px-2 py-0.5 rounded text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{avgConfidence.toFixed(1)}% CONF</span>
            </span>

            <span className="bg-sat-950 border border-sat-800 px-2 py-0.5 rounded text-amber-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>{dagNodes.length} SPECIALISTS</span>
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {onSimulateExecution && (
            <button
              type="button"
              onClick={onSimulateExecution}
              className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded text-2xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulate Agentic Step-by-Step Live Execution"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Simulate Run</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleLayoutMode}
            className="p-1 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors"
            title={`Switch to ${layoutMode === 'bottom' ? 'Right Sidebar' : 'Bottom Drawer'} Mode`}
          >
            {layoutMode === 'bottom' ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelBottomClose className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 text-sat-400 hover:text-sat-100 hover:bg-sat-800 rounded transition-colors"
            title="Minimize Trace Panel"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DAG Flow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ExecutionDag
          dagNodes={dagNodes}
          onSelectNode={(node) => setSelectedNode(node)}
          selectedNodeId={selectedNode ? selectedNode.id : null}
          activeRunningStep={activeRunningStep}
        />
      </div>

      {/* Inspect Node Details Modal */}
      <NodeInspectorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};
