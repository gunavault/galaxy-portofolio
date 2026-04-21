"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { about } from "@/lib/data";

export default function About() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#about .reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 100);
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="01" label="About" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        Who I Am
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        {/* Bio */}
        <div className="reveal space-y-5">
          {about.bio.map((p, i) => (
            <p key={i} className="text-[0.95rem] leading-[1.9] text-warm">
              {p}
            </p>
          ))}
          <div className="flex flex-wrap gap-2 pt-3">
            {about.interests.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.68rem] tracking-widest uppercase px-3 py-2 bg-white border border-sand text-bark rounded-sm hover:bg-bark hover:text-cream transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {about.stats.map((s, i) => (
            <div
              key={i}
              className="stat-card reveal relative bg-white border border-sand rounded p-6 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-cormorant text-5xl font-semibold text-bark leading-none mb-1">
                {s.number}
              </div>
              <div className="font-mono text-[0.62rem] tracking-widest uppercase text-tan">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
