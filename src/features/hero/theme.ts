import { HeroTheme, Persona } from "./types";

export function getHeroTheme(persona: Persona): HeroTheme {
  return {
    bgCard:
      persona === "sophie"
        ? "bg-white/60 border-white/80"
        : "bg-[#f5f2fa]/75 border-[#e8e2f0]/90",
    textMain: persona === "sophie" ? "text-neutral-900" : "text-neutral-800",
    textSub: persona === "sophie" ? "text-neutral-500" : "text-amber-600/80",
    pingColor: persona === "sophie" ? "bg-emerald-500" : "bg-amber-500",
    pingGlow: persona === "sophie" ? "bg-emerald-400" : "bg-amber-400",
    badgeBg:
      persona === "sophie"
        ? "bg-neutral-900 text-white"
        : "bg-amber-50 text-amber-700 border border-amber-200/70",
    userMsgBg:
      persona === "sophie"
        ? "bg-neutral-900 text-white"
        : "bg-gradient-to-br from-violet-200/90 to-amber-100/90 text-neutral-800",
    aiMsgBg:
      persona === "sophie"
        ? "bg-white/90 border-neutral-100 text-neutral-800"
        : "bg-white/80 border-violet-100/80 text-neutral-700",
    aiAvatarBg: persona === "sophie" ? "bg-neutral-950" : "bg-amber-500",
    inputBg:
      persona === "sophie"
        ? "bg-white border-neutral-200 focus-within:border-neutral-900"
        : "bg-white/90 border-violet-100 focus-within:border-amber-400/60",
    inputText: persona === "sophie" ? "text-neutral-800" : "text-neutral-700",
    sendBtnBg:
      persona === "sophie"
        ? "bg-neutral-950 hover:bg-neutral-800 text-white"
        : "bg-amber-500 hover:bg-amber-400 text-white",
  };
}
