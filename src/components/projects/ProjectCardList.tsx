import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fluidTransition } from "../../constants";
import { ProjectItem } from "./types";

interface ProjectCardListProps {
  lang: "zh" | "en";
  projects: ProjectItem[];
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}

export function ProjectCardList({
  lang,
  projects,
  activeId,
  setActiveId,
}: ProjectCardListProps) {
  return (
    <div className="w-full lg:w-5/12 flex flex-col gap-4">
      {projects.map((project) => {
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
              <h4 className="text-xl font-bold tracking-tight">{project.title}</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                {project.tag} {lang === "zh" ? "架构驱动层" : "Architecture Layer"}
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
  );
}
