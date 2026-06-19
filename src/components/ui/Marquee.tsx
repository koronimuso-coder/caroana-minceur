"use client";

interface MarqueeProps {
  text: string;
  outline?: boolean;
  speed?: "slow" | "medium" | "fast";
  reverse?: boolean;
}

export default function Marquee({
  text,
  outline = false,
  speed = "medium",
  reverse = false,
}: MarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    medium: "animate-marquee-medium",
    fast: "animate-marquee-fast",
  }[speed];

  const directionClass = reverse ? "direction-reverse" : "";

  // Duplicate text to cover wide screen widths
  const items = Array(8).fill(text);

  return (
    <div className="w-full overflow-hidden border-y border-white/10 py-6 bg-[#090A0A] select-none">
      <div className={`flex whitespace-nowrap min-w-full ${speedClass} ${directionClass}`}>
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`text-4xl sm:text-7xl font-black uppercase tracking-tighter px-6 ${
              outline
                ? "text-transparent stroke-text"
                : "text-white"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
