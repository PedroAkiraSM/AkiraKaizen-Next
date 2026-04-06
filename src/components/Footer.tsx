export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg px-6 pb-6 pt-16 md:px-10 md:pt-20">
      {/* ── Large decorative name ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none text-center font-display font-bold uppercase leading-none tracking-tight"
        style={{
          fontSize: "clamp(3rem, 10vw, 8rem)",
          opacity: 0.06,
        }}
      >
        AKIRAKAIZEN
      </div>

      {/* ── Three-column content ── */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
        {/* Column 1 - Navigation */}
        <nav className="flex flex-col gap-3">
          <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted/60">
            Menu
          </span>
          {[
            { label: "Projetos", href: "#projetos" },
            { label: "Metodo", href: "#metodo" },
            { label: "Sobre", href: "#sobre" },
            { label: "Contato", href: "#contato" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Column 2 - Contact */}
        <div className="flex flex-col gap-3">
          <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted/60">
            Contato
          </span>
          <a
            href="mailto:contato@akirakaizen.com.br"
            className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
          >
            contato@akirakaizen.com.br
          </a>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
          >
            WhatsApp
          </a>
          <span className="font-body text-sm text-text-muted">
            Sao Paulo, Brasil
          </span>
        </div>

        {/* Column 3 - Social */}
        <div className="flex flex-col gap-3">
          <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted/60">
            Social
          </span>
          <a
            href="https://instagram.com/akirakaizenltda"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/akirakaizen"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/PedroAkiraSM"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body w-fit text-sm text-text-muted transition-colors duration-300 hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-4 border-t border-border pt-6 md:mt-16 md:flex-row md:justify-between md:gap-0">
        {/* Left - Copyright */}
        <span className="text-xs text-text-muted/70">
          &copy; 2026 AkiraKaizen
        </span>

        {/* Center - Philosophy */}
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-text-muted/50">
          Built with{" "}
          <span className="font-kanji text-sm not-italic tracking-normal text-accent/70">
            改善
          </span>{" "}
          Philosophy
        </span>

        {/* Right - Online indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs uppercase tracking-wider text-text-muted">
            Online
          </span>
        </div>
      </div>
    </footer>
  );
}
