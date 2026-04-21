"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { experience, education } from "@/lib/data";

export default function Experience() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#experience .reveal-left");
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
    <section id="experience" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28">
      <SectionLabel index="02" label="Experience" />
      <h2 className="font-cormorant text-4xl md:text-5xl font-medium text-bark mb-14 leading-tight">
        Where I&apos;ve Worked
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Timeline */}
        <div className="md:col-span-2">
          <div className="relative pl-10 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-sand">
            {experience.map((item, i) => (
              <div
                key={i}
                className="reveal-left relative mb-12 last:mb-0"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Dot */}
                <span className="absolute -left-10 top-1.5 w-2.5 h-2.5 rounded-full bg-bark -translate-x-1/2" />

                <p className="font-mono text-[0.65rem] tracking-widest uppercase text-tan mb-1.5">
                  {item.period}
                </p>
                <h3 className="font-cormorant text-xl font-semibold text-bark mb-0.5">
                  {item.company}
                </h3>
                <p className="text-[0.82rem] text-warm italic mb-3">{item.role}</p>
                <p className="text-[0.88rem] leading-[1.8] text-warm max-w-xl">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education sidebar */}
        <div>
          <p className="font-mono text-[0.67rem] tracking-widest uppercase text-tan mb-6 border-b border-sand pb-3">
            Education
          </p>
          {education.map((edu, i) => (
            <div
              key={i}
              className="reveal-left mb-8"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="font-mono text-[0.62rem] tracking-widest text-tan mb-1">{edu.period}</p>
              <h4 className="font-cormorant text-base font-semibold text-bark leading-snug mb-0.5">
                {edu.degree}
              </h4>
              <p className="text-[0.82rem] text-warm">{edu.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
