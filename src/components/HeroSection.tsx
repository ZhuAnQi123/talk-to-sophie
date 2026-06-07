import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, Command } from "lucide-react";
import { fluidTransition } from "../constants";
import { useLanguage } from "../context/LanguageContext";

type Persona = "sophie" | "naval";

const PRESET_QUESTIONS = {
  sophie: {
    zh: [
      { text: "💡 技术栈", q: "介绍一下你的技术栈" },
      { text: "🛠️ 独立项目", q: "你做过哪些结合 LLM 的前沿项目？" },
      {
        text: "🧠 技术见解",
        q: "谈谈你对 AI 时代前端交互（Streaming UX）的看法",
      },
    ],
    en: [
      { text: "💡 Tech Stack", q: "Introduce your tech stack" },
      {
        text: "🛠️ Projects",
        q: "What cutting-edge LLM projects have you built?",
      },
      {
        text: "🧠 Insights",
        q: "What are your thoughts on Streaming UX in the AI era?",
      },
    ],
  },
  naval: {
    zh: [
      { text: "🧘‍♂️ 财富与杠杆", q: "普通人如何获得财富？" },
      { text: "🧠 特殊知识", q: "什么是特殊知识？" },
      { text: "📖 幸福的定义", q: "你如何定义幸福？" },
    ],
    en: [
      { text: "🧘‍♂️ Wealth & Leverage", q: "How can ordinary people get rich?" },
      { text: "🧠 Specific Knowledge", q: "What is specific knowledge?" },
      { text: "📖 Happiness", q: "How do you define happiness?" },
    ],
  },
};

const INITIAL_MESSAGES = {
  sophie: {
    zh: "Hi，我是朱安琪（Sophie）的 AI 交互分身。你可以直接点击下方的预设快捷问题，或者直接在输入框向我提问关于她的一切！",
    en: "Hi, I'm Sophie Zhu's AI interactive twin. Click the preset questions below or type in the box to ask me anything about her!",
  },
  naval: {
    zh: "你好，我是那瓦尔（Naval Ravikant）的虚拟导师分身。我的知识库基于《那瓦尔宝典》及历年播客构建。关于财富创造与内心平静，你想探讨什么？",
    en: "Hello, I'm the virtual mentor avatar of Naval Ravikant. My knowledge base is built upon The Almanack of Naval and years of podcasts. What would you like to discuss regarding wealth creation and inner peace?",
  },
};

