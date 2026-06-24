export async function streamChatAPI(
  message: string,
  persona: string,
  forceWeb: boolean,
  onChunk: (text: string) => void,
  onDone: (source?: string) => void,
  onError: (err: Error) => void,
  
) {
  try {
    // 相对路径，走 Vite Proxy
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, persona, force_web: forceWeb}),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    if (!res.body) throw new Error("No response body");

    // 获取 X-RAG-Sources header，如果不存在则返回 undefined
    const ragSources = res.headers.get("X-RAG-Sources") ?? undefined;
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onDone(ragSources);
        break;
      }
      const chunkText = decoder.decode(value, { stream: true });
      onChunk(chunkText);
    }
  } catch (error) {
    onError(error as Error);
  }
}
