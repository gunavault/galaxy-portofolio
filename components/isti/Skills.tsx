"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { skills } from "@/lib/data";

export default function Skills() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#skills .reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 120);
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="03" label="Skills" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        What I Bring
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {skills.map((cat, i) => (
          <div key={i} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
            <h3 className="font-mono text-[0.67rem] tracking-[0.18em] uppercase text-tan mb-5 pb-3 border-b border-sand">
              {cat.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-[0.68rem] tracking-wider px-3.5 py-1.5 border border-tan text-bark rounded-full hover:bg-bark hover:text-cream hover:border-bark transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