export const HeroSection: React.FC = () => {
  const { lang } = useLanguage();
  const [persona, setPersona] = useState<Persona>("sophie");

  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; isStreaming?: boolean }>
  >([{ sender: "ai", text: INITIAL_MESSAGES[persona][lang] }]);
  const [inputValue, setInputValue] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // 当语言或 Persona 切换时，重置聊天记录并显示新的欢迎语
  useEffect(() => {
    setMessages([{ sender: "ai", text: INITIAL_MESSAGES[persona][lang] }]);
  }, [lang, persona]);

  useEffect(() => {
    if (messages.length <= 1) return;
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last?.isStreaming) return;
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    // 如果已经在流式输出，不允许发送
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.isStreaming) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: query },
      { sender: "ai", text: "", isStreaming: true },
    ]);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query, persona: persona }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      if (!res.body) throw new Error("No response body");

      // 1.获取流读取器 & 文本解析器TextDecoder
      const reader = res.body.getReader();
      const decoder = new TextDecoder("UTF-8");

      // 2. 准备一个变量，用于积累回复
      let streamResponse = "";

      // 3. 循环取读（reader.read()）流数据
      while (true) {
        const { done, value } = await reader.read();
        // 用setMessage把流数据塞在页面并且 isStreaming设置为false
        if (done) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg?.sender === "ai") {
              return [
                ...updated.slice(0, -1),
                { ...lastMsg, isStreaming: false },
              ];
            }
            return updated;
          });
          break;
        }

        // 4. 使用 decoder 把数据流转化为文字
        const chunkText = decoder.decode(value, { stream: true });
        streamResponse += chunkText;

        // 5. 用 setMessages 把实时的返回显示在页面
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg?.sender === "ai") {
            return [
              ...updated.slice(0, -1),
              { ...lastMsg, text: streamResponse },
            ];
          }
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg?.sender === "ai") {
          return [
            ...updated.slice(0, -1),
            {
              ...lastMsg,
              text:
                lang === "zh"
                  ? "抱歉，连接后端时出错了。请确认 FastAPI 是否在运行。"
                  : "Sorry, failed to connect to the backend. Please ensure FastAPI is running.",
              isStreaming: false,
            },
          ];
        }
        return [
          ...prev,
          {
            sender: "ai",
            text:
              lang === "zh"
                ? "抱歉，连接后端时出错了。请确认 FastAPI 是否在运行。"
                : "Sorry, failed to connect to the backend. Please ensure FastAPI is running.",
            isStreaming: false,
          },
        ];
      });
    }

    setInputValue("");
  };

  // 主题配色计算
  const theme = {
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
    pillBg: persona === "sophie" ? "bg-white/80" : "bg-[#f5f2fa]/90",
    pillTextActive:
      persona === "sophie" ? "text-neutral-900" : "text-amber-700",
  };

  return (
    <section
      id="hero"
      className="min-h-screen pt-32 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto"
    >
      <div className="w-full lg:w-1/2 space-y-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold uppercase tracking-widest text-neutral-400 block"
        >
          //{" "}
          {lang === "zh"
            ? "下一代 AI 应用工程师"
            : "NEXT-GEN AI APPLICATION ENGINEER"}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={fluidTransition}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none"
        >
          Bridging <br />
          <span className="text-neutral-400">Human Intent</span> <br />& Machine
          Intel.
        </motion.h2>
        <p className="text-neutral-600 max-w-md text-base leading-relaxed">
          {lang === "zh"
            ? "你好，我是致力于打通 AI 能力与人机交互最后一公里的前端应用专家。右侧是我的高级虚拟导师会 (Virtual Board of Directors)，你可以无缝切换对话对象，体验多向量库路由能力。"
            : "Hello, I am a frontend application expert dedicated to bridging the last mile between AI and HCI. On the right is my Virtual Board of Directors, where you can seamlessly switch personas and experience multi-vector-database routing."}
        </p>

        <div className="flex flex-wrap gap-2 pt-4">
          {PRESET_QUESTIONS[persona][lang].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.q)}
              className="px-4 py-2 text-xs font-bold bg-white text-neutral-800 border border-neutral-200 rounded-full hover:border-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer shadow-sm"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center relative">
        {/* Cmd+K 风格的悬浮切换器 (Fluid Pill Toggle) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 flex items-center p-1 rounded-full backdrop-blur-xl border border-neutral-200/50 shadow-lg"
          style={{
            backgroundColor:
              persona === "sophie"
                ? "rgba(255,255,255,0.7)"
                : "rgba(245,242,250,0.9)",
          }}
        >
          <div className="flex items-center px-2 mr-2 border-r border-neutral-300/30">
            <Command
              size={14}
              className={
                persona === "sophie" ? "text-neutral-400" : "text-neutral-500"
              }
            />
            <span
              className={`text-[10px] font-bold ml-1 ${persona === "sophie" ? "text-neutral-400" : "text-neutral-500"}`}
            >
              ⌘K
            </span>
          </div>
          <button
            onClick={() => setPersona("sophie")}
            className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${persona === "sophie" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-600"}`}
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
            className={`relative px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 z-10 ${persona === "naval" ? "text-amber-700" : "text-neutral-500 hover:text-neutral-600"}`}
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
                <Sparkles size={14} className={theme.textSub} />{" "}
                {persona === "sophie"
                  ? "AI.Twin (Sophie)"
                  : "AI.Mentor (Naval)"}
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
                      AI
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 text-sm max-w-[85%] shadow-sm leading-relaxed border transition-colors duration-700 ${
                      msg.sender === "user"
                        ? `${theme.userMsgBg} border-transparent rounded-2xl rounded-tr-none`
                        : `${theme.aiMsgBg} rounded-2xl rounded-tl-none`
                    } ${msg.isStreaming ? `after:content-["|"] after:animate-pulse after:ml-0.5 after:font-bold ${persona === "sophie" ? "after:text-neutral-900" : "after:text-amber-600"}` : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          `<strong class="font-extrabold ${persona === "sophie" ? "text-neutral-950" : "text-amber-800"}">$1</strong>`,
                        )
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            className={`relative mt-4 flex items-center rounded-2xl border p-1 shadow-sm transition-all duration-700 w-full max-w-lg ${theme.inputBg}`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
              placeholder={
                lang === "zh"
                  ? persona === "sophie"
                    ? "问问我的大模型开发经验..."
                    : "向那瓦尔提问关于财富与杠杆..."
                  : persona === "sophie"
                    ? "Ask about my LLM experience..."
                    : "Ask Naval about wealth & leverage..."
              }
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
      </div>
    </section>
  );
};
