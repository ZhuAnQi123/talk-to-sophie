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

const KB_RESPONSES: Record<Persona, Record<string, Record<string, string>>> = {
  sophie: {
    zh: {
      介绍一下你的技术栈:
        "我的前端核心技术栈是 **React (Next.js) / TypeScript** 与 **Tailwind CSS**，主攻微交互动画。在 AI 生态侧，我能熟练基于 **LangChain / LangGraph** 建立高交互 RAG 工作流，利用向量数据库处理嵌入召回，并通过 **Function Calling 机制** 实现 AI 与前端 DOM 的底层双向控制。",
      "你做过哪些结合 LLM 的前沿项目？":
        "我主要独立研发了三大生态系统：\n1. **Context-Shield**：基于 Function Calling 的 Token 裁剪与代码自动化审查器。\n2. **Aura Generation**：多模态文本驱动的前沿视觉穿搭生成交互界面。\n3. **Light-Agent Flow**：极简版可视化多智能体编排与工作流拓扑画布。详情可在下方作品集体验沙盒。",
      "谈谈你对 AI 时代前端交互（Streaming UX）的看法":
        "传统的流式打字机效果极其机械。下一代 AI 产品前端应主打**渐显呼吸感流式渲染 (Streaming UX)**。在文本块吐出时，利用 Framer Motion 为字符注入极其细腻的模糊淡入与呼吸光标，并结合骨架屏到内容的高级重组。这能大幅降低用户的感知等待焦虑。",
    },
    en: {
      "Introduce your tech stack":
        "My core frontend stack is **React (Next.js) / TypeScript** and **Tailwind CSS**, focusing on micro-interactions. On the AI side, I build highly interactive RAG workflows using **LangChain / LangGraph**, handle embeddings with VectorDBs, and use **Function Calling** for bidirectional DOM control.",
      "What cutting-edge LLM projects have you built?":
        "I have independently developed three main ecosystems:\n1. **Context-Shield**: A token pruner and automated code reviewer based on Function Calling.\n2. **Aura Generation**: A multimodal text-driven visual outfit generation interface.\n3. **Light-Agent Flow**: A minimalist visual multi-agent orchestration canvas. See the sandbox below for details.",
      "What are your thoughts on Streaming UX in the AI era?":
        "Traditional typewriter effects are mechanical. Next-gen AI frontends should feature **breathing streaming rendering (Streaming UX)**. By injecting delicate blur fade-ins and breathing cursors into characters via Framer Motion, combined with skeleton-to-content restructuring, we can significantly reduce user waiting anxiety.",
    },
  },
  naval: {
    zh: {
      "普通人如何获得财富？":
        "财富不是靠出卖时间赚来的，而是靠拥有资产赚来的。你需要寻找**杠杆**：资本、劳动力，或者是复制起来边际成本为零的产品（如代码和媒体）。将你自己产品化，利用代码这种最高级的杠杆，在睡觉时也能为你工作。",
      "什么是特殊知识？":
        "**特殊知识（Specific Knowledge）**是那些无法通过系统培训获得的知识。如果社会可以培训你，它就可以培训别人来取代你。特殊知识往往在童年或青年时期通过你的独特好奇心和特质获得，它感觉像是在玩耍，但对别人来说像是在工作。",
      "你如何定义幸福？":
        "幸福就是当你感到**不再需要缺失什么的时候**，那种内心的平静状态。欲望是你在得到想要的东西之前感到不快乐的一种契约。因此，保持低欲望，学会活在当下，才是幸福的真谛。",
    },
    en: {
      "How can ordinary people get rich?":
        "You're not going to get rich renting out your time. You must own **equity** - a piece of a business - to gain your financial freedom. Seek leverage: capital, labor, or products with no marginal cost of replication like code and media.",
      "What is specific knowledge?":
        "**Specific knowledge** is knowledge that you cannot be trained for. If society can train you, it can train someone else and replace you. It's often highly technical or creative, found by pursuing your genuine curiosity.",
      "How do you define happiness?":
        "Happiness is the state when **nothing is missing**. When you are no longer wishing for something to be different. Desire is a contract you make with yourself to be unhappy until you get what you want. Lower your desires and find peace in the present.",
    },
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
    console.log("query", query);

    setMessages((prev) => [...prev, { sender: "user", text: query }]);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query, persona: persona }),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      console.log("data", data);
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered an error. Please try again later.",
          isStreaming: false,
        },
      ]);
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
