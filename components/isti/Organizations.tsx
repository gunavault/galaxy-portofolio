"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { organizations } from "@/lib/data";

export default function Organizations() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#organizations .reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 80);
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="organizations" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="05" label="Organizations" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        Community &amp; Leadership
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {organizations.map((org, i) => (
          <div
            key={i}
            className="reveal bg-white border border-sand rounded p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <h3 className="font-cormorant text-base font-semibold text-bark leading-snug mb-2">
              {org.name}
            </h3>
            <p className="font-mono text-[0.62rem] tracking-widest text-tan uppercase mb-1">
              {org.period}
            </p>
            <p className="text-[0.82rem] text-warm italic">{org.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
