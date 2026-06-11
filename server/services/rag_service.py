import chromadb
from services.embedding_service import embed_texts

# 在向量库中搜索与query最相似的几条文本片段

def retrieve(query:str,persona:str,top_k:int=3)->list[dict]:
    '''
    返回格式：
    [
        {
            "text":"...",
            "metadata":{
                "source":"resume.md",
                "title":""
            }
            "score":0.87
        }
    ]
    '''

    #1. 先把query转化为向量
    query_embeddings = embed_texts([query])
    if not query_embeddings:
        return []
    
    #2. 连接 ChromaDB (路径需与 ingest.py 一致)
    client = chromadb.PersistentClient(path="./data/chroma_data")
    collection_name = f"{persona}_kb"
    collection = client.get_or_create_collection(name=collection_name)

    #3. 执行向量相似度检索
    results = collection.query(
        query_embeddings=query_embeddings,
        n_results=top_k
    )

    #4. 格式化返回结果
    retrieved_data = []
    for i in range(len(results['documents'][0])):
        retrieved_data.append({
            "text": results['documents'][0][i],
            "metadata": results['metadatas'][0][i],
            "score": results['distances'][0][i] if 'distances' in results else None
        })
    
    return retrieved_data
