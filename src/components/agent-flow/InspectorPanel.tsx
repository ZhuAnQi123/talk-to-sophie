import { motion, AnimatePresence } from 'framer-motion';
import { AppNode } from './types';
import { Terminal, Activity, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface InspectorPanelProps {
  node: AppNode | null;
  onClose: () => void;
}

export const InspectorPanel = ({ node, onClose }: InspectorPanelProps) => {
  const { lang } = useLanguage();
  
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-4 right-4 bottom-4 w-80 bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-neutral-300">
                {lang === 'zh' ? '节点检查器' : 'NODE INSPECTOR'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 space-y-6">
            {/* Title & Desc */}
            <div>
              <h3 className="text-xl font-extrabold text-white mb-2">{node.data.label}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {node.data.description}
              </p>
            </div>

            {/* Details */}
            {node.data.details && (
              <div className="space-y-4">
                {Object.entries(node.data.details).map(([key, value]) => (
                  <div key={key} className="space-y-1.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {key}
                    </span>
                    <div className="bg-neutral-950/50 rounded-xl p-3 border border-neutral-800/50">
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1.5">
                          {value.map((v, i) => (
                            <span key={i} className="text-xs bg-neutral-800 px-2 py-1 rounded-md text-neutral-300">
                              {v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {value as string}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Logs */}
            {node.data.logs && node.data.logs.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase">
                  <Terminal size={12} />
                  <span>{lang === 'zh' ? '执行日志' : 'Execution Logs'}</span>
                </div>
                <div className="bg-black/60 rounded-xl p-3 border border-neutral-800/50 space-y-2">
                  {node.data.logs.map((log, i) => (
                    <div key={i} className="flex gap-2 text-[10px] font-mono">
                      <span className="text-neutral-600 shrink-0">
                        [{String(i + 1).padStart(2, '0')}]
                      </span>
                      <span className={i === node.data.logs!.length - 1 ? 'text-emerald-400' : 'text-neutral-400'}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
