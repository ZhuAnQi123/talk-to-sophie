import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import { fluidTransition } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const PRESET_QUESTIONS = {
  zh: [
    { text: "💡 技术栈", q: "介绍一下你的技术栈" },
    { text: "🛠️ 独立项目", q: "你做过哪些结合 LLM 的前沿项目？" },
    { text: "🧠 技术见解", q: "谈谈你对 AI 时代前端交互（Streaming UX）的看法" }
  ],
  en: [
    { text: "💡 Tech Stack", q: "Introduce your tech stack" },
    { text: "🛠️ Projects", q: "What cutting-edge LLM projects have you built?" },
    { text: "🧠 Insights", q: "What are your thoughts on Streaming UX in the AI era?" }
  ]
};

const KB_RESPONSES: Record<string, Record<string, string>> = {
  zh: {
    "介绍一下你的技术栈": "我的前端核心技术栈是 **React (Next.js) / TypeScript** 与 **Tailwind CSS**，主攻微交互动画。在 AI 生态侧，我能熟练基于 **LangChain / LangGraph** 建立高交互 RAG 工作流，利用向量数据库处理嵌入召回，并通过 **Function Calling 机制** 实现 AI 与前端 DOM 的底层双向控制。",
    "你做过哪些结合 LLM 的前沿项目？": "我主要独立研发了三大生态系统：\n1. **Context-Shield**：基于 Function Calling 的 Token 裁剪与代码自动化审查器。\n2. **Aura Generation**：多模态文本驱动的前沿视觉穿搭生成交互界面。\n3. **Light-Agent Flow**：极简版可视化多智能体编排与工作流拓扑画布。详情可在下方作品集体验沙盒。",
    "谈谈你对 AI 时代前端交互（Streaming UX）的看法": "传统的流式打字机效果极其机械。下一代 AI 产品前端应主打**渐显呼吸感流式渲染 (Streaming UX)**。在文本块吐出时，利用 Framer Motion 为字符注入极其细腻的模糊淡入与呼吸光标，并结合骨架屏到内容的高级重组。这能大幅降低用户的感知等待焦虑。"
  },
  en: {
    "Introduce your tech stack": "My core frontend stack is **React (Next.js) / TypeScript** and **Tailwind CSS**, focusing on micro-interactions. On the AI side, I build highly interactive RAG workflows using **LangChain / LangGraph**, handle embeddings with VectorDBs, and use **Function Calling** for bidirectional DOM control.",
    "What cutting-edge LLM projects have you built?": "I have independently developed three main ecosystems:\n1. **Context-Shield**: A token pruner and automated code reviewer based on Function Calling.\n2. **Aura Generation**: A multimodal text-driven visual outfit generation interface.\n3. **Light-Agent Flow**: A minimalist visual multi-agent orchestration canvas. See the sandbox below for details.",
    "What are your thoughts on Streaming UX in the AI era?": "Traditional typewriter effects are mechanical. Next-gen AI frontends should feature **breathing streaming rendering (Streaming UX)**. By injecting delicate blur fade-ins and breathing cursors into characters via Framer Motion, combined with skeleton-to-content restructuring, we can significantly reduce user waiting anxiety."
  }
};

