import { Node, Edge } from '@xyflow/react';

export type NodeType = 'agent' | 'memory' | 'tool' | 'input' | 'output';

export interface NodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  status: 'idle' | 'running' | 'success' | 'blocked' | 'retrying';
  description?: string;
  logs?: string[];
  details?: {
    model?: string;
    prompt?: string;
    tools?: string[];
    memory?: string;
    input?: string;
    output?: string;
  };
}

export type AppNode = Node<NodeData>;
export type AppEdge = Edge;
