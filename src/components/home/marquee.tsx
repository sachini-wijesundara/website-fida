"use client";

const items = [
  "IT Consultancy", "Cloud Solutions", "Cybersecurity", "HR Automation",
  "Infrastructure", "Managed Services", "Digital Transformation", "AI Integration"
];

export default function MarqueeTicker() {
  return (
    <div className="home-marquee relative overflow-hidden py-6 border-y">
      {/* Fade edges */}
      <div className="home-marquee__fade home-marquee__fade--left absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />
      <div className="home-marquee__fade home-marquee__fade--right absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />

      <div className="flex gap-0 marquee-track">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-muted hover:text-primary transition-colors flex-shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
