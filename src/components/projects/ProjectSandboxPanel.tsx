import { AnimatePresence, motion } from "framer-motion";
import { Activity, Cpu, Terminal } from "lucide-react";
import { fluidTransition } from "../../constants";
import { AgentFlowCanvas } from "../agent-flow/AgentFlowCanvas";
import { ProjectItem } from "./types";

interface ProjectSandboxPanelProps {
  lang: "zh" | "en";
  activeProject: ProjectItem | null;
}

export function ProjectSandboxPanel({ lang, activeProject }: ProjectSandboxPanelProps) {
  return (
    <motion.div
      layout
      transition={fluidTransition}
      className="w-full h-full bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-8 flex flex-col justify-center min-h-[460px] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!activeProject ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4 flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center border border-neutral-700">
              <Cpu size={24} className="text-neutral-500 animate-pulse" />
            </div>
            <p className="text-neutral-400 text-sm max-w-xs font-medium">
              {lang === "zh"
                ? "请在右侧选择任意研发成果以启动物理拓扑与 Token 控制台模拟"
                : "Please select any R&D achievement on the right to launch the physical topology and Token console simulation"}
            </p>
          </motion.div>
        ) : activeProject.id === 3 ? (
          <motion.div
            key="flow-canvas"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full absolute inset-0"
          >
            <AgentFlowCanvas />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded uppercase">
                  {activeProject.tag}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <Activity size={12} className="animate-pulse" /> LIVE AGENT PIPELINE
                </div>
              </div>
              <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {activeProject.title}
              </h4>
              <p className="text-neutral-400 text-sm leading-relaxed">{activeProject.desc}</p>
            </div>

            <div className="bg-black/80 rounded-2xl p-5 border border-neutral-800/80 font-mono text-xs my-6 flex-1 space-y-2">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-neutral-500 mb-3">
                <Terminal size={12} /> TELEMETRY
              </div>
              {activeProject.consoleLogs.map((log, index) => (
                <motion.p
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  key={index}
                  className={
                    index === activeProject.consoleLogs.length - 1
                      ? "text-emerald-400 font-semibold"
                      : "text-neutral-300"
                  }
                >
                  {log}
                </motion.p>
              ))}
            </div>

            <a
              href={activeProject.url && activeProject.url !== "#" ? activeProject.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors cursor-pointer text-center block"
            >
              {lang === "zh" ? "查看作品 +" : "Deep Dive into this Product +"}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
