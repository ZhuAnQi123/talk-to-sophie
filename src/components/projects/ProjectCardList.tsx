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
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full flex flex-col gap-4"
    >
      {projects.map((project) => {
        const isSelected = activeId === project.id;
        return (
          <motion.div
            layout
            variants={itemVariants}
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
    </motion.div>
  );
}
