import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { HERO_DESCRIPTION } from "../features/hero/constants";
import { HeroChatPanel } from "../features/hero/HeroChatPanel";
import { HeroHeadline } from "../features/hero/HeroHeadline";
import { PersonaToggle } from "../features/hero/PersonaToggle";
import { getHeroTheme } from "../features/hero/theme";
import { Persona } from "../features/hero/types";
import { useHeroChat } from "../features/hero/useHeroChat";
import { useIsMobile } from "../hooks/useIsMobile";

export const HeroSection: React.FC = () => {
  const { lang } = useLanguage();
  const [persona, setPersona] = useState<Persona>("sophie");
  const [forceWeb, setForceWeb] = useState(false);
  const { chatScrollRef, messages, inputValue, setInputValue, handleSend } = useHeroChat({
    lang,
    persona,
    forceWeb,
  });
  const theme = getHeroTheme(persona);
  const isMobile = useIsMobile();

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, isMobile ? 1 : 0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPersona((prev) => (prev === "sophie" ? "naval" : "sophie"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen z-0">
      <motion.div
        style={{ y, opacity }}
        className="min-h-screen pt-27 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto"
      >
        <div className="w-full lg:w-1/2 space-y-6">
          <HeroHeadline lang={lang} />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-600 max-w-md text-base leading-relaxed"
          >
            {HERO_DESCRIPTION[lang]}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex justify-center relative"
        >
          <PersonaToggle persona={persona} setPersona={setPersona} />
          <HeroChatPanel
            lang={lang}
            persona={persona}
            theme={theme}
            forceWeb={forceWeb}
            setForceWeb={setForceWeb}
            messages={messages}
            chatScrollRef={chatScrollRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
