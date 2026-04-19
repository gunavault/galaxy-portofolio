'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const GalaxyCanvas = dynamic(() => import('@/components/GalaxyCanvas'), { ssr: false });

const skills = {
  'Languages': ['Python', 'JavaScript', 'Go', 'PHP', 'Dart'],
  'Security': ['Splunk SIEM', 'FortiClient EMS', 'Wazuh SCA', 'CIS Hardening', 'ISO 8583'],
  'Frameworks': ['Next.js', 'Django', 'Laravel', 'Flutter', 'Node.js'],
  'Tools': ['Docker', 'Kafka', 'Google Cloud', 'Linux', 'Git', 'Tableau'],
  'Competencies': ['Project Management', 'System Architecture', 'Vendor Management', 'Executive Reporting'],
};

const hobbies = [
  { icon: '🎣', label: 'Fishing', desc: 'Finding peace in patience. Early mornings, quiet water, and the thrill of the catch.' },
  { icon: '🎮', label: 'Gaming', desc: 'Story-driven RPGs and strategy games. Always up for a challenge.' },
  { icon: '⚡', label: 'Doing Fun Stuff', desc: 'Trying new things, building random projects, and exploring what\'s next.' },
];

const movies = [
  { title: 'Interstellar', year: '2014', genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { title: 'Project Hail Mary', year: '2026', genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w1280/yihdXomYb5kTeSivtFndMy5iDmf.jpg' },
  { title: 'Dune', year: '2021', genre: 'Epic Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
  { title: 'Peaky Blinders', year: '2013', genre: 'Crime Drama', poster: 'https://image.tmdb.org/t/p/w1280/iZ5XwfNWOb6tTdIjm2QuYFDTeLu.jpg' },
  { title: 'Dr. Stone', year: '2019', genre: 'Anime', poster: 'https://image.tmdb.org/t/p/w1280/ve1Sv3sVArmE0nlFjzadcNv1G8r.jpg' },
];

const experiences = [
  {
    title: 'Cyber Security Engineer',
    company: 'PT ALTO Network',
    dates: 'Nov 2025 – Present',
    current: true,
    desc: 'Led 3–5 concurrent cybersecurity projects worth up to Rp 1.7 Billion. Managed teams of 2–6, owned vendor selection, budget tracking, and reported directly to CTO. Implemented Splunk SIEM, FortiClient EMS, Wazuh SCA.',
  },
  {
    title: 'Software Engineer',
    company: 'PT ALTO Network',
    dates: 'Nov 2024 – Nov 2025',
    current: false,
    desc: 'Designed end-to-end fraud operations architecture. Built case management system for 11 users, data pipeline processing 10,000 events/sec, and ISO8583 parser at 300MB/s. Improved data integrity by 20%.',
  },
  {
    title: 'Sales & Pre-Sales Consultant',
    company: 'Independent',
    dates: '2024 – Present',
    current: true,
    desc: 'Independently sourcing enterprise clients for cybersecurity solutions. Conducting technical needs assessments and bridging complex security products with business requirements.',
  },
  {
    title: 'IT Internship',
    company: 'PT Perkebunan Nusantara III',
    dates: 'Sep 2023 – Apr 2024',
    current: false,
    desc: 'Built Flutter SOP compliance app used by 1,000+ daily users. Created GIS mapping app deployed across the entire PTPN Group nationwide.',
  },
];

export default function Home() {
  const sectionsRef = useRef<NodeListOf<Element> | null>(null);

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
            Guna Dharma
          </h1>
          <p className="hero-sub text-lg md:text-xl text-purple-300 max-w-xl mb-2 opacity-0">
            Cybersecurity Engineer · Software Developer · Tech Explorer
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
              Exploring the <span className="text-purple-400">digital universe</span>
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
              Mission <span className="text-purple-400">Log</span>
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px timeline-line" />
              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-12">
                    <div className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center border-2 ${exp.current ? 'border-purple-400 bg-purple-900/60' : 'border-purple-700 bg-space-deep'}`}>
                      <div className={`w-2 h-2 rounded-full ${exp.current ? 'bg-purple-400 animate-pulse' : 'bg-purple-700'}`} />
                    </div>
                    <div className="card-glass p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-base">{exp.title}</h3>
                          <p className="text-purple-400 text-sm">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-purple-500">{exp.dates}</span>
                          {exp.current && <div className="mt-1 text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50 inline-block">Current</div>}
                        </div>
                      </div>
                      <p className="text-purple-200 text-sm leading-relaxed">{exp.desc}</p>
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
              Arsenal & <span className="text-purple-400">Abilities</span>
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
              Life in <span className="text-purple-400">Orbit</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {hobbies.map((h) => (
                <div key={h.label} className="hobby-card">
                  <div className="text-5xl mb-4">{h.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{h.label}</h3>
                  <p className="text-purple-400 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOVIES */}
        <section id="movies" className="max-w-4xl mx-auto px-6 py-24">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// cinematic universe</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Favorites from the <span className="text-purple-400">Multiverse</span>
            </h2>
            <p className="text-purple-400 text-sm mb-12">Movies & series that live rent-free in my head 🎬</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {movies.map((m) => (
                <div key={m.title} className="movie-card group">
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-white text-sm">{m.title}</h3>
                    <p className="text-purple-400 text-xs mt-1">{m.genre}</p>
                    <p className="text-purple-600 text-xs font-mono mt-1">{m.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="section-reveal">
            <p className="font-mono text-purple-500 text-xs tracking-widest uppercase mb-3">// contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Connect <span className="text-purple-400">Across the Galaxy</span>
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
