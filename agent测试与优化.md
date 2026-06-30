# Talk to Sophie Agent 概览与测试优化方案

## 1) 当前 Agent 概览（基于代码与知识库）

### 1.1 主链路（请求到回答）
- 入口：`/api/chat` -> `build_and_stream_chat()`。
- 查询改写：先用 `rewrite_search_query()` 把用户问题改写成检索 query（会处理“你/今年”等代词）。
- RAG 检索：`retrieve(query, persona, top_k=3)` 从 Chroma 的 `{persona}_kb` 里取前 3 条片段。
- 系统提示词组装：`build_system_message()` 把 persona prompt + 检索上下文拼成 system prompt。
- 大模型输出：通过 LangChain `RunnableWithMessageHistory` 流式返回，保留最近 5 轮对话记忆。

### 1.2 数据来源与入库
- 数据目录：`server/data/documents/{persona}`，sophie 的数据源在 `server/data/documents/sophie`（被 `.gitignore` 忽略）。
- 切片策略：按 Markdown `##` 语义分段，超长段再做固定窗口切片。
- 元数据：支持从文档中 `> metadata: ...` 提取字段（如 `type=self project`）。
- 向量库：`data/chroma_data`，collection 为 `sophie_kb` / `naval_kb`。

### 1.3 当前实现里和效果相关的关键点
- 检索默认 `top_k=3`，对“列举所有项目/所有经历”这类聚合问题容易召回不全。
- 检索没有按 metadata 过滤（虽然代码支持 `filters` 参数，但聊天主链路没有用）。
- `v1.1` prompt 强依赖“按 metadata.type 全量扫描”，但系统并未实现“先识别意图再走过滤检索”。
- `build_and_stream_chat()` 默认没有显式传 prompt version；若环境变量没切到 `1.1`，实际仍可能在跑 `v1.0`。

---

## 2) 你这 3 个测试问题的原因分析

### 问题 A：`你有过几段工作经历`
**现象**：回答把“公司工作经历”和“个人项目”混在一起，段数不准。  
**根因**：
1. 检索是向量 TopK，不是结构化统计。`top_k=3` 只能拿到少量片段，且可能混入“个人项目”段落。  
2. `03-experience-summary.md` 同时包含“工作经历”和“个人项目实践”，如果不做 `type` 过滤，模型很容易混答。  
3. 目前没有“先分类再回答”的强约束（如 company_experience vs self_project）。

### 问题 B：`你在上家公司里待了几年`
**现象**：回答“不知道”。  
**根因**：
1. 这类问题需要“时间定位 + 计算”两步：先找对公司，再算年份；TopK 检索经常拿不到包含时间区间的关键 chunk。  
2. system prompt 没有明确要求“当命中起止时间时进行年份换算并给出计算依据”。  
3. 语义歧义（“上家公司”在口语中可能指当前公司前一段或最近一段），模型没有触发澄清机制。

### 问题 C：`你做过什么个人项目（所有的都回答）`
**现象**：第一次只答 1 个，追问后也不全。  
**根因**：
1. 核心仍是召回覆盖不足：`top_k=3` 对“列举全部”天然不稳。  
2. 文档切片以 `##` 为主，若多个项目分散在不同文档/段落，TopK 很难一次覆盖。  
3. prompt 虽然写了“全面扫描”，但当前系统并没有真正执行“全库扫描 + 去重汇总”。

---

## 3) 代码层面发现的隐性风险（建议优先修）

1. `server/services/prompts/sophie/v1.1.yaml` 中 `few_shot` 定义了两次，前一段会被后一段覆盖。  
2. `build_system_message()` 里 `parts.append[rag_addition]` 是写法错误（应为 `parts.append(...)`），现在依赖异常分支兜底。  
3. `server/services/prompts/rag_context.j2` 为空，导致模板分支没有实际价值。  
4. `.gitignore` 忽略 `server/data/documents/sophie`，团队协作下非常容易出现“本地有文档、他人环境无文档、效果不一致”。

