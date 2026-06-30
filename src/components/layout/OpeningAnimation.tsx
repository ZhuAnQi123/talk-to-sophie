import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface OpeningAnimationProps {
  logoText: string;
  onComplete: () => void;
}

const cinematicEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function OpeningAnimation({ logoText, onComplete }: OpeningAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger overlay exit at 1.5s so reveal finishes around 2.5s.
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-black"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: cinematicEase }}
        >
          <motion.div
            className="absolute text-white text-xl md:text-2xl font-extrabold tracking-tighter"
            initial={{ top: "50%", right: "50%", x: "50%", y: "-50%", scale: 1.5, opacity: 0 }}
            animate={{ top: 24, right: 24, x: 0, y: 0, scale: 1, opacity: 1 }}
            transition={{
              opacity: { duration: 0.4, ease: "easeOut" },
              top: { duration: 1, delay: 1, ease: cinematicEase },
              right: { duration: 1, delay: 1, ease: cinematicEase },
              x: { duration: 1, delay: 1, ease: cinematicEase },
              y: { duration: 1, delay: 1, ease: cinematicEase },
              scale: { duration: 1, delay: 1, ease: cinematicEase },
            }}
          >
            {logoText}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
