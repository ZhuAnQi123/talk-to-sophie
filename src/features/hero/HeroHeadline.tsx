import { useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { fluidTransition } from "../../constants";
import { HERO_TITLE_PARTS, HERO_SUBTITLE } from "./constants";
import { Lang } from "./types";

const TOTAL_CHARS = HERO_TITLE_PARTS.join("").length;

function renderLiquidText(
  text: string,
  startIndex: number,
  onMouseEnter: (index: number) => void,
) {
  return text.split("").map((char, i) => {
    const idx = startIndex + i;
    return (
      <span
        key={idx}
        className="inline-block"
        style={{ filter: `url(#wave-${idx})`, whiteSpace: char === " " ? "pre" : "normal" }}
        onMouseEnter={() => onMouseEnter(idx)}
      >
        {char}
      </span>
    );
  });
}

export function HeroHeadline({ lang }: { lang: Lang }) {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(
      ".liquid-noise",
      { attr: { baseFrequency: "0.01 0.05" } },
      { attr: { baseFrequency: "0.04 0.02" }, duration: 2.4, ease: "none" },
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    const animateScale = (idx: number, maxScale: number) => {
      const el = document.getElementById(`disp-${idx}`);
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        attr: { scale: maxScale },
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(el, { attr: { scale: 0 }, duration: 0.5, ease: "power2.inOut" });
        },
      });
    };

    animateScale(index, 35);
    if (index > 0) animateScale(index - 1, 15);
    if (index < TOTAL_CHARS - 1) animateScale(index + 1, 15);
    if (index > 1) animateScale(index - 2, 5);
    if (index < TOTAL_CHARS - 2) animateScale(index + 2, 5);
  };

  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs font-bold uppercase tracking-widest text-neutral-400 block"
      >
        // {HERO_SUBTITLE[lang]}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fluidTransition}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none p-4 -m-4"
      >
        {renderLiquidText(HERO_TITLE_PARTS[0], 0, handleMouseEnter)}
        <br />
        <span className="text-neutral-400">
          {renderLiquidText(HERO_TITLE_PARTS[1], HERO_TITLE_PARTS[0].length, handleMouseEnter)}
        </span>{" "}
        <br />
        {renderLiquidText(
          HERO_TITLE_PARTS[2],
          HERO_TITLE_PARTS[0].length + HERO_TITLE_PARTS[1].length,
          handleMouseEnter,
        )}
      </motion.h2>

      <svg className="hidden" style={{ width: 0, height: 0, position: "absolute" }}>
        <defs>
          {Array.from({ length: TOTAL_CHARS }).map((_, i) => (
            <filter key={i} id={`wave-${i}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                className="liquid-noise"
                type="fractalNoise"
                baseFrequency="0.02 0.05"
                numOctaves="1"
                result="noise"
              />
              <feDisplacementMap
                id={`disp-${i}`}
                in="SourceGraphic"
                in2="noise"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>
    </>
  );
}