export const HeroSection: React.FC = () => {
  const { lang } = useLanguage();
  
  const initialMessage = lang === 'zh' 
    ? "Hi，我是朱安琪（Sophie）的 AI 交互分身。你可以直接点击下方的预设快捷问题，或者直接在输入框向我提问关于她的一切！"
    : "Hi, I'm Sophie Zhu's AI interactive twin. Click the preset questions below or type in the box to ask me anything about her!";

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai', text: string, isStreaming?: boolean }>>([
    { sender: 'ai', text: initialMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 当语言切换时，更新第一条欢迎语
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[0].sender === 'ai') {
        newMessages[0].text = initialMessage;
      }
      return newMessages;
    });
  }, [lang, initialMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputValue('');

    setTimeout(() => {
      const defaultReply = lang === 'zh' 
        ? "这是一个非常有深度的问题！作为兼具前端美学与大语言模型工程能力的求职者，我非常看重交互层面的工程打磨。让我们在下方的 Telemetry 仪表盘和项目沙盒中进行深度功能拆解。"
        : "That's a profound question! As a candidate combining frontend aesthetics with LLM engineering, I highly value interaction polish. Let's dive into the Telemetry dashboard and project sandbox below.";
        
      const fullReply = KB_RESPONSES[lang][query] || defaultReply;

      setMessages(prev => [...prev, { sender: 'ai', text: '', isStreaming: true }]);

      let currentIndex = 0;
      const interval = setInterval(() => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.sender === 'ai') {
            currentIndex += 2;
            lastMsg.text = fullReply.slice(0, currentIndex);
            if (currentIndex >= fullReply.length) {
              clearInterval(interval);
              lastMsg.isStreaming = false;
            }
          }
          return updated;
        });
      }, 20);
    }, 400);
  };

  return (
    <section id="hero" className="min-h-screen pt-32 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
      <div className="w-full lg:w-1/2 space-y-6">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs font-bold uppercase tracking-widest text-neutral-400 block"
        >
          // NEXT-GEN AI APPLICATION ENGINEER
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={fluidTransition}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none"
        >
          Bridging <br/><span className="text-neutral-400">Human Intent</span> <br/>& Machine Intel.
        </motion.h2>
        <p className="text-neutral-600 max-w-md text-base leading-relaxed">
          {lang === 'zh' 
            ? '你好，我是致力于打通 AI 能力与人机交互最后一公里的前端应用专家。右侧是我的高级 AI 孪生分身，具备完整的知识库召回和 Streaming UX 调试模组。'
            : 'Hello, I am a frontend application expert dedicated to bridging the last mile between AI capabilities and human-computer interaction. On the right is my advanced AI twin, equipped with full knowledge base retrieval and Streaming UX debugging modules.'}
        </p>

        <div className="flex flex-wrap gap-2 pt-4">
          {PRESET_QUESTIONS[lang].map((item, idx) => (
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

      <div className="w-full lg:w-1/2 flex justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ opacity: 1, scale: 1 }} transition={fluidTransition}
          className="w-full max-w-lg h-[480px] bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-2xl shadow-neutral-200/50 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-2.5 h-2.5 bg-emerald-500 rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              </div>
              <span className="text-sm font-bold tracking-tight text-neutral-900 flex items-center gap-1">
                <Sparkles size={14} className="text-neutral-500" /> AI.Twin (Streaming)
              </span>
            </div>
            <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">RAG ENABLED</span>
          </div>

          <div className="flex-1 my-4 overflow-y-auto pr-1 space-y-4 scrollbar-thin overflow-x-hidden">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px] font-bold shrink-0">AI</div>
                  )}
                  <div className={`px-4 py-3 text-sm max-w-[85%] shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-2xl rounded-tr-none'
                      : 'bg-white/90 border border-neutral-100 text-neutral-800 rounded-2xl rounded-tl-none'
                  } ${msg.isStreaming ? 'after:content-["|"] after:animate-pulse after:ml-0.5 after:font-bold after:text-neutral-900' : ''}`}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-neutral-950">$1</strong>').replace(/\n/g, '<br/>') }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          <div className="relative mt-4 flex items-center bg-white rounded-2xl border border-neutral-200 p-1 shadow-sm focus-within:border-neutral-900 transition-all w-full max-w-lg">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder={lang === 'zh' ? "问问我的大模型开发经验..." : "Ask about my LLM experience..."}
              className="w-full bg-transparent py-3 px-4 text-sm text-neutral-800 outline-none"
            />
            <button
              onClick={() => handleSend(inputValue)}
              className="w-10 h-10 bg-neutral-950 text-white rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer shrink-0"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
