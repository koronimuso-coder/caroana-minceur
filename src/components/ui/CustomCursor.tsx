"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Enable custom cursor active class to hide native cursor
    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Dynamic hover listeners for links, buttons, and custom components
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Spring animation trail for the fluid follower ring
  useEffect(() => {
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Adjust the speed (0.15 is damping factor)
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16,
        };
      });
      requestRef.current = requestAnimationFrame(updateTrail);
    };
    requestRef.current = requestAnimationFrame(updateTrail);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  if (!visible) return null;

  return (
    <>
      {/* 1. Main Cursor Dot */}
      <div
        className="hidden md:block fixed pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme-accent transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: hovered ? "6px" : "4px",
          height: hovered ? "6px" : "4px",
        }}
      />
      {/* 2. Elastic Follower Ring */}
      <div
        className="hidden md:block fixed pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 rounded-full border border-theme-accent mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: hovered ? "48px" : "24px",
          height: hovered ? "48px" : "24px",
          backgroundColor: hovered ? "rgba(var(--color-theme-accent-rgb), 0.15)" : "transparent",
          boxShadow: hovered ? "0 0 15px rgba(var(--color-theme-accent-rgb), 0.4)" : "none",
        }}
      />
    </>
  );
}
