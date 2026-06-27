import { motion } from "framer-motion";
import { Command } from "lucide-react";
import { Persona } from "./types";

interface PersonaToggleProps {
  persona: Persona;
  setPersona: (persona: Persona) => void;
}

export function PersonaToggle({ persona, setPersona }: PersonaToggleProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`absolute -top-14 left-1/2 -translate-x-1/2 z-10 flex items-center p-1 rounded-full backdrop-blur-xl border transition-all duration-700 shadow-lg ${
        persona === "sophie"
          ? "bg-white/70 border-neutral-200/50 shadow-neutral-200/50"
          : "bg-[#f5f2fa]/90 border-violet-200/50 shadow-violet-100/60"
      }`}
    >
      <div
        className={`flex items-center px-2 mr-2 border-r transition-colors duration-700 ${
          persona === "sophie" ? "border-neutral-300/30" : "border-amber-300/30"
        }`}
      >
        <Command
          size={14}
          className={persona === "sophie" ? "text-neutral-400" : "text-amber-600/70"}
        />
        <span
          className={`text-[10px] font-bold ml-1 transition-colors duration-700 ${
            persona === "sophie" ? "text-neutral-400" : "text-amber-600/70"
          }`}
        >
          ⌘K
        </span>
      </div>
      <button
        onClick={() => setPersona("sophie")}
        className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${
          persona === "sophie" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-600"
        }`}
      >
        {persona === "sophie" && (
          <motion.div
            layoutId="pill-bg"
            className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
          />
        )}
        Sophie
      </button>
      <button
        onClick={() => setPersona("naval")}
        className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${
          persona === "naval" ? "text-amber-700" : "text-neutral-500 hover:text-neutral-600"
        }`}
      >
        {persona === "naval" && (
          <motion.div
            layoutId="pill-bg"
            className="absolute inset-0 bg-violet-100/80 rounded-full shadow-sm -z-10"
          />
        )}
        Naval
      </button>
    </motion.div>
  );
}
