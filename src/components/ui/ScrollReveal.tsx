"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale-up";
  delay?: number; // in ms
  duration?: number; // in ms
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getAnimationStyles = () => {
    switch (animation) {
      case "fade-up":
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateY(0)" : "translateY(40px)",
        };
      case "fade-down":
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateY(0)" : "translateY(-40px)",
        };
      case "fade-left":
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateX(0)" : "translateX(-40px)",
        };
      case "fade-right":
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateX(0)" : "translateX(40px)",
        };
      case "scale-up":
        return {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "scale(1)" : "scale(0.96)",
        };
      default:
        return {};
    }
  };

  const style = {
    ...getAnimationStyles(),
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
}
