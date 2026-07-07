import { useState, useEffect, useCallback } from "react";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_CONFIG } from "../../constants";

interface TopNavProps {
  lang: "zh" | "en";
  toggleLang: () => void;
  showBrand: boolean;
}

// 自定义文字解码/乱码闪烁 Hook
function useTextScramble(targetText: string, trigger: boolean, duration = 800) {
  const [displayText, setDisplayText] = useState("");
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      return;
    }

    let active = true;
    const startTime = Date.now();
    
    const tick = () => {
      if (!active) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        // 随着时间推移逐渐将乱码替换为真实字符
        const revealedLength = Math.floor(targetText.length * progress);
        const scrambled = targetText
          .split("")
          .map((char, index) => {
            if (index < revealedLength) return char;
            if (char === "@" || char === ".") return char; // 保留特征分隔符增强识别感
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        
        setDisplayText(scrambled);
        requestAnimationFrame(tick);
      } else {
        setDisplayText(targetText);
      }
    };

    tick();
    return () => {
      active = false;
    };
  }, [targetText, trigger, duration]);

  return displayText;
}

export function TopNav({ lang, toggleLang, showBrand }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 从中心化常量中获取解码后的安全邮箱
  const email = CONTACT_CONFIG.getEmail();
  
  // 使用外星科技解码 Hook 渲染邮箱
  const scrambledEmail = useTextScramble(email, isOpen, 600);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      // 复制成功 800 毫秒后，伴随着“已复制”气泡，优雅地自动收起面板
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 800);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  }, [email]);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference">
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`text-xl md:text-2xl font-extrabold tracking-tighter text-white transition-opacity duration-500 ${
            showBrand ? "opacity-100" : "opacity-0"
          }`}
        >
          {"Sophie Zhu"} 
        </div>

        {/* 信封触发标志 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white transition-all duration-300 relative group cursor-pointer focus:outline-none z-20"
          title={lang === "zh" ? "联系我" : "Contact Me"}
        >
          {/* 悬停时带有微弱的光晕和缩放 */}
          <img 
            src="/assets/email.svg" 
            alt="Email icon" 
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 filter brightness-0 invert"
          />
          <span className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none" />
        </button>

        {/* 弹出式解码面板 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              // 0.8秒内的各种参数混沌闪烁（前 0.6 秒剧烈，后续迅速收敛）
              initial={{ 
                opacity: 0,
                y: 10,
                scale: 0.95,
                textShadow: "3px 0px 0px #00f0ff, -3px 0px 0px #ff007c" 
              }}
              animate={{ 
                opacity: [0, 1, 0.1, 0.95, 0.2, 1, 0.7, 1],
                x: [0, -3, 3, -1, 2, -2, 0, 0],
                y: [10, 8, 12, 9, 11, 10, 10, 10],
                scale: 1,
                textShadow: [
                  "3px 0px 0px #00f0ff, -3px 0px 0px #ff007c",
                  "-3px 0px 0px #00f0ff, 3px 0px 0px #ff007c",
                  "2px 0px 0px #00f0ff, -2px 0px 0px #ff007c",
                  "0px 0px 0px #00f0ff, 0px 0px 0px #ff007c"
                ],
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: 15,
                transition: { duration: 0.3 } 
              }}
              transition={{ 
                duration: 0.8,
                ease: "linear",
                times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 0.9, 1]
              }}
              className="absolute left-0 top-12 bg-black/90  text-white px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              {/* 复制图标 (ship.svg) */}
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center relative group"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <img 
                    src="/assets/ship.svg" 
                    alt="Ship copy icon" 
                    width={16}
                    height={16}
                    className="w-4 h-4 flex-shrink-0 object-contain group-hover:scale-105 transition-transform filter brightness-0 invert"
                  />
                )}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] text-neutral-300 px-2 py-0.5 rounded border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {copied ? (lang === "zh" ? "已复制" : "Copied!") : (lang === "zh" ? "复制地址" : "Copy Email")}
                </span>
              </button>

              {/* 解码文案展示 */}
              <span className="font-mono text-xs md:text-sm tracking-widest text-neutral-200 select-all selection:bg-neutral-800">
                {scrambledEmail}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-6 md:gap-8 text-sm font-bold tracking-tight text-neutral-400">
        <a href="#hero" className="hover:text-white transition-colors">
          {lang === "zh" ? "对话" : "Chat"}
        </a>
        <a href="#projects" className="hover:text-white transition-colors">
          {lang === "zh" ? "作品集" : "Projects"}
        </a>
        <a href="#dashboard" className="hover:text-white transition-colors">
          {lang === "zh" ? "数据看板" : "Dashboard"}
        </a>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-all backdrop-blur-md cursor-pointer"
        >
          <Globe size={14} />
          {lang === "zh" ? "EN" : "中文"}
        </button>
      </div>
    </nav>
  );
}
