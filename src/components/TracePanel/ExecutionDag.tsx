import React, { useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DagNode } from './DagNode';
import type { DagNodeTelemetry } from '../../types';

const nodeTypes = {
  dagStep: DagNode,
};

interface ExecutionDagProps {
  dagNodes: DagNodeTelemetry[];
  onSelectNode: (node: DagNodeTelemetry) => void;
  selectedNodeId: string | null;
  activeRunningStep?: number | null;
}

export const ExecutionDag: React.FC<ExecutionDagProps> = ({
  dagNodes,
  onSelectNode,
  selectedNodeId,
  activeRunningStep = null,
}) => {
  // Build React Flow nodes from scenario dagNodes
  const initialNodes: Node[] = useMemo(() => {
    return dagNodes.map((n, idx) => {
      const x = idx * 340 + 40;
      const y = idx % 2 === 1 ? 70 : 20;

      const status = activeRunningStep !== null
        ? n.stepNumber < activeRunningStep
          ? 'completed'
          : n.stepNumber === activeRunningStep
          ? 'running'
          : 'queued'
        : n.status;

      return {
        id: n.id,
        type: 'dagStep',
        position: { x, y },
        selected: selectedNodeId === n.id,
        data: {
          ...n,
          status,
          onSelectNode,
        },
      };
    });
  }, [dagNodes, onSelectNode, selectedNodeId, activeRunningStep]);

  // Build React Flow edges connecting step n -> step n+1
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < dagNodes.length - 1; i++) {
      const source = dagNodes[i].id;
      const target = dagNodes[i + 1].id;
      const isAnimated = activeRunningStep !== null && dagNodes[i].stepNumber <= activeRunningStep;

      edges.push({
        id: `e-${source}-${target}`,
        source,
        target,
        type: 'smoothstep',
        animated: isAnimated,
        style: {
          stroke: isAnimated ? '#38bdf8' : '#2c4159',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isAnimated ? '#38bdf8' : '#2c4159',
          width: 14,
          height: 14,
        },
      });
    }
    return edges;
  }, [dagNodes, activeRunningStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when dagNodes or activeRunningStep changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-sat-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.6}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#1e2c3c"
        />
        <Controls
          className="!bg-sat-900 !border !border-sat-700 !rounded !shadow-lg [&>button]:!bg-sat-900 [&>button]:!border-b [&>button]:!border-sat-800 [&>button]:!text-sat-300 hover:[&>button]:!text-white"
        />
        <MiniMap
          nodeColor={() => '#0284c7'}
          maskColor="rgba(9, 13, 19, 0.85)"
          className="!bg-sat-900 !border !border-sat-800 !rounded hidden sm:block"
        />
      </ReactFlow>
    </div>
  );
};
