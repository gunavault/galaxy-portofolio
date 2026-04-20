'use client';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import TypeWriter from '@/components/TypeWriter';
import ScrambleText from '@/components/ScrambleText';
import SoundManager from '@/components/SoundManager';

const GalaxyCanvas = dynamic(() => import('@/components/GalaxyCanvas'), { ssr: false });

const skills = {
  'Languages': ['Python', 'JavaScript', 'Go', 'PHP', 'Dart'],
  'Security': ['Splunk SIEM', 'FortiClient EMS', 'Wazuh SCA', 'CIS Hardening', 'ISO 8583'],
  'Frameworks': ['Next.js', 'Django', 'Laravel', 'Flutter', 'Node.js'],
  'Tools': ['Docker', 'Kafka', 'Google Cloud', 'Linux', 'Git', 'Tableau'],
  'Competencies': ['Project Management', 'System Architecture', 'Vendor Management', 'Executive Reporting'],
};

// const hobbies = [
//   { icon: '🎣', label: 'Fishing', desc: 'Finding peace in patience. Early mornings, quiet water, and the thrill of the catch.' },
//   { icon: '🎮', label: 'Gaming', desc: 'Story-driven RPGs and strategy games. Always up for a challenge.' },
//   { icon: '⚡', label: 'Doing Fun Stuff', desc: 'Trying new things, building random projects, and exploring what\'s next.' },
// ];

// const movies = [
//   { title: 'Interstellar', year: '2014', genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
//   { title: 'Project Hail Mary', year: '2026', genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w1280/yihdXomYb5kTeSivtFndMy5iDmf.jpg' },
//   { title: 'Dune', year: '2021', genre: 'Epic Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
//   { title: 'Peaky Blinders', year: '2013', genre: 'Crime Drama', poster: 'https://image.tmdb.org/t/p/w1280/iZ5XwfNWOb6tTdIjm2QuYFDTeLu.jpg' },
//   { title: 'Dr. Stone', year: '2019', genre: 'Anime', poster: 'https://image.tmdb.org/t/p/w1280/ve1Sv3sVArmE0nlFjzadcNv1G8r.jpg' },
// ];

