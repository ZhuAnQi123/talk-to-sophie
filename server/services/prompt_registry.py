import os
import yaml
from jinja2 import Environment, FileSystemLoader
from datetime import datetime

#**实现提示：**
#- 用 `PyYAML` 读 YAML（加入 `requirements.txt`）
#- `rag_context.j2` 用 Jinja2 渲染（`pip install jinja2`）
#- 默认 version 从环境变量 `DEFAULT_PROMPT_VERSION=1.1` 读取

def load_prompt(persona: str, version: str = None) -> dict:
    """从 YAML 加载指定 persona + version 的 prompt 配置"""
    if version is None:
        version = os.getenv("DEFAULT_PROMPT_VERSION", "1.1")

    base_dir = os.path.dirname(os.path.dirname(__file__))
    # 根据目录结构 server/prompts/<persona>/v<version>.yaml 构造路径
    yaml_path = os.path.join(base_dir, "prompts", persona, f"v{version}.yaml")
    
    # 如果指定版本文件不存在，尝试回退到 v1.0
    if not os.path.exists(yaml_path):
        yaml_path = os.path.join(base_dir, "prompts", persona, "v1.0.yaml")

    if not os.path.exists(yaml_path):
        # 如果连 v1.0 都没有，返回一个最基础的默认值
        return {"system": f"你是 {persona} 个人网站中的AI交互分身。"}
        
    with open(yaml_path, 'r', encoding='utf-8') as f:
        # 每个 YAML 文件直接就是 prompt 配置，不需要再按 version 查找
        prompt_config = yaml.safe_load(f) or {}
        
    return prompt_config

def build_context_prompt(persona: str, user_message: str, history:str)->str:
    """
    构建给rag搜索之前的提示词
    """

    persona_name = "Sophie Zhu(朱安琪)" if persona == "sophie" else "Naval Ravikant(那瓦尔)"
    current_year = datetime.now().year
    history_text = ""
    if history.messages:
        recent_msgs = history.messages[-4:]
        history_text = "\n".join([f"{msg.type}: {msg.content}" for msg in recent_msgs])
    prompt_text = f"当前系统年份：{current_year}年。请将用户的最新提问重写为适合用于搜索引擎和知识库检索的独立查询语句。要求：\n1. 如果提问中包含'你'、'你的'等代词，必须明确替换为'{persona_name}'。并务必保留用户提问中的关键细节和多个并列意图（如“几年”，“什么岗位”等等）\n2. 如果包含“今年”、“去年”、“目前”等时间代词，必须替换为具体的年份（例如将“今年”替换为“{current_year}年”）。\n3. 结合对话历史补全缺失的上下文信息。\n4. 直接输出重写后的查询语句，不要包含任何标点符号、解释或回答。\n\n对话历史：\n{history_text}\n\n用户最新提问：{user_message}"

    return prompt_text



def build_system_message(
    persona: str,
    rag_context: str = "",
    version: str = None,
) -> str:
    """组装最终 system message：base system + RAG context"""
    if version is None:
        version = os.getenv("DEFAULT_PROMPT_VERSION", "1.1")
        
    prompt_config = load_prompt(persona, version)
    system_msg = prompt_config.get("system", "")
    parts=[system_msg]

    if prompt_config.get("cot_instruction"):
        parts.append(prompt_config.get("cot_instruction"))

    if prompt_config.get("few_shot"):
        parts.append("## 回答示例")
        for ex in prompt_config.get("few_shot"):
            parts.append(f"用户: {ex['user']}")
            parts.append(f"助手: {ex['assistant']}")
        
    
    if rag_context:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        templates_dir = os.path.join(base_dir, "prompts")
        try:
            env = Environment(loader=FileSystemLoader(templates_dir))
            template = env.get_template("rag_context.j2")
            rag_addition = template.render(rag_context=rag_context)
            parts.append(rag_addition)
        except Exception:
            # 找不到模板时的默认降级拼接方案
            parts.append('请根据以下提供的知识库内容回答用户的问题，如果知识库内容无法回答用户的问题，请基于你的设定正常交流，不要编造资料中的内容。参考的资料文档都已经按来源（source）和标题（title）分类。\n以下为知识库内容：')
            parts.append(rag_context)
            
    return "\n\n".join(parts)


