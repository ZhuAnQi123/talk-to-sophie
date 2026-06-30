import { Lang, Persona } from "./types";

export const INITIAL_MESSAGES: Record<Persona, Record<Lang, string>> = {
  sophie: {
    zh: "Hi，我是Sophie的 AI 交互分身。你可以直接点击下方的预设快捷问题，或者直接在输入框向我提问关于她的一切！",
    en: "Hi, I'm Sophie Zhu's AI interactive twin. Click the preset questions below or type in the box to ask me anything about her!",
  },
  naval: {
    zh: "你好，我是那瓦尔（Naval Ravikant）的虚拟导师分身。我的知识库基于《那瓦尔宝典》及历年播客构建。关于财富创造与内心平静，你想探讨什么？",
    en: "Hello, I'm the virtual mentor avatar of Naval Ravikant. My knowledge base is built upon The Almanack of Naval and years of podcasts. What would you like to discuss regarding wealth creation and inner peace?",
  },
};

export const HERO_TITLE_PARTS = [
  "Bridging ",
  "Human Intent",
  "& Machine Intel.",
] as const;

export const HERO_DESCRIPTION: Record<Lang, string> = {
  zh: "你好，我是致力于打通 AI 能力与人机交互最后一公里的前端应用专家。右侧是我的高级虚拟导师会 (Virtual Board of Directors)，你可以无缝切换对话对象，体验多向量库路由能力。",
  en: "Hello, I am a frontend application expert dedicated to bridging the last mile between AI and HCI. On the right is my Virtual Board of Directors, where you can seamlessly switch personas and experience multi-vector-database routing.",
};

export const HERO_SUBTITLE: Record<Lang, string> = {
  zh: "下一代 AI 应用工程师",
  en: "NEXT-GEN AI APPLICATION ENGINEER",
};

export const INPUT_PLACEHOLDER: Record<Lang, Record<Persona, string>> = {
  zh: {
    sophie: "问问我的大模型开发经验...",
    naval: "向那瓦尔提问关于财富与杠杆...",
  },
  en: {
    sophie: "Ask about my LLM experience...",
    naval: "Ask Naval about wealth & leverage...",
  },
};
