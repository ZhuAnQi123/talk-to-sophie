import os
import chromadb
from .chunker import chunk_markdown_file
from services.embedding_service import embed_texts

def ingest_markdown_to_chromadb(persona:str):
    '''
    1. 遍历 data/documents/{persona}/*.md
    2. 用 chunker 切片
    3. 用 embedding_service 向量化
    4. 写入 ChromaDB collection（sophie_kb / naval_kb）
    '''
    # 1. 遍历 data/documents/{persona}/*.md
    directory = f"data/documents/{persona}"
    if not os.path.exists(directory):
        raise FileNotFoundError(f"目录 {directory} 不存在！")

    client = chromadb.PersistentClient(path="./data/chroma_data")
    collection_name = f"{persona}_kb"
    
    # --- 完全重建逻辑 ---
    # 每次都删除旧的 collection，然后重新创建
    print(f"💥 准备清空并重建 Collection: {collection_name}...")
    client.delete_collection(name=collection_name)
    chroma_collection = client.get_or_create_collection(name=collection_name)
    
    print(f"🚀 开始处理 {persona} 的知识库入库...")

    for filename in os.listdir(directory):
        if filename.endswith(".md"):
            file_path = os.path.join(directory, filename)
            # 2. 用 chunker 切片
            chunks = chunk_markdown_file(file_path, persona)
            print(f"  📖 读取文件: {filename}, 生成了 {len(chunks)} 个片段")
            
            if not chunks:
                continue

            # 准备批量数据
            texts = [c['text'] for c in chunks]
            metadatas = [c['metadata'] for c in chunks]
            ids = [f"{m['source']}_{m['chunk_index']}" for m in metadatas]

            # 3. 批量向量化 (显著提升速度)
            embeddings = embed_texts(texts)

            # 4. 写入 ChromaDB (使用 upsert 自动处理更新)
            chroma_collection.upsert(
                documents=texts,
                metadatas=metadatas,
                embeddings=embeddings,
                ids=ids
            )
            print(f"  ✅ {filename} 向量化并存入 ChromaDB 成功")

if __name__ == "__main__":
    # 脚本直接运行时的入口
    try:
        ingest_markdown_to_chromadb("sophie")
        ingest_markdown_to_chromadb("naval")
        print("\n✨ 所有 Persona 的向量库初始化完成！")
    except Exception as e:
        print(f"❌ 入库失败: {e}")