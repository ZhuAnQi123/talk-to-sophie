# Sophie Zhu (朱安琪) - AI & FE Portfolio

这是一个结合了前端工程美学与大语言模型（LLM）能力的个人展示网站。项目采用了极致的流式交互（Streaming UX）和物理弹簧动画（Spring Physics），旨在展示下一代 AI 应用的前端交互范式。

## 🌟 核心特性

- **中英双语无缝切换**：采用 React Context 状态管理，支持全局语言热切换。
- **AI 交互分身 (Hero Section)**：模拟真实 LLM 的渐显呼吸感流式渲染（Streaming UX），带有打字机淡入与光标闪烁效果。
- **Selected LLM Works (核心作品集)**：展示了前端与 LLM 深度结合的复杂场景，而非普通的 CRUD 项目。
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

### 前端

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

### 后端（Python / FastAPI）

后端代码在 `server/` 目录，使用 Python 3 虚拟环境运行。

```bash
cd server

# 1. 创建并激活虚拟环境（首次需要，之后每次新开终端都要激活）
python3 -m venv .venv
source .venv/bin/activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量（在项目根目录）
# 复制 .env.example 为 .env，填入 Qwen API Key
cp ../.env.example ../.env

# 4. 启动后端
uvicorn main:app --reload
```

启动成功后，默认地址为 `http://127.0.0.1:8000`。可用以下命令测试聊天接口：

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "介绍一下 Sophie Zhu 的技术栈"}'
```

> 注意：请使用 `uvicorn`（不是 `unicorn`），且用 `python3 -m venv` 创建虚拟环境，不要直接用系统 `pip3 install`，否则会触发 macOS 的 `externally-managed-environment` 报错。

### 📚 知识库更新 (RAG)

如果你修改、新增或删除了 `server/data/documents/` 目录下的 `.md` 知识库文件，需要重新运行入库脚本来重新切片并更新向量数据库：

```bash
cd server
# 确保在虚拟环境已激活的情况下运行
python -m rag.ingest
```

## � 今日复盘 (Bug Retrospective)

### 2024-XX-XX: RAG Pipeline Ingestion 专项

- **Bug 1: API Batch Limit (10)**  
  阿里云 `text_embedding_v3` 限制单次请求输入不可超过 10 条。已在 `embedding_service.py` 中封装分批逻辑，支持任意长度列表的自动切分与聚合。
- **Bug 2: NoneType 响应报错**  
  API 异常时 `response.output` 会返回 `None`。通过引入 `HTTPStatus` 校验，增强了服务层的健壮性，能够抛出具体的 API 错误码（如 400/401）。

## �💡 关于 "Selected LLM Works"

这块区域是本网站的“核心炫技场”。它向访问者（如面试官或潜在合作伙伴）证明：开发者不仅具备扎实的前端视觉与交互还原能力，还深刻理解大语言模型的底层机制（如 Function Calling、RAG、Agent 工作流、Token 优化等）。通过左侧的“高仿真 AI 能力透视沙盒”和右侧的“卡片流”，将抽象的 AI 概念具象化为极具科技感的 UI 界面。
