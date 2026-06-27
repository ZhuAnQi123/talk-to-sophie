export type Lang = "zh" | "en";

export type Persona = "sophie" | "naval";

export interface SourceItem {
  source: string;
  title?: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  source?: SourceItem[];
}

export interface HeroTheme {
  bgCard: string;
  textMain: string;
  textSub: string;
  pingColor: string;
  pingGlow: string;
  badgeBg: string;
  userMsgBg: string;
  aiMsgBg: string;
  aiAvatarBg: string;
  inputBg: string;
  inputText: string;
  sendBtnBg: string;
}
