import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { HERO_DESCRIPTION } from "../features/hero/constants";
import { HeroChatPanel } from "../features/hero/HeroChatPanel";
import { HeroHeadline } from "../features/hero/HeroHeadline";
import { PersonaToggle } from "../features/hero/PersonaToggle";
import { getHeroTheme } from "../features/hero/theme";
import { Persona } from "../features/hero/types";
import { useHeroChat } from "../features/hero/useHeroChat";

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
    <section
      id="hero"
      className="min-h-screen pt-27 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto"
    >
      <div className="w-full lg:w-1/2 space-y-6">
        <HeroHeadline lang={lang} />
        <p className="text-neutral-600 max-w-md text-base leading-relaxed">
          {HERO_DESCRIPTION[lang]}
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center relative">
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
      </div>
    </section>
  );
};
