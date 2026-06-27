import { HeroSection } from "./components/HeroSection";
import { ProjectSection } from "./components/ProjectSection";
import { TelemetryDashboardSection } from "./components/dashboard/TelemetryDashboardSection";
import { SiteFooter } from "./components/layout/SiteFooter";
import { TopNav } from "./components/layout/TopNav";
import { useLanguage } from "./context/LanguageContext";

export default function App() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="bg-[#FBFBFA] text-neutral-900 overflow-x-hidden min-h-screen font-sans selection:bg-neutral-900 selection:text-white">
      <TopNav lang={lang} toggleLang={toggleLang} />

      <main>
        <HeroSection />
        <ProjectSection />
        <TelemetryDashboardSection lang={lang} />
      </main>

      <SiteFooter />
    </div>
  );
}
