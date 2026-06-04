import { Handle, Position } from '@xyflow/react';
import { AppNode } from './types';
import { BrainCircuit, Database, Wrench, User, CheckCircle2, Loader2, AlertCircle, Clock, LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatusConfigType = {
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  spin?: boolean;
};

const statusConfig: Record<string, StatusConfigType> = {
  idle: { icon: Clock, color: 'text-neutral-500', bg: 'bg-neutral-800/50', border: 'border-neutral-700' },
  running: { icon: Loader2, color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/50', spin: true },
  success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-neutral-900/80', border: 'border-neutral-600' },
  blocked: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-500/50' },
  retrying: { icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-500/50', spin: true },
};

const typeConfig = {
  agent: { icon: BrainCircuit, label: 'AGENT' },
  memory: { icon: Database, label: 'MEMORY' },
  tool: { icon: Wrench, label: 'TOOL' },
  input: { icon: User, label: 'INPUT' },
  output: { icon: CheckCircle2, label: 'OUTPUT' },
};

export const CustomNode = ({ data, selected }: { data: AppNode['data']; selected?: boolean }) => {
  const status = statusConfig[data.status];
  const type = typeConfig[data.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <div
      className={cn(
        'relative min-w-[220px] p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300',
        status.bg,
        selected ? 'border-neutral-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : status.border,
        'hover:border-neutral-400 cursor-pointer'
      )}
    >
      {/* Handles */}
      {data.type !== 'input' && (
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-neutral-400 border-none" />
      )}
      {data.type !== 'output' && (
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-neutral-400 border-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TypeIcon size={14} className="text-neutral-400" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400">
            {type.label}
          </span>
        </div>
        <StatusIcon size={14} className={cn(status.color, status.spin && 'animate-spin')} />
      </div>

      {/* Body */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">{data.label}</h3>
        {data.description && (
          <p className="text-[10px] text-neutral-400 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}
      </div>

      {/* Running Indicator */}
      {data.status === 'running' && (
        <div className="absolute -bottom-px left-0 w-full h-[2px] bg-neutral-800 overflow-hidden rounded-b-2xl">
          <div className="h-full bg-emerald-500 w-1/3 animate-[slide_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
};
