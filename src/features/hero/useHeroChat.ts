import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { streamChatAPI } from "../../services/chatService";
import { INITIAL_MESSAGES } from "./constants";
import { parseSourceHeader } from "./source";
import { ChatMessage, Lang, Persona } from "./types";

interface UseHeroChatParams {
  lang: Lang;
  persona: Persona;
  forceWeb: boolean;
}

export function useHeroChat({ lang, persona, forceWeb }: UseHeroChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: INITIAL_MESSAGES[persona][lang] },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);

  const errorText = useMemo(
    () =>
      lang === "zh"
        ? "抱歉，连接后端时出错了。请确认 FastAPI 是否在运行。"
        : "Sorry, failed to connect to the backend. Please ensure FastAPI is running.",
    [lang],
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setMessages([{ sender: "ai", text: INITIAL_MESSAGES[persona][lang] }]);
  }, [lang, persona]);

  useEffect(() => {
    if (messages.length <= 1) return;
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last?.isStreaming) return;
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = useCallback(
    (textToSend: string) => {
      setInputValue("");

      const query = textToSend.trim();
      if (!query) return;

      const lastMsg = messagesRef.current[messagesRef.current.length - 1];
      if (lastMsg?.isStreaming) return;

      setMessages((prev) => [
        ...prev,
        { sender: "user", text: query },
        { sender: "ai", text: "", isStreaming: true },
      ]);

      let streamResponse = "";

      streamChatAPI(
        query,
        persona,
        forceWeb,
        (chunkText) => {
          streamResponse += chunkText;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.sender === "ai") {
              return [...updated.slice(0, -1), { ...last, text: streamResponse }];
            }
            return updated;
          });
        },
        (sourceHeader) => {
          const parsedSources = parseSourceHeader(sourceHeader);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.sender === "ai") {
              return [
                ...updated.slice(0, -1),
                { ...last, isStreaming: false, source: parsedSources },
              ];
            }
            return updated;
          });
        },
        (error) => {
          console.error(error);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.sender === "ai") {
              return [
                ...updated.slice(0, -1),
                { ...last, text: errorText, isStreaming: false },
              ];
            }
            return [...prev, { sender: "ai", text: errorText, isStreaming: false }];
          });
        },
      );
    },
    [errorText, forceWeb, persona],
  );

  return {
    chatScrollRef,
    messages,
    inputValue,
    setInputValue,
    handleSend,
  };
}
