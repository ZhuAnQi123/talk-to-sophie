import { motion } from "framer-motion";
import { BarChart3, Database, Zap } from "lucide-react";
import { LLMBarRow, ScrollCounter, useInViewOnce } from "../ScrollCounter";

interface TelemetryDashboardSectionProps {
  lang: "zh" | "en";
}

export function TelemetryDashboardSection({ lang }: TelemetryDashboardSectionProps) {
  const { ref: dashboardRef, inView: dashboardInView } = useInViewOnce<HTMLDivElement>();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 100,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section id="dashboard" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20 bg-[#FBFBFA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">
          // {lang === "zh" ? "数据遥测看板" : "TELEMETRY PROFILER"}
        </span>
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2 mb-12 text-neutral-950">
          {lang === "zh" ? "AI 基础设施墙." : "AI Infrastructure Wall."}
        </h3>
      </motion.div>

      <motion.div 
        ref={dashboardRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={cardVariants} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-4">
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
              {lang === "zh" ? "LLM 调用比例" : "LLM Distribution Ratio"}
            </span>
            <BarChart3 size={16} className="text-neutral-300" />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3 pt-2">
            <LLMBarRow
              label="Claude 3.5 Sonnet"
              value={45}
              active={dashboardInView}
              barClassName="bg-neutral-950"
            />
            <LLMBarRow
              label="DeepSeek-V3"
              value={40}
              active={dashboardInView}
              barClassName="bg-neutral-500"
            />
            <LLMBarRow
              label="GPT-4o"
              value={15}
              active={dashboardInView}
              barClassName="bg-neutral-200"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={cardVariants} className="md:translate-y-8 bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 flex flex-col justify-between min-h-[160px]">
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
              {lang === "zh" ? "向量数据库嵌入" : "VectorDB Embeddings"}
            </span>
            <Database size={16} className="text-neutral-300" />
          </motion.div>
          <motion.div variants={itemVariants} className="pt-4">
            <h4 className="text-4xl font-extrabold tracking-tight text-neutral-950">
              <ScrollCounter value={124850} active={dashboardInView} />
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              {lang === "zh"
                ? "分块上下文已注入个人私有知识库集群"
                : "Chunks injected into personal private knowledge base cluster"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 flex flex-col justify-between min-h-[160px]">
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
              {lang === "zh" ? "上下文压缩率" : "Context Compression Rate"}
            </span>
            <Zap size={16} className="text-neutral-300" />
          </motion.div>
          <motion.div variants={itemVariants} className="pt-4">
            <h4 className="text-4xl font-extrabold tracking-tight text-neutral-950">
              <ScrollCounter
                value={34.2}
                active={dashboardInView}
                decimals={1}
                suffix="%"
              />
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              {lang === "zh"
                ? "通过 AST 剪裁算法平均节省的开发 Token 费用"
                : "Average token cost saved via AST pruning algorithms"}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
