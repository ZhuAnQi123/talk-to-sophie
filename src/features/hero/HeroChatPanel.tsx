import { MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Database, Sparkles } from "lucide-react";
import { fluidTransition } from "../../constants";
import { INPUT_PLACEHOLDER } from "./constants";
import { HeroTheme, Lang, Persona, ChatMessage } from "./types";

interface HeroChatPanelProps {
  lang: Lang;
  persona: Persona;
  theme: HeroTheme;
  forceWeb: boolean;
  setForceWeb: (next: boolean) => void;
  messages: ChatMessage[];
  chatScrollRef: MutableRefObject<HTMLDivElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: (value: string) => void;
}

export function HeroChatPanel({
  lang,
  persona,
  theme,
  forceWeb,
  setForceWeb,
  messages,
  chatScrollRef,
  inputValue,
  setInputValue,
  handleSend,
}: HeroChatPanelProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={fluidTransition}
      className={`w-full max-w-lg h-[480px] backdrop-blur-xl border rounded-3xl p-6 shadow-2xl transition-colors duration-700 flex flex-col justify-between ${theme.bgCard} ${persona === "sophie" ? "shadow-neutral-200/50" : "shadow-violet-100/60"}`}
    >
      <div className="flex justify-between items-center border-b border-neutral-500/20 pb-4 transition-colors duration-700">
        <div className="flex items-center gap-3">
          <div
            className={`relative w-2.5 h-2.5 rounded-full transition-colors duration-700 ${theme.pingColor}`}
          >
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.pingGlow}`}
            ></span>
          </div>
          <span
            className={`text-sm font-bold tracking-tight flex items-center gap-1 transition-colors duration-700 ${theme.textMain}`}
          >
            <Sparkles size={14} className={theme.textSub} />
            {persona === "sophie" ? "AI.Twin (Sophie)" : "AI.Mentor (Naval)"}
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider transition-colors duration-700 ${theme.badgeBg}`}
        >
          {persona === "sophie" ? "RAG ENABLED" : "NAMESPACE: NAVAL_DB"}
        </span>
      </div>

      <div
        ref={chatScrollRef}
        className="flex-1 my-4 overflow-y-auto pr-1 space-y-4 scrollbar-thin overflow-x-hidden"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div
                  className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-700 ${theme.aiAvatarBg}`}
                >
                  {persona.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`flex flex-col gap-1.5 ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}
              >
                <div
                  className={`px-4 py-3 text-sm shadow-sm leading-relaxed border transition-colors duration-700 w-fit ${
                    msg.sender === "user"
                      ? `${theme.userMsgBg} border-transparent rounded-2xl rounded-tr-none`
                      : `${theme.aiMsgBg} rounded-2xl rounded-tl-none`
                  } ${
                    msg.isStreaming
                      ? `after:content-["|"] after:animate-pulse after:ml-0.5 after:font-bold ${persona === "sophie" ? "after:text-neutral-900" : "after:text-amber-600"}`
                      : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        `<strong class="font-extrabold ${persona === "sophie" ? "text-neutral-950" : "text-amber-800"}">$1</strong>`,
                      )
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                {msg.sender === "ai" &&
                  !msg.isStreaming &&
                  i > 0 &&
                  Array.isArray(msg.source) &&
                  msg.source.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 w-[85%]">
                      {msg.source.map((src, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05 }}
                          className={`flex items-center gap-1 w-max px-2 py-1 rounded-md text-[10px] border shadow-sm transition-colors duration-700 ${
                            persona === "sophie"
                              ? "bg-white/60 border-neutral-200/60 text-neutral-500"
                              : "bg-[#f5f2fa]/60 border-violet-200/50 text-amber-700/80"
                          }`}
                          title={src.source}
                        >
                          <Database size={10} className="opacity-70 shrink-0" />
                          <span className="font-semibold truncate max-w-[160px]">
                            {src.source.startsWith("http") ? "网络：" : "知识库："} {src.source}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {persona === "naval" && (
        <div className="flex items-center justify-end px-2 mb-2 gap-2">
          <span className="text-xs text-neutral-500 font-medium">🌐 联网搜索</span>
          <button
            onClick={() => setForceWeb(!forceWeb)}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
              forceWeb ? "bg-amber-500" : "bg-neutral-300"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                forceWeb ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}

      <div
        className={`relative mt-4 flex items-center rounded-2xl border p-1 shadow-sm transition-all duration-700 w-full max-w-lg ${theme.inputBg}`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
          placeholder={INPUT_PLACEHOLDER[lang][persona]}
          className={`w-full bg-transparent py-3 px-4 text-sm outline-none transition-colors duration-700 ${theme.inputText} placeholder:opacity-50`}
        />
        <button
          onClick={() => handleSend(inputValue)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${theme.sendBtnBg}`}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </motion.div>
  );
}
