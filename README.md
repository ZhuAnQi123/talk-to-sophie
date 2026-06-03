# Sophie Zhu (朱安琪) - AI & FE Portfolio

这是一个结合了前端工程美学与大语言模型（LLM）能力的个人展示网站。项目采用了极致的流式交互（Streaming UX）和物理弹簧动画（Spring Physics），旨在展示下一代 AI 应用的前端交互范式。

## 🌟 核心特性

- **中英双语无缝切换**：采用 React Context 状态管理，支持全局语言热切换。
- **AI 交互分身 (Hero Section)**：模拟真实 LLM 的渐显呼吸感流式渲染（Streaming UX），带有打字机淡入与光标闪烁效果。
- **Selected LLM Works (核心作品集)**：
  展示了前端与 LLM 深度结合的复杂场景，而非普通的 CRUD 项目。
  - **Context-Shield**: 结合 AST 解析与 Function Calling 的代码审查工具。
  - **Aura Generation**: 结合多模态大模型（文生图）的瀑布流与骨架屏前端交互。
  - **Light-Agent Flow**: 基于 React Flow 的可视化智能体编排画布。
- **流体物理动画**：基于 Framer Motion 的 `layoutId` 实现了多米诺骨牌式的卡片流收缩与无缝转场。

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React

## 🚀 如何运行

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

## 💡 关于 "Selected LLM Works"

这块区域是本网站的“核心炫技场”。它向访问者（如面试官或潜在合作伙伴）证明：开发者不仅具备扎实的前端视觉与交互还原能力，还深刻理解大语言模型的底层机制（如 Function Calling、RAG、Agent 工作流、Token 优化等）。通过左侧的“高仿真 AI 能力透视沙盒”和右侧的“卡片流”，将抽象的 AI 概念具象化为极具科技感的 UI 界面。
