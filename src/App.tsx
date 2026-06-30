import { HeroSection } from "./components/HeroSection";
import { ProjectSection } from "./components/ProjectSection";
import { TelemetryDashboardSection } from "./components/dashboard/TelemetryDashboardSection";
import { OpeningAnimation } from "./components/layout/OpeningAnimation";
import { SiteFooter } from "./components/layout/SiteFooter";
import { TopNav } from "./components/layout/TopNav";
import { useLanguage } from "./context/LanguageContext";
import { useState } from "react";

export default function App() {
  const { lang, toggleLang } = useLanguage();
  const [hasCompletedOpening, setHasCompletedOpening] = useState(false);

  return (
    <div className="bg-[#FBFBFA] text-neutral-900 overflow-x-hidden min-h-screen font-sans selection:bg-neutral-900 selection:text-white">
      {!hasCompletedOpening && (
        <OpeningAnimation
          logoText={"Sophie Zhu"}
          onComplete={() => setHasCompletedOpening(true)}
        />
      )}
      <TopNav
        lang={lang}
        toggleLang={toggleLang}
        showBrand={hasCompletedOpening}
      />

      <main>
        <HeroSection />
        <ProjectSection />
        <TelemetryDashboardSection lang={lang} />
      </main>

      <SiteFooter />
    </div>
  );
}
