"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-sand shadow-sm"
          : "bg-transparent"
      }`}
    >
      <Link
        href="#hero"
        className="font-cormorant text-bark text-lg font-semibold tracking-widest hover:text-warm transition-colors"
      >
        ILS
      </Link>

      <ul className="hidden md:flex items-center gap-10">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="font-mono text-[0.7rem] tracking-widest uppercase text-warm hover:text-bark transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
