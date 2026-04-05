export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        {/* Logo / Name */}
        <span className="font-display text-lg font-semibold tracking-wide text-text">
          AkiraKaizen
        </span>

        {/* Copyright + Philosophy */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm text-text-muted">
            &copy; 2026 AkiraKaizen. Todos os direitos reservados.
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted/50">
            Built with Kaizen Philosophy
          </span>
        </div>

        {/* Online indicator */}
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
