"use client";

import { useEffect } from "react";
import SectionLabel from "./SectionLabel";
import { contact } from "@/lib/data";

export default function Contact() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("#contact .reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 100);
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="contact" className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 py-28 text-center">
      <SectionLabel index="07" label="Contact" center />

      <h2 className="reveal font-cormorant text-4xl md:text-5xl font-medium text-bark mb-6 leading-tight">
        Let&apos;s Connect
      </h2>

      <p className="reveal text-[0.95rem] leading-[1.85] text-warm max-w-md mx-auto mb-10">
        Open for collaborations, research opportunities, and meaningful conversations about
        instrumentation, data science, and engineering.
      </p>

      <a
        href={`mailto:${contact.email}`}
        className="reveal font-cormorant text-2xl md:text-3xl text-bark hover:text-warm transition-colors block mb-10"
      >
        {contact.email}
      </a>

      <div className="reveal flex flex-wrap gap-3 justify-center">
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.68rem] tracking-widest uppercase px-6 py-3 border border-tan text-warm hover:bg-bark hover:text-cream hover:border-bark rounded-sm transition-all"
        >
          LinkedIn
        </a>
        <a
          href={contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[0.68rem] tracking-widest uppercase px-6 py-3 border border-tan text-warm hover:bg-bark hover:text-cream hover:border-bark rounded-sm transition-all"
        >
          Instagram
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="font-mono text-[0.68rem] tracking-widest uppercase px-6 py-3 border border-tan text-warm hover:bg-bark hover:text-cream hover:border-bark rounded-sm transition-all"
        >
          Email
        </a>
      </div>
    </section>
  );
}
