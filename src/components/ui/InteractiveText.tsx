"use client";

interface InteractiveTextProps {
  text: string;
  className?: string;
}

export default function InteractiveText({ text, className = "" }: InteractiveTextProps) {
  // Split the word/phrase into letters
  const chars = text.split("");

  return (
    <span className={`hover-stagger-char inline-block ${className}`}>
      {chars.map((char, idx) => (
        <span
          key={idx}
          className="inline-block"
          style={{
            transitionDelay: `${idx * 25}ms`,
            // Preserve spacing
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
