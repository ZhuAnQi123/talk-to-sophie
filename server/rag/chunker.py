import os
import re
from llama_index.core import SimpleDirectoryReader
def chunk_markdown_file(file_path: str, persona: str, chunk_size: int = 500, overlap: int = 50) -> list[dict]:
    '''
    1. 用 `##` 分割 Markdown 得到 sections
    2. 每个 section 的 `title` = 标题文字，`text` = 标题 + 正文
    3. 如果 section 超过 500 字符，按固定窗口 + overlap 再切

    最终返回格式：
    [
        {
            “text”:"chunk 文本部份",
            "metadata":{
                "persona":'Naval',
                "source":'01_wealth.md',
                "title":'财富自由之路',
                "chunk_index":0
            }
        }
    ]
    '''

    # 从file_path获取全文：
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"文件 {file_path} 不存在！")

    # 使用 SimpleDirectoryReader 读取单个文件
    documents = SimpleDirectoryReader(input_files=[file_path]).load_data()
    if not documents:
        return []
    
    text = documents[0].text
    source_name = os.path.basename(file_path)

    # 1. 用 `## ` 分割 Markdown 得到 sections (使用正则表达式保留 ## 标记)
    # 正向先行断言确保分割后的每一段依然保留 "## "
    sections = re.split(r'\n(?=## )', text)
    
    chunks = []
    global_chunk_idx = 0

    for section in sections:
        section = section.strip()
        if not section:
            continue

        # 2. 提取 title
        if section.startswith("## "):
            # 提取第一行作为标题内容
            title_line = section.split('\n')[0]
            title = title_line.replace("## ", "").strip()
        else:
            title = "Introduction"

        # 3. 判断长度并切分
        if len(section) <= chunk_size:
            chunks.append({
                "text": section,
                "metadata": {
                    "persona": persona,
                    "source": source_name,
                    "title": title,
                    "chunk_index": global_chunk_idx
                }
            })
            global_chunk_idx += 1
        else:
            # 固定窗口 + overlap 切分
            start = 0
            while start < len(section):
                end = start + chunk_size
                chunk_content = section[start:end]
                chunks.append({
                    "text": chunk_content,
                    "metadata": {
                        "persona": persona,
                        "source": source_name,
                        "title": title,
                        "chunk_index": global_chunk_idx
                    }
                })
                global_chunk_idx += 1
                start += (chunk_size - overlap)
                if start >= len(section):
                    break

    return chunks