// experiences loaded from DB via useEffect
function MovieCarousel({ movies }: { movies: any[] }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (movies.length > 0) setActive(Math.floor(movies.length / 2));
  }, [movies.length]);

  if (movies.length === 0) return null;

  const prev = () => setActive(i => (i - 1 + movies.length) % movies.length);
  const next = () => setActive(i => (i + 1) % movies.length);

  return (
    <div className="relative flex items-center justify-center gap-0 h-80 select-none">
      {/* Prev button */}
      <button onClick={prev} className="absolute left-0 z-20 w-10 h-10 rounded-full bg-black/60 border border-purple-800/50 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-500 transition-all">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4l-6 4 6 4"/></svg>
      </button>

      {/* Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {movies.map((m, i) => {
          const offset = i - active;
          const absOffset = Math.abs(offset);
          if (absOffset > 2) return null;

          const scale = offset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.65;
          const translateX = offset * 180;
          const zIndex = 10 - absOffset;
          const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4;
          const blur = absOffset === 0 ? 0 : absOffset === 1 ? 1 : 3;

          return (
            <div
              key={m.id || m.title}
              onClick={() => setActive(i)}
              style={{
                position: 'absolute',
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                opacity,
                filter: `blur(${blur}px)`,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: offset !== 0 ? 'pointer' : 'default',
              }}
            >
              <div className={`w-44 rounded-2xl overflow-hidden border transition-all duration-400 ${
                offset === 0
                  ? 'border-purple-500/60 shadow-[0_0_30px_rgba(124,58,237,0.4)]'
                  : 'border-purple-900/30'
              }`}>
                <div className="relative h-64 bg-purple-950">
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/1a0533/a78bfa?text=${encodeURIComponent(m.title)}`; }}
                  />
                  {offset === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  )}
                </div>
                {offset === 0 && (
                  <div className="p-3 bg-black/80">
                    <h3 className="font-bold text-white text-sm truncate">{m.title}</h3>
                    <p className="text-purple-400 text-xs mt-0.5">{m.genre}</p>
                    <p className="text-purple-600 text-xs font-mono">{m.year}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next button */}
      <button onClick={next} className="absolute right-0 z-20 w-10 h-10 rounded-full bg-black/60 border border-purple-800/50 flex items-center justify-center text-purple-400 hover:text-white hover:border-purple-500 transition-all">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l6 4-6 4"/></svg>
      </button>

      {/* Dots */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-purple-400 w-4' : 'bg-purple-800'}`}
          />
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const sectionsRef = useRef<NodeListOf<Element> | null>(null);
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [visibleSections, setVisibleSections] = React.useState<Set<string>>(new Set());
  const [hobbies, setHobbies] = React.useState<any[]>([]);
  const [movies, setMovies] = React.useState<any[]>([]);
  useEffect(() => {
    fetch('/api/experiences')
      .then(r => r.json())
      .then(data => setExperiences(Array.isArray(data) ? data : []))
      .catch(() => setExperiences([]));
    fetch('/api/hobbies')
      .then(r => r.json())
      .then(data => setHobbies(Array.isArray(data) ? data : []))
      .catch(() => setHobbies([]));
    fetch('/api/movies')
      .then(r => r.json())
      .then(data => setMovies(Array.isArray(data) ? data : []))
      .catch(() => setMovies([]));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, { threshold: 0.2 });
    ['about','experience','skills','hobbies','movies','contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Dynamically import animejs
    import('animejs').then((animeModule) => {
      const anime = animeModule.default;

      // Hero entrance
      anime({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [60, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 300,
      });
      anime({
        targets: '.hero-sub',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 600,
      });
      anime({
        targets: '.hero-cta',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 900,
      });

      // Scroll reveal
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            anime({
              targets: el,
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 900,
              easing: 'easeOutExpo',
            });
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.section-reveal').forEach((el) => observer.observe(el));

      // Skill pills stagger on scroll
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target.querySelectorAll('.skill-pill'),
              opacity: [0, 1],
              scale: [0.8, 1],
              delay: anime.stagger(60),
              duration: 500,
              easing: 'easeOutBack',
            });
            skillObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('.skills-group').forEach((el) => skillObserver.observe(el));
    });
  }, []);

  return (
    <>
      <GalaxyCanvas />
      <Navbar />
      <SoundManager />
      <div className="fixed top-24 right-6 z-40 text-right pointer-events-none">
  <div className={`section-label font-mono text-xs transition-all duration-500 ${
    visibleSections.has('contact') || visibleSections.has('movies') ? 'text-blue-400' :
    visibleSections.has('hobbies') ? 'text-cyan-400' :
    visibleSections.has('skills') || visibleSections.has('experience') ? 'text-indigo-400' :
    'text-purple-400'
  }`}>
    {visibleSections.has('contact') || visibleSections.has('movies') ? '🌍 Earth Orbit' :
     visibleSections.has('hobbies') ? '☀️ Solar System' :
     visibleSections.has('skills') || visibleSections.has('experience') ? '☁️ Interstellar Cloud' :
     '🌌 Milky Way'}
  </div>
</div>
      <div className="content-layer">

        {/* HERO */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <div className="mb-6 animate-float">
            <svg width="72" height="58" viewBox="0 0 951 759" fill="none" className="drop-shadow-[0_0_20px_rgba(167,139,250,0.7)]">
              <path d="M558.638 534.884C507.977 342.844 705.908 248.591 731.828 230.919L753.035 214.425C850.115 385.022 810.764 516.426 778.954 560.803C648.178 795.257 454.96 749.309 385.449 741.062C329.84 734.464 259.386 681.761 231.11 656.234C225.862 644.834 218.296 629.03 211.847 616.87C204.574 611.484 199.809 606.369 199.3 602.039C198.283 593.399 204.3 602.64 211.847 616.87C231.487 631.413 269.415 647.923 291.196 656.234C397.23 679.797 599.167 688.516 558.638 534.884Z" fill="#a78bfa"/>
              <line x1="6.5" y1="735.667" x2="941.641" y2="80.875" stroke="#a78bfa" strokeWidth="13" strokeLinecap="round"/>
              <path d="M223.214 516.619C204.447 489.344 191.671 458.34 185.614 425.378C179.557 392.417 180.339 358.143 187.914 324.513C195.49 290.883 209.711 258.557 229.765 229.379C249.819 200.201 275.315 174.743 304.795 154.46C334.275 134.176 367.163 119.463 401.581 111.161C435.999 102.859 471.273 101.13 505.389 106.074C539.505 111.018 571.795 122.537 600.415 139.974C629.035 157.411 653.425 180.424 672.192 207.7L615.06 247.009C601.069 226.675 582.886 209.519 561.55 196.52C540.214 183.52 516.142 174.933 490.708 171.247C465.275 167.561 438.978 168.85 413.319 175.039C387.66 181.228 363.142 192.197 341.164 207.319C319.187 222.44 300.18 241.419 285.229 263.171C270.279 284.923 259.677 309.023 254.03 334.094C248.382 359.165 247.799 384.716 252.315 409.289C256.83 433.862 266.355 456.976 280.346 477.31L223.214 516.619Z" fill="#a78bfa"/>
              <circle cx="478.524" cy="414.712" r="337.522" stroke="#a78bfa" strokeWidth="13"/>
            </svg>
          </div>

          <p className="hero-title font-mono text-purple-400 tracking-[0.3em] text-sm uppercase mb-4 opacity-0">
            Hello, Universe 👋
          </p>
          <h1 className="hero-title text-5xl md:text-7xl font-bold text-white glow-text mb-4 opacity-0">
            <TypeWriter text="Guna Dharma" speed={80} delay={400} />
          </h1>
          <p className="hero-sub text-lg md:text-xl text-purple-300 max-w-xl mb-2 opacity-0">
            <TypeWriter text="Cybersecurity Engineer · Software Developer · Tech Explorer" speed={30} delay={1200} cursor={false} />
          </p>
          <p className="hero-sub text-sm text-purple-500 mb-10 opacity-0 font-mono">
            📍 Jakarta, Indonesia
          </p>
          <div className="hero-cta flex gap-4 opacity-0">
            <a href="#experience" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] text-sm">
              View My Work
            </a>
            <a href="#contact" className="px-6 py-3 border border-purple-600 text-purple-300 hover:text-white hover:border-purple-400 rounded-full font-medium transition-all text-sm">
              Get In Touch
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-purple-600 text-xs font-mono tracking-widest">SCROLL</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
              <path d="M5 9l5 5 5-5"/>
            </svg>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="max-w-4xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// about me</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              <ScrambleText text="Exploring the digital universe" trigger={visibleSections.has('about')} className="text-purple-400" />
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-6">
                <p className="text-purple-200 leading-relaxed text-sm">
                  Dynamic Cybersecurity Engineer and Software Developer with 2+ years of hands-on experience delivering enterprise-grade solutions in high-stakes financial and security environments.
                </p>
                <p className="text-purple-300 leading-relaxed text-sm mt-4">
                  I combine deep technical expertise with strong business acumen — managing Rp 1.7 Billion projects, reporting to CTOs, and bridging the gap between complex systems and real business outcomes.
                </p>
              </div>
              <div className="card-glass p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Years Experience', value: '2+' },
                    { label: 'Project Value', value: 'Rp 1.7B' },
                    { label: 'Apps Deployed', value: '10+' },
                    { label: 'Daily Users', value: '1,000+' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-purple-900/20 border border-purple-800/30">
                      <div className="text-2xl font-bold text-purple-300 glow-text">{s.value}</div>
                      <div className="text-xs text-purple-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="max-w-4xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// work experience</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              <ScrambleText text="Mission Log" trigger={visibleSections.has('experience')} />
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px timeline-line" />
              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-12">
                    <div className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 ${exp.is_current ? 'border-purple-400 bg-purple-900/60' : 'border-purple-700 bg-space-deep'}`}>
                      <div className={`w-2 h-2 rounded-full ${exp.is_current ? 'bg-purple-400 animate-pulse' : 'bg-purple-700'}`} />
                    </div>
                    <div className="card-glass p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-base">{exp.title}</h3>
                          <p className="text-purple-400 text-sm">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-purple-500">{exp.start_date} – {exp.end_date || "Present"}</span>
                          {exp.is_current && <div className="mt-1 text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50 inline-block">Current</div>}
                        </div>
                      </div>
                      <p className="text-purple-200 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="max-w-4xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// tech stack</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              <ScrambleText text="Arsenal & Abilities" trigger={visibleSections.has('skills')} />
            </h2>
            <div className="space-y-6 skills-group">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="card-glass p-5">
                  <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <span key={skill} className="skill-pill text-purple-200 opacity-0">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOBBIES */}
        <section id="hobbies" className="max-w-4xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// beyond the code</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              <ScrambleText text="Life in Orbit" trigger={visibleSections.has('hobbies')} />
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {hobbies.map((h) => (
                <div key={h.label} className="hobby-card">
                  <div className="text-5xl mb-4">{h.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{h.label}</h3>
                  <p className="text-purple-400 text-sm leading-relaxed">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOVIES */}
        <section id="movies" className="max-w-5xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// cinematic universe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <ScrambleText text="Favorites from the Multiverse" trigger={visibleSections.has('movies')} />
            </h2>
            <p className="text-purple-400 text-sm mb-12">Movies & series that live rent-free in my head 🎬</p>
            <MovieCarousel movies={movies} />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <ScrambleText text="Let's Connect Across the Galaxy" trigger={visibleSections.has('contact')} />
            </h2>
            <p className="text-purple-300 mb-10 max-w-lg mx-auto text-sm">
              Open for opportunities, collaborations, or just a good conversation about tech, space, or fishing spots.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:gunadharma201@gmail.com" className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-full font-medium transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] text-sm">
                📧 Send Email
              </a>
              <a href="https://linkedin.com/in/gunadharma0408" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-purple-600 text-purple-300 hover:text-white hover:border-purple-400 rounded-full font-medium transition-all text-sm">
                💼 LinkedIn
              </a>
              <a href="https://gunaaax.framer.website" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-purple-600 text-purple-300 hover:text-white hover:border-purple-400 rounded-full font-medium transition-all text-sm">
                🌐 Framer Site
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-purple-900/30 py-8 text-center">
          <p className="font-mono text-purple-700 text-xs tracking-widest">
            © 2026 GUNA DHARMA · BUILT WITH ☕ + 🌌 · JAKARTA, INDONESIA
          </p>
        </footer>

      </div>
    </>
  );
}