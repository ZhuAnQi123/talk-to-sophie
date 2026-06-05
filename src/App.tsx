import { } from "react";
import { HeroSection } from "./components/HeroSection";
import { ProjectSection } from "./components/ProjectSection";
import { BarChart3, Database, Zap, Globe } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

export default function App() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="bg-[#FBFBFA] text-neutral-900 overflow-x-hidden min-h-screen font-sans selection:bg-neutral-900 selection:text-white">
      {/* 固定导航栏 */}
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-extrabold tracking-tighter text-white">
          {lang === 'zh' ? '朱安琪 | Sophie Zhu' : 'Sophie Zhu'}
        </div>
        <div className="flex items-center gap-6 md:gap-8 text-sm font-bold tracking-tight text-neutral-400">
          <a href="#hero" className="hover:text-white transition-colors">
            {lang === 'zh' ? '对话' : 'Chat'}
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            {lang === 'zh' ? '作品集' : 'Projects'}
          </a>
          <a href="#dashboard" className="hover:text-white transition-colors">
            {lang === 'zh' ? '数据看板' : 'Dashboard'}
          </a>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-all backdrop-blur-md cursor-pointer"
          >
            <Globe size={14} />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </nav>

      {/* 核心板块组装 */}
      <main>
        <HeroSection />
        <ProjectSection />

        {/* 动态仪表盘看板 */}
        <section
          id="dashboard"
          className="py-32 px-6 md:px-12 max-w-7xl mx-auto"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">
            // {lang === 'zh' ? '数据遥测看板' : 'TELEMETRY PROFILER'}
          </span>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2 mb-12 text-neutral-950">
            {lang === 'zh' ? 'AI 基础设施墙.' : 'AI Infrastructure Wall.'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 卡片 1 - 比例图表 */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                  {lang === 'zh' ? 'LLM 调用比例' : 'LLM Distribution Ratio'}
                </span>
                <BarChart3 size={16} className="text-neutral-300" />
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Claude 3.5 Sonnet</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full">
                    <div
                      className="bg-neutral-950 h-1.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>DeepSeek-V3</span>
                    <span>40%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full">
                    <div
                      className="bg-neutral-500 h-1.5 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>GPT-4o</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full">
                    <div
                      className="bg-neutral-200 h-1.5 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片 2 - 向量库 */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                  {lang === 'zh' ? '向量数据库嵌入' : 'VectorDB Embeddings'}
                </span>
                <Database size={16} className="text-neutral-300" />
              </div>
              <div className="pt-4">
                <h4 className="text-4xl font-extrabold tracking-tight text-neutral-950">
                  124,850
                </h4>
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  {lang === 'zh' ? '分块上下文已注入个人私有知识库集群' : 'Chunks injected into personal private knowledge base cluster'}
                </p>
              </div>
            </div>

            {/* 卡片 3 - Token 压缩率 */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/40 flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                  {lang === 'zh' ? '上下文压缩率' : 'Context Compression Rate'}
                </span>
                <Zap size={16} className="text-neutral-300" />
              </div>
              <div className="pt-4">
                <h4 className="text-4xl font-extrabold tracking-tight text-neutral-950">
                  34.2%
                </h4>
                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  {lang === 'zh' ? '通过 AST 剪裁算法平均节省的开发 Token 费用' : 'Average token cost saved via AST pruning algorithms'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-100 py-12 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Sophie Zhu. All rights reserved. Designed with Streaming UI paradigms.
      </footer>
    </div>
  );
}
