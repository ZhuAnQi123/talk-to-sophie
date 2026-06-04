import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Terminal, Cpu, Activity } from "lucide-react";
import { fluidTransition, PROJECTS_DATA } from "../constants";
import { useLanguage } from "../context/LanguageContext";

import { AgentFlowCanvas } from "./agent-flow/AgentFlowCanvas";

export const ProjectSection: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const { lang } = useLanguage();
  
  const activeProject = activeId
    ? PROJECTS_DATA[lang][activeId as keyof typeof PROJECTS_DATA['zh']]
    : null;

  return (
    <section
      id="projects"
      className="min-h-screen py-32 px-6 md:px-12 bg-neutral-950 text-white rounded-t-[40px] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              // SHOWCASE LANDSCAPE
            </span>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter mt-2">
              Selected LLM Works.
            </h3>
          </div>
          <p className="text-neutral-400 max-w-sm text-sm leading-relaxed">
            {lang === 'zh' 
              ? '点击右侧任意独立项目，激活高阶流体布局收缩动效，左侧将同步投射高仿真 AI 能力透视沙盒。'
              : 'Click any independent project on the right to activate high-order fluid layout animations. The left side will synchronously project a high-fidelity AI capability sandbox.'}
          </p>
        </div>

        {/* 核心联动区：左侧沙盒，右侧卡片流 */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 左侧：沙盒面板（响应式动画布局） */}
          <motion.div
            layout
            transition={fluidTransition}
            className="w-full lg:w-7/12 bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-8 flex flex-col justify-center min-h-[460px] relative overflow-hidden"
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
                    {lang === 'zh' 
                      ? '请在右侧选择任意研发成果以启动物理拓扑与 Token 控制台模拟'
                      : 'Please select any R&D achievement on the right to launch the physical topology and Token console simulation'}
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
                        <Activity size={12} className="animate-pulse" /> LIVE
                        AGENT PIPELINE
                      </div>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                      {activeProject.title}
                    </h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {activeProject.desc}
                    </p>
                  </div>

                  {/* 核心代码/数据模拟控制台 */}
                  <div className="bg-black/80 rounded-2xl p-5 border border-neutral-800/80 font-mono text-xs my-6 flex-1 space-y-2">
                    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-neutral-500 mb-3">
                      <Terminal size={12} /> TELEMETRY STREAM LOGS
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

                  <button className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors cursor-pointer text-center">
                    {lang === 'zh' ? '深度解析该线上产品 +' : 'Deep Dive into this Product +'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 右侧：卡片流折叠区（复刻视频多米诺动画） */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            {Object.values(PROJECTS_DATA[lang]).map((project) => {
              const isSelected = activeId === project.id;
              return (
                <motion.div
                  layout
                  key={project.id}
                  onClick={() => setActiveId(isSelected ? null : project.id)}
                  transition={fluidTransition}
                  className={`p-6 rounded-2xl border cursor-pointer flex justify-between items-center transition-all group relative overflow-hidden ${
                    isSelected
                      ? "bg-neutral-800 border-neutral-500 shadow-xl"
                      : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-mono text-neutral-500 block">
                      0{project.id} / SUBMODULE
                    </span>
                    <h4 className="text-xl font-bold tracking-tight">
                      {project.title}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-sm">
                      {project.tag} {lang === 'zh' ? '架构驱动层' : 'Architecture Layer'}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: isSelected ? 90 : 0 }}
                    transition={fluidTransition}
                    className="text-neutral-500 group-hover:text-white transition-colors relative z-10"
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
