"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { achievements } from "@/lib/data";

export default function Achievements() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#achievements .reveal-left");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 70);
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="achievements" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="06" label="Achievements" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        Recognition
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {achievements.map((item, i) => (
          <div
            key={i}
            className="reveal-left flex gap-5 items-start px-4 py-4 border-l-2 border-sand hover:border-bark transition-colors"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="font-mono text-[0.62rem] tracking-wider text-tan whitespace-nowrap pt-0.5 min-w-[80px]">
              {item.date}
            </span>
            <p className="text-[0.88rem] leading-[1.6] text-bark">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
