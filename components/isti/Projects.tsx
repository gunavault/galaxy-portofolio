"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { projects } from "@/lib/data";

export default function Projects() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#projects .reveal");
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
    <section id="projects" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="04" label="Science Projects" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        What I&apos;ve Built
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <div
            key={i}
            className="reveal project-card relative bg-white border border-sand rounded p-8 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="project-corner" />
            <p className="font-mono text-[0.62rem] tracking-widest uppercase text-tan mb-4">
              {p.year}
            </p>
            <h3 className="font-cormorant text-[1.1rem] font-semibold text-bark leading-snug mb-3">
              {p.title}
            </h3>
            <p className="text-[0.84rem] leading-[1.75] text-warm">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
