import os
import dashscope
from dashscope import TextEmbedding
from dotenv import load_dotenv
from http import HTTPStatus

# 加载 .env 文件中的环境变量
# 如果 .env 在 server 的上一级目录，可以指定 path="../.env"
load_dotenv()
dashscope.api_key = os.getenv("QWEN_API_KEY")

def embed_texts(texts:list[str])->list[list[float]]:
    """
    批量把文本转换为向量列表
    注意：Dashscope API 单次调用限制为 10 条文本，此处内部实现分批逻辑。
    """
    batch_size = 10
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        
        response = TextEmbedding.call(
            model=TextEmbedding.Models.text_embedding_v3,
            input=batch
        )

        if response.status_code != HTTPStatus.OK:
            raise Exception(f"Embedding API failed at batch {i//batch_size}: {response.code} - {response.message}")

        # 提取当前批次的向量并累加
        batch_embeddings = [item['embedding'] for item in response.output['embeddings']]
        all_embeddings.extend(batch_embeddings)

    # 返回所有输入文本对应的完整向量列表
    return all_embeddings
    