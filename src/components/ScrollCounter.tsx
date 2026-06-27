import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1500;

/** ease-out with subtle overshoot at the end */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function useAnimatedValue(
  target: number,
  active: boolean,
  duration = DURATION_MS
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let startTime: number | null = null;
    let rafId = 0;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(target * easeOutBack(progress));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);

  return value;
}

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface ScrollCounterProps {
  value: number;
  active: boolean;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function ScrollCounter({
  value,
  active,
  decimals = 0,
  suffix = "",
  className,
}: ScrollCounterProps) {
  const animated = useAnimatedValue(value, active);
  return (
    <span className={className}>
      {formatNumber(animated, decimals)}
      {suffix}
    </span>
  );
}

interface AnimatedProgressBarProps {
  value: number;
  active: boolean;
  barClassName: string;
}

export function AnimatedProgressBar({
  value,
  active,
  barClassName,
}: AnimatedProgressBarProps) {
  const animated = useAnimatedValue(value, active);
  return (
    <div className="w-full bg-neutral-100 h-1.5 rounded-full">
      <div
        className={`${barClassName} h-1.5 rounded-full`}
        style={{ width: `${animated}%` }}
      />
    </div>
  );
}

interface LLMBarRowProps {
  label: string;
  value: number;
  active: boolean;
  barClassName: string;
}

export function LLMBarRow({ label, value, active, barClassName }: LLMBarRowProps) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1">
        <span>{label}</span>
        <ScrollCounter value={value} active={active} suffix="%" />
      </div>
      <AnimatedProgressBar value={value} active={active} barClassName={barClassName} />
    </div>
  );
}
