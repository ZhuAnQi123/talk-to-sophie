import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  NodeMouseHandler,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { getInitialNodes, getInitialEdges } from './flowData';
import { CustomNode } from './CustomNodes';
import { InspectorPanel } from './InspectorPanel';
import { AppNode } from './types';
import { useLanguage } from '../../context/LanguageContext';

const nodeTypes = {
  customNode: CustomNode,
};

export const AgentFlowCanvas = () => {
  const { lang } = useLanguage();
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(lang));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(lang));
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);

  useEffect(() => {
    setNodes(getInitialNodes(lang));
    setEdges(getInitialEdges(lang));
    setSelectedNode(null);
  }, [lang, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node as AppNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full relative bg-neutral-950 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="bg-neutral-950"
        style={{ background: '#0a0a0a' }}
      >
        <Background color="#333" gap={16} size={1} />
        <Controls 
          className="!bg-neutral-900 !border-neutral-800 [&>button]:!bg-neutral-900 [&>button]:!border-neutral-800 [&>button>svg]:!fill-neutral-400 hover:[&>button>svg]:!fill-white" 
          showInteractive={false}
        />
      </ReactFlow>

      <InspectorPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};
