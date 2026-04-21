"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { hero } from "@/lib/data";

export default function Hero() {
  const [displayed, setDisplayed] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = hero.roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, 50);
      } else {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % hero.roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-8 md:px-16 pt-28 pb-16"
    >
      {/* Text */}
      <div className="order-2 md:order-1">
        <p className="animate-hero-1 font-mono text-[0.75rem] tracking-[0.2em] uppercase text-tan mb-6">
          {hero.greeting}
        </p>

        <h1 className="animate-hero-2 font-cormorant text-5xl md:text-[4.5rem] font-light leading-[1.05] text-bark mb-6">
          {hero.name.split(" ")[0]}
          <br />
          <em className="italic text-warm not-italic font-light">
            {hero.name.split(" ").slice(1).join(" ")}
          </em>
        </h1>

        <div className="animate-hero-3 font-mono text-[0.82rem] text-warm mb-8 min-h-[1.4em] flex items-center">
          <span>{displayed}</span>
          <span className="typewriter-cursor" />
        </div>

        <p className="animate-hero-4 text-[0.95rem] leading-[1.85] text-warm max-w-md mb-10">
          {hero.description}
        </p>

        <div className="animate-hero-5 flex flex-wrap gap-3">
          {hero.cta.map((btn) => (
            btn.href === "#experience" ? (
              <a
                key={btn.href}
                href={btn.href}
                className="font-mono text-[0.7rem] tracking-widest uppercase px-8 py-3.5 bg-bark text-cream border border-bark rounded-sm hover:bg-transparent hover:text-bark transition-all"
              >
                {btn.label}
              </a>
            ) : (
              <a
                key={btn.href}
                href={btn.href}
                className="font-mono text-[0.7rem] tracking-widest uppercase px-8 py-3.5 bg-transparent text-bark border border-tan rounded-sm hover:border-bark transition-all"
              >
                {btn.label}
              </a>
            )
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="order-1 md:order-2 animate-hero-img flex justify-center">
        <div className="relative w-full max-w-[360px] aspect-[3/4]">
          {/* Decorative offset border */}
          <div className="hero-img-frame absolute inset-0" />
          <div className="relative z-10 w-full h-full rounded-sm overflow-hidden">
            <Image
              src="/profile2.jpg"
              alt="Istiazah Latifah Sadina"
              fill
              priority
              className="object-cover object-top"
              style={{ filter: "sepia(15%) saturate(90%)" }}
            />
          </div>
          {/* Tag */}
          <div className="absolute -bottom-3 -right-3 z-20 bg-bark text-cream font-mono text-[0.62rem] tracking-widest px-4 py-2 uppercase">
            {hero.location}
          </div>
        </div>
      </div>
    </section>
  );
}
