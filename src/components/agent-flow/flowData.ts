import { AppNode, AppEdge } from './types';

export const getInitialNodes = (lang: 'zh' | 'en'): AppNode[] => [
  {
    id: 'user-goal',
    type: 'customNode',
    position: { x: 50, y: 250 },
    data: {
      label: lang === 'zh' ? '用户目标' : 'User Goal',
      type: 'input',
      status: 'success',
      description: lang === 'zh' ? '用户输入的真实目标' : 'The actual goal input by the user',
      details: {
        input: lang === 'zh' ? '帮我分析一个前端项目需求，并输出执行计划。' : 'Analyze a frontend project requirement and output an execution plan.',
      },
      logs: ['Received user input', 'Parsed intent: Requirement Analysis'],
    },
  },
  {
    id: 'planner-agent',
    type: 'customNode',
    position: { x: 320, y: 250 },
    data: {
      label: 'Planner Agent',
      type: 'agent',
      status: 'success',
      description: lang === 'zh' ? '拆解任务步骤，生成执行计划' : 'Break down task steps and generate an execution plan',
      details: {
        model: 'Claude 3.5 Sonnet',
        prompt: 'You are an expert planner. Break down the user goal into actionable steps.',
        output: '1. Retrieve context\n2. Analyze dependencies\n3. Generate plan',
      },
      logs: ['Thinking...', 'Generated 3-step execution plan'],
    },
  },
  {
    id: 'memory-router',
    type: 'customNode',
    position: { x: 590, y: 250 },
    data: {
      label: 'Memory Router',
      type: 'agent',
      status: 'success',
      description: lang === 'zh' ? '决定读取短期上下文还是长期知识库' : 'Decide whether to read short-term context or long-term knowledge base',
      details: {
        model: 'GPT-4o-mini',
        prompt: 'Determine if the task requires short-term context or long-term RAG retrieval.',
        output: 'Requires both working memory and RAG store.',
      },
      logs: ['Routing memory requests...', 'Dispatched to Working Memory and RAG Store'],
    },
  },
  {
    id: 'working-memory',
    type: 'customNode',
    position: { x: 860, y: 120 },
    data: {
      label: 'Working Memory',
      type: 'memory',
      status: 'success',
      description: lang === 'zh' ? '短期记忆：当前运行中的上下文摘要' : 'Short-term memory: Context summary of current execution',
      details: {
        memory: 'Current session variables, recent tool results, active plan steps.',
      },
      logs: ['Loaded 120 tokens of short-term context'],
    },
  },
  {
    id: 'rag-store',
    type: 'customNode',
    position: { x: 860, y: 380 },
    data: {
      label: 'RAG Store',
      type: 'memory',
      status: 'success',
      description: lang === 'zh' ? '长期记忆：向量召回个人知识库、项目资料' : 'Long-term memory: Vector retrieval of personal knowledge base and project data',
      details: {
        memory: 'VectorDB retrieved 3 chunks related to "Frontend Architecture".',
      },
      logs: ['Querying VectorDB...', 'Retrieved top-k=3 chunks (similarity > 0.85)'],
    },
  },
  {
    id: 'tool-executor',
    type: 'customNode',
    position: { x: 1130, y: 250 },
    data: {
      label: 'Tool Executor',
      type: 'tool',
      status: 'running',
      description: lang === 'zh' ? '调用外部能力：搜索、读文件、测试' : 'Invoke external capabilities: search, read file, test',
      details: {
        tools: ['web_search', 'read_file', 'run_test'],
        input: 'read_file("package.json")',
        output: 'Executing...',
      },
      logs: ['Invoking read_file...', 'Waiting for I/O response'],
    },
  },
  {
    id: 'critic-agent',
    type: 'customNode',
    position: { x: 1400, y: 250 },
    data: {
      label: 'Critic Agent',
      type: 'agent',
      status: 'idle',
      description: lang === 'zh' ? '检查输出是否满足目标，自检和回溯' : 'Check if output meets the goal, self-check and backtrack',
      details: {
        model: 'DeepSeek-V3',
        prompt: 'Review the tool results and the generated plan. Is it complete?',
      },
      logs: ['Waiting for tool execution to complete'],
    },
  },
  {
    id: 'final-response',
    type: 'customNode',
    position: { x: 1670, y: 250 },
    data: {
      label: lang === 'zh' ? '最终响应' : 'Final Response',
      type: 'output',
      status: 'idle',
      description: lang === 'zh' ? '输出最终结果，展示引用证据' : 'Output final result, display cited evidence',
      details: {
        output: 'Pending...',
      },
      logs: ['Waiting for Critic Agent approval'],
    },
  },
];

export const getInitialEdges = (lang: 'zh' | 'en'): AppEdge[] => [
  { id: 'e1', source: 'user-goal', target: 'planner-agent', animated: true },
  { id: 'e2', source: 'planner-agent', target: 'memory-router', animated: true },
  { id: 'e3', source: 'memory-router', target: 'working-memory', animated: true },
  { id: 'e4', source: 'memory-router', target: 'rag-store', animated: true },
  { id: 'e5', source: 'working-memory', target: 'tool-executor', animated: true },
  { id: 'e6', source: 'rag-store', target: 'tool-executor', animated: true },
  { id: 'e7', source: 'tool-executor', target: 'critic-agent', animated: true },
  { id: 'e8', source: 'critic-agent', target: 'final-response', animated: false },
  // Feedback loop
  { 
    id: 'e9', 
    source: 'critic-agent', 
    target: 'planner-agent', 
    animated: false, 
    type: 'step',
    style: { strokeDasharray: '5 5', stroke: '#ef4444' },
    label: lang === 'zh' ? '反馈 / 重试' : 'Feedback / Retry'
  },
];