---

## 4) 优化方案（按优先级）

## P0（今天就能做，最小改动高收益）

### P0-1 提升“列举类问题”的召回覆盖
- 对关键词命中以下模式时，把 `top_k` 从 3 提升到 8~12：  
  - `所有` / `全部` / `几段` / `哪些` / `分别` / `列举`  
- 预期收益：项目/经历“漏答”明显下降。

### P0-2 加入 metadata 过滤路由（最关键）
- 在 `build_and_stream_chat()` 前增加意图分类：
  - “个人项目” -> `filters={"type":"self project"}`
  - “工作经历/公司经历” -> `filters={"type":"experience"}`（需要补齐文档 metadata）
- 预期收益：减少“工作经历答成项目经历”的混答。

### P0-3 修复 prompt/version 生效链路
- 在请求参数中增加 `prompt_version`（或服务端固定灰度配置），并显式传给 `build_system_message()`。  
- 避免“以为在测 v1.1，实际跑 v1.0”的偏差。

### P0-4 修复已知实现 bug
- 修复 `parts.append[rag_addition]` -> `parts.append(rag_addition)`。  
- 整理 `v1.1.yaml`，保留一个 `few_shot` 节点，避免配置被静默覆盖。

---

## P1（1-3 天，稳定性显著提升）

### P1-1 数据分层：把“经历”和“项目”拆文档
- 建议拆成：
  - `sophie/experience/*.md`
  - `sophie/projects/*.md`
- 每篇文档统一 metadata：`type`, `company`, `time_start`, `time_end`, `is_current`。

### P1-2 加“聚合回答器”（Retriever 后处理）
- 对列举类问题不要直接把 TopK 喂给 LLM，先做程序侧聚合：
  1. 拉取更多候选 chunk（如 top_k=20）
  2. 按 `source/title` 去重
  3. 再截断成结构化摘要交给模型生成
- 预期收益：回答更完整且不重复。

### P1-3 时间计算规则化
- 对“待了几年/多少年”增加规则：
  - 识别 `YYYY.MM - 至今`、`YYYY - YYYY`
  - 程序侧先算年限，再让模型润色输出
- 预期收益：减少“明明有时间却答不知道”。

---

## P2（中期优化）

### P2-1 构建可执行评测闭环
- 目前 `server/eval` 只有 `test_cases.yaml`，缺少完整 runner。
- 建议补齐：
  - 自动跑全部 case
  - 输出通过率/失败原因
  - 与 prompt 版本绑定对比（v1.0 vs v1.1）

### P2-2 检索策略升级
- 从纯向量检索升级为混合检索（BM25 + Dense）或加入重排（reranker）。
- 对“列举类”和“事实计算类”走不同检索 pipeline（query intent routing）。

---

## 5) 针对你当前 3 个问题的“目标回答标准”

1. `你有过几段工作经历`  
   - 应返回“2段公司经历”，并明确公司名、岗位、时间段。  

2. `你在上家公司里待了几年`  
   - 应返回“约5年（2021.11 至今，以当前年份计算）”，并给出简短计算依据。  
   - 若“上家公司”语义不清，先澄清一次再答。  

3. `你做过什么个人项目（所有）`  
   - 应一次性列出全部个人项目（至少覆盖 `Talk to Sophie`、`念头驯养员`、`Vibe UI / Vibe Motion / Vibe UI Web`，如数据中定义为独立项目则逐项列出）。

---

## 6) 建议落地顺序（最实用）
- 第一步：修 bug（append / duplicated few_shot / prompt version 显式化）。
- 第二步：加意图路由 + metadata 过滤 + 列举类 top_k 提升。
- 第三步：补文档 metadata 与目录分层。
- 第四步：补 eval runner，形成“改一次、测一次、可回归”。

按这个顺序执行后，你遇到的 3 类问题会明显下降，且后续扩知识库时不会反复踩坑。
