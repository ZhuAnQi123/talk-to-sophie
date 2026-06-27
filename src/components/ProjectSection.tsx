import { useState } from "react";
import { PROJECTS_DATA } from "../constants";
import { useLanguage } from "../context/LanguageContext";
import { ProjectCardList } from "./projects/ProjectCardList";
import { ProjectSandboxPanel } from "./projects/ProjectSandboxPanel";
import { ProjectItem } from "./projects/types";

export const ProjectSection: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const { lang } = useLanguage();
  const projects = Object.values(PROJECTS_DATA[lang]) as ProjectItem[];
  const activeProject = projects.find((project) => project.id === activeId) ?? null;

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

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <ProjectSandboxPanel lang={lang} activeProject={activeProject} />
          <ProjectCardList
            lang={lang}
            projects={projects}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        </div>
      </div>
    </section>
  );
};
