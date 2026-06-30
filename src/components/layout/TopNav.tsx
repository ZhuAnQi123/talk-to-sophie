import { Globe } from "lucide-react";

interface TopNavProps {
  lang: "zh" | "en";
  toggleLang: () => void;
  showBrand: boolean;
}

export function TopNav({ lang, toggleLang, showBrand }: TopNavProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference">
      <div
        className={`text-xl md:text-2xl font-extrabold tracking-tighter text-white transition-opacity duration-500 ${
          showBrand ? "opacity-100" : "opacity-0"
        }`}
      >
        {"Sophie Zhu"}
      </div>{" "}
      <div className="flex items-center gap-6 md:gap-8 text-sm font-bold tracking-tight text-neutral-400">
        <a href="#hero" className="hover:text-white transition-colors">
          {lang === "zh" ? "对话" : "Chat"}
        </a>
        <a href="#projects" className="hover:text-white transition-colors">
          {lang === "zh" ? "作品集" : "Projects"}
        </a>
        <a href="#dashboard" className="hover:text-white transition-colors">
          {lang === "zh" ? "数据看板" : "Dashboard"}
        </a>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-all backdrop-blur-md cursor-pointer"
        >
          <Globe size={14} />
          {lang === "zh" ? "EN" : "中文"}
        </button>
      </div>
    </nav>
  );
}
