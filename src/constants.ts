import { Variants } from "framer-motion";

// 复刻视频的高级流体物理曲线
export const fluidTransition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 1,
};

// 蒙太奇开场文字动画变体
export const typographyVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

// 预设的 LLM 面板数据 (双语)
export const PROJECTS_DATA = {
  zh: {
    1: {
      id: 1,
      tag: "Prompt Engineering / Design System",
      title: "Vibe UI",
      desc: "面向 AI 编程的设计与动效 Prompt 基础设施。将复杂的 UI 规范和 Framer Motion 物理参数沉淀为可执行的 Markdown Skill。提供统一检索与代码一键分发能力，减少大模型生成代码的随机性。",
      url: "http://vibe-ui-prompt.online/",
      consoleLogs: [
        " Installing @vibe-ui-n-motion/mcp via global registry...",
        "🔌 Cursor connected to vibe-mcp server: command 'vibe-mcp' initialized [OK]",
        "🤖 Tool calling: get_vibe_combo(ui='supabase', motions=['fluid-elastic'])",
        "🧠 Resolving design tokens & physical motion parameters for Agent context...",
        "✨ Prompt successfully injected to Cursor via MCP protocol. Enjoy Coding!",
      ],
    },
    2: {
      id: 2,
      tag: "Viral Social / MVP Engineering",
      title: "Love Test",
      desc: "轻量级的恋爱人格测试社交 MVP。结合韩系杂志风 UI 与毒舌情感文案，提供 14 种依恋类型人格分析与双人匹配度计算。内置自动海报生成机制，实现从社交平台获取自发流量的完整裂变闭环。",
      url: "https://kris-jenner.asia/",
      consoleLogs: [
        "❤️ Initializing Love Test MVP logic engine...",
        "📊 Aggregating user responses for 20-question attachment model...",
        "🧠 Calculating personality match: mapping to [Anxious / Avoidant] vectors...",
        "📸 Rendering high-resolution shareable summary poster via html2canvas...",
        "🚀 Firing viral loop telemetry events. Conversion rate tracking active.",
      ],
    },
    3: {
      id: 3,
      tag: "LangGraph / React Flow",
      title: "Light-Agent Flow",
      desc: "极简版可视化 Agent 编排画布系统。将复杂的 AI 智能体（Agents）链条、条件循环、长短时记忆以及自定义工具链，完全抽象为一个由节点连线驱动的高性能前端画布。支持可视化节点异常阻断和实时回溯。",
      url: "#",
      consoleLogs: [
        "⏳ Initializing Agent Graph Framework... [OK]",
        "⛓️ Injecting System Persona Prompts to Agent_Alpha",
        "🤖 Agent_Alpha triggered native function calling: fetch_web_data",
        "🔄 Infinite loop safeguard active. Formatting response text via Agent_Beta...",
        "✅ Graph pipeline finished execution in 840ms.",
      ],
    },
  },
  en: {
    1: {
      id: 1,
      tag: "Prompt Engineering / Design System",
      title: "Vibe UI",
      desc: "A design and motion Prompt infrastructure for AI coding. Encapsulates complex UI specifications and Framer Motion physical parameters into executable Markdown Skills. Provides unified retrieval and one-click code distribution to reduce LLM generation randomness.",
      url: "http://vibe-ui-prompt.online/",
      consoleLogs: [
        "📦 Installing @vibe-ui-n-motion/mcp via global registry...",
        "🔌 Cursor connected to vibe-mcp server: command 'vibe-mcp' initialized [OK]",
        "🤖 Tool calling: get_vibe_combo(ui='supabase', motions=['fluid-elastic'])",
        "🧠 Resolving design tokens & physical motion parameters for Agent context...",
        "✨ Prompt successfully injected to Cursor via MCP protocol. Enjoy Coding!",
      ],
    },
    2: {
      id: 2,
      tag: "Viral Social / MVP Engineering",
      title: "Love Test",
      desc: "A lightweight, socially-driven Love Test MVP. Combines Korean magazine-style UI with witty copywriting to provide 14 attachment style analyses and couple matching. Features auto-poster generation for a complete viral acquisition loop.",
      url: "https://kris-jenner.asia/",
      consoleLogs: [
        "❤️ Initializing Love Test MVP logic engine...",
        "📊 Aggregating user responses for 20-question attachment model...",
        "🧠 Calculating personality match: mapping to [Anxious / Avoidant] vectors...",
        "📸 Rendering high-resolution shareable summary poster via html2canvas...",
        "🚀 Firing viral loop telemetry events. Conversion rate tracking active.",
      ],
    },
    3: {
      id: 3,
      tag: "LangGraph / React Flow",
      title: "Light-Agent Flow",
      desc: "Minimalist visual Agent orchestration canvas. Abstracts complex AI agent chains, loops, memory, and toolchains into a high-performance frontend canvas driven by node connections. Supports visual node blocking and real-time backtracking.",
      url: "#",
      consoleLogs: [
        "⏳ Initializing Agent Graph Framework... [OK]",
        "⛓️ Injecting System Persona Prompts to Agent_Alpha",
        "🤖 Agent_Alpha triggered native function calling: fetch_web_data",
        "🔄 Infinite loop safeguard active. Formatting response text via Agent_Beta...",
        "✅ Graph pipeline finished execution in 840ms.",
      ],
    },
  }
};

// 个人联系配置 (使用 Base64 混淆防止爬虫在静态源码中直接正则扫描到邮箱)
const OBFUSCATED_EMAIL = "emFxMTE3MDg1NDI1MkAxNjMuY29t"; // "zaq1170854252@163.com" 的 Base64

export const CONTACT_CONFIG = {
  // 运行时动态解码，兼顾防爬与使用体验
  getEmail: () => atob(OBFUSCATED_EMAIL),
};
