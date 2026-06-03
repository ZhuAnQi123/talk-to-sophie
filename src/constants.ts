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
      tag: "Function Calling / AST",
      title: "Context-Shield",
      desc: "面向前端的代码审查与预算卫士。在提交时分析抽象语法树（AST），精确剥离不必要的依赖上下文，将长篇代码提炼成大模型最好吸收的形态。通过 Function Calling 功能自动生成代码重构预览滑块。",
      consoleLogs: [
        "📂 Scanning src/components/Sidebar.tsx...",
        "📊 Input token size before optimization: 4,120 Tokens",
        "⚡ Pruning unreferenced imports & dead comments...",
        "📉 Compressed token size: 1,840 Tokens (Saved 55.3%)",
        "🤖 AI Agent status: Applying CSS Flex-Grid diff optimizations.",
      ],
    },
    2: {
      id: 2,
      tag: "Multimodal / Diffusion API",
      title: "Aura Generation",
      desc: "多模态创意穿搭生成。提取用户的文本情感语调（如‘赛博朋克风’或‘极简包豪斯’），将其量化为特定权重的描述词嵌入（Embeddings）。前端利用大胆的明暗卡片流和无缝骨架屏等待态，实现高度艺术感的视觉互动。",
      consoleLogs: [
        "🎨 Prompt context matrix generated: [Cyberpunk, Bauhaus, Monochromatic]",
        "🚀 Dispatching latent requests to Stable Diffusion cluster...",
        "🖼️ Decoding multi-latent vector grids at step 24/30...",
        "✨ Grid alignment optimized. Rendered custom responsive wear UI layout successfully.",
      ],
    },
    3: {
      id: 3,
      tag: "LangGraph / React Flow",
      title: "Light-Agent Flow",
      desc: "极简版可视化 Agent 编排画布系统。将复杂的 AI 智能体（Agents）链条、条件循环、长短时记忆以及自定义工具链，完全抽象为一个由节点连线驱动的高性能前端画布。支持可视化节点异常阻断和实时回溯。",
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
      tag: "Function Calling / AST",
      title: "Context-Shield",
      desc: "Frontend-oriented code review and budget guardian. Analyzes AST on commit, strips unnecessary context, and refines code into LLM-friendly formats. Automatically generates code refactoring preview sliders via Function Calling.",
      consoleLogs: [
        "📂 Scanning src/components/Sidebar.tsx...",
        "📊 Input token size before optimization: 4,120 Tokens",
        "⚡ Pruning unreferenced imports & dead comments...",
        "📉 Compressed token size: 1,840 Tokens (Saved 55.3%)",
        "🤖 AI Agent status: Applying CSS Flex-Grid diff optimizations.",
      ],
    },
    2: {
      id: 2,
      tag: "Multimodal / Diffusion API",
      title: "Aura Generation",
      desc: "Multimodal creative outfit generation. Extracts user's emotional tone and quantifies it into weighted embeddings. Features bold dark/light card flows and seamless skeleton screens for highly artistic visual interactions.",
      consoleLogs: [
        "🎨 Prompt context matrix generated: [Cyberpunk, Bauhaus, Monochromatic]",
        "🚀 Dispatching latent requests to Stable Diffusion cluster...",
        "🖼️ Decoding multi-latent vector grids at step 24/30...",
        "✨ Grid alignment optimized. Rendered custom responsive wear UI layout successfully.",
      ],
    },
    3: {
      id: 3,
      tag: "LangGraph / React Flow",
      title: "Light-Agent Flow",
      desc: "Minimalist visual Agent orchestration canvas. Abstracts complex AI agent chains, loops, memory, and toolchains into a high-performance frontend canvas driven by node connections. Supports visual node blocking and real-time backtracking.",
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
