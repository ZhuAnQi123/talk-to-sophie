from langchain_community.tools.tavily_search import TavilySearchResults

def perform_web_search(query: str, top_k: int = 3):
    """
    调用 OpenAI 的 Web Search API 进行网页搜索
     # 返回格式要求
    [
      {
          "text": "网页正文片段...",
          "metadata": {"source": "网页URL", "title": "网页标题", "type": "web"}
      }
    ]
    """

    # 连网搜索-TavilySearchResults
    tool=TavilySearchResults(max_results=top_k)
    raw_results= tool.invoke({'query':query})
    
    # 格式转换
    formatted_results = []
    for item in raw_results:
        formatted_results.append({
            'text': item.get('content',''),
            'metadata':{
                'source': item.get('url',''),
                'title': item.get('title',''),
                'type': 'web'
            }
        })
    return formatted_results
