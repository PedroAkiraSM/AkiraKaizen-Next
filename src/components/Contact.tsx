'use client';

import { useState, type FormEvent } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato de ${name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
    );
    window.location.href = `mailto:contato@akirakaizen.com.br?subject=${subject}&body=${body}`;
  }

  return (
    <section
      id="contato"
      className="relative py-24 px-6"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0a, #2a1215)',
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        {/* ── Left: Info + CTA ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-8">
          <div className="space-y-4">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-text">
              Seu pr&oacute;ximo projeto come&ccedil;a aqui.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-text-muted">
              Tem um projeto em mente? Vamos conversar sobre como transformar
              sua ideia em realidade digital.
            </p>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/5511977987813"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex w-fit items-center gap-3 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* pulse ring */}
            <span className="absolute inset-0 animate-[wa-pulse_2s_ease-in-out_infinite] rounded-lg bg-accent opacity-0" />

            {/* WhatsApp icon */}
            <svg
              className="relative z-10 h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            <span className="relative z-10">Chamar no WhatsApp</span>
          </a>

          {/* Secondary links */}
          <div className="flex flex-col gap-3 text-sm text-text-muted">
            <a
              href="mailto:contato@akirakaizen.com.br"
              className="transition-colors duration-300 hover:text-text"
            >
              contato@akirakaizen.com.br
            </a>
            <a
              href="https://instagram.com/akirakaizenltda"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-text"
            >
              @akirakaizenltda
            </a>
            <a
              href="https://linkedin.com/company/akirakaizen"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-text"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* ── Right: Contact Form ───────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-border bg-bg-alt/40 p-8 backdrop-blur-sm"
        >
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-text-muted">
              Nome
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors duration-300 focus:border-accent"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-sm font-medium text-text-muted">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors duration-300 focus:border-accent"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-text-muted">
              Mensagem
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Conte um pouco sobre o seu projeto..."
              className="resize-none rounded-lg border border-border bg-bg px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors duration-300 focus:border-accent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            Enviar mensagem
          </button>
        </form>
      </div>

      {/* Pulse keyframe (scoped via Tailwind arbitrary) */}
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
