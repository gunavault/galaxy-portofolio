'use client';
import { useEffect, useState } from 'react';

const links = ['About', 'Experience', 'Skills', 'Hobbies', 'Movies', 'Contact','cv'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-black/60 backdrop-blur-md border-b border-purple-900/30' : 'py-6'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <svg width="32" height="26" viewBox="0 0 951 759" fill="none" className="group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)] transition-all">
            <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
            <line x1="6.5" y1="735.667" x2="941.641" y2="80.875" stroke="#a78bfa" strokeWidth="13" strokeLinecap="round"/>
            <path d="M223.214 516.619C204.447 489.344 191.671 458.34 185.614 425.378C179.557 392.417 180.339 358.143 187.914 324.513C195.49 290.883 209.711 258.557 229.765 229.379C249.819 200.201 275.315 174.743 304.795 154.46C334.275 134.176 367.163 119.463 401.581 111.161C435.999 102.859 471.273 101.13 505.389 106.074C539.505 111.018 571.795 122.537 600.415 139.974C629.035 157.411 653.425 180.424 672.192 207.7L615.06 247.009C601.069 226.675 582.886 209.519 561.55 196.52C540.214 183.52 516.142 174.933 490.708 171.247C465.275 167.561 438.978 168.85 413.319 175.039C387.66 181.228 363.142 192.197 341.164 207.319C319.187 222.44 300.18 241.419 285.229 263.171C270.279 284.923 259.677 309.023 254.03 334.094C248.382 359.165 247.799 384.716 252.315 409.289C256.83 433.862 266.355 456.976 280.346 477.31L223.214 516.619Z" fill="#a78bfa"/>
            <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
          </svg>
          <span className="font-mono text-sm text-purple-300 tracking-widest">GUNA.DEV</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link font-mono text-xs tracking-widest uppercase">
              {l}
            </a>
          ))}
          <a href="/api/generate-cv"
          download
          className="font-mono text-xs tracking-widest uppercase px-4 py-1.5 border border-purple-700/50 text-purple-400 hover:text-white hover:border-purple-400 rounded-full transition-all"
        >
          ⬇ CV
        </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-purple-300" onClick={() => setOpen(!open)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-purple-900/30 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="nav-link font-mono text-xs tracking-widest uppercase">
              {l}
            </a>
          ))}
              
      <a href="/api/generate-cv"
      download
      className="font-mono text-xs tracking-widest uppercase text-purple-400 hover:text-white transition-colors"
    >
      ⬇ Download CV
    </a>
        </div>
      )}
    </nav>
  );
}
