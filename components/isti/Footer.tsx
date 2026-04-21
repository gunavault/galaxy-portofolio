export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-sand text-center py-8 px-8">
      <p className="font-mono text-[0.62rem] tracking-widest text-tan uppercase">
        © {new Date().getFullYear()} Istiazah Latifah Sadina &nbsp;·&nbsp; Engineering Physics,
        Telkom University &nbsp;·&nbsp; Bandung, Indonesia
      </p>
    </footer>
  );
}
