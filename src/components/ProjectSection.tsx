import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { PROJECTS_DATA } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { ProjectCardList } from "./projects/ProjectCardList";
import { ProjectSandboxPanel } from "./projects/ProjectSandboxPanel";
import { ProjectItem } from "./projects/types";

export const ProjectSection: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const { lang } = useLanguage();
  const projects = Object.values(PROJECTS_DATA[lang]) as ProjectItem[];
  const activeProject = projects.find((project) => project.id === activeId) ?? null;
  const isMobile = useIsMobile();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  // Left Sandbox: negative Y translation (moves up faster than scroll)
  const leftY = useTransform(scrollYProgress, [0, 1], [isMobile ? "0%" : "10%", isMobile ? "0%" : "-10%"]);
  // Right List: positive Y translation (moves up slower than scroll)
  const rightY = useTransform(scrollYProgress, [0, 1], [isMobile ? "0%" : "-10%", isMobile ? "0%" : "10%"]);

  // Make the whole section move up slower when scrolling out, so the next section slides over it
  const { scrollYProgress: scrollOutProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "end start"],
  });
  const sectionY = useTransform(scrollOutProgress, [0, 1], ["0%", isMobile ? "0%" : "30%"]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY }}
      id="projects"
      className="min-h-screen py-32 px-6 md:px-12 bg-neutral-950 text-white rounded-t-[40px] relative overflow-hidden z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6"
        >
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
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <motion.div 
            style={{ y: leftY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-7/12"
          >
            <ProjectSandboxPanel lang={lang} activeProject={activeProject} />
          </motion.div>
          
          <motion.div 
            style={{ y: rightY }}
            className="w-full lg:w-5/12"
          >
            <ProjectCardList
              lang={lang}
              projects={projects}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
