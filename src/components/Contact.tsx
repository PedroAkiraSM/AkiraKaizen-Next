'use client';

import { useState, type FormEvent } from 'react';
import MagneticButton from './MagneticButton';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

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
      className="relative overflow-hidden py-28 px-6 md:py-36"
      style={{
        background: 'linear-gradient(to bottom, var(--bg), var(--accent-dark, #2a1215))',
      }}
    >
      {/* -- Decorative background elements -- */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24 items-start">
        {/* -- Left: Info + CTA -- */}
        <div className="flex flex-col justify-center gap-10">
          {/* Heading block */}
          <div className="space-y-5">
            <h2
              className="leading-[1.05] tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                color: 'var(--text)',
              }}
            >
              Seu pr&oacute;ximo projeto
              <br />
              come&ccedil;a aqui.
            </h2>
            <p
              className="max-w-md text-lg leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Tem um projeto em mente? Vamos conversar sobre como transformar
              sua ideia em realidade.
            </p>
          </div>

          {/* WhatsApp CTA */}
          <MagneticButton
            href="https://wa.me/5511999999999"
            className="group relative inline-flex w-fit items-center gap-3 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(252,25,59,0.25)]"
            style={{
              background: 'var(--accent)',
            }}
          >
            {/* Pulse ring */}
            <span
              className="absolute inset-0 animate-[wa-pulse_2s_ease-in-out_infinite] rounded-full opacity-0"
              style={{ background: 'var(--accent)' }}
            />

            {/* WhatsApp icon */}
            <svg
              className="relative z-10 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            <span className="relative z-10">Chamar no WhatsApp</span>
          </MagneticButton>

          {/* Divider */}
          <div
            className="h-px w-16"
            style={{ background: 'var(--border)' }}
          />

          {/* Contact links */}
          <div className="flex flex-col gap-4">
            <a
              href="mailto:contato@akirakaizen.com.br"
              className="group flex items-center gap-3 text-sm transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              contato@akirakaizen.com.br
            </a>
            <a
              href="https://instagram.com/akirakaizenltda"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @akirakaizenltda
            </a>
            <a
              href="https://linkedin.com/company/akirakaizen"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm transition-colors duration-300"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* -- Right: Contact Form -- */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 rounded-2xl p-8 md:p-10 backdrop-blur-sm"
          style={{
            background: 'rgba(10, 10, 10, 0.5)',
            border: '1px solid var(--border)',
          }}
        >
          <p
            className="text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Envie uma mensagem
          </p>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Nome
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="Seu nome"
              className="w-full bg-transparent px-0 py-3 text-base outline-none transition-colors duration-500"
              style={{
                color: 'var(--text)',
                borderBottom: `1px solid ${focused === 'name' ? 'var(--accent)' : 'var(--border)'}`,
              }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-email"
              className="text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="seu@email.com"
              className="w-full bg-transparent px-0 py-3 text-base outline-none transition-colors duration-500"
              style={{
                color: 'var(--text)',
                borderBottom: `1px solid ${focused === 'email' ? 'var(--accent)' : 'var(--border)'}`,
              }}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Mensagem
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setFocused('message')}
              onBlur={() => setFocused(null)}
              placeholder="Conte um pouco sobre o seu projeto..."
              className="w-full resize-none bg-transparent px-0 py-3 text-base outline-none transition-colors duration-500"
              style={{
                color: 'var(--text)',
                borderBottom: `1px solid ${focused === 'message' ? 'var(--accent)' : 'var(--border)'}`,
              }}
            />
          </div>

          {/* Submit */}
          <div className="mt-2">
            <MagneticButton
              className="w-full rounded-full px-8 py-4 text-base font-semibold tracking-wide uppercase text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(252,25,59,0.2)]"
              style={{
                background: 'var(--accent)',
              }}
            >
              Enviar mensagem
            </MagneticButton>
          </div>
        </form>
      </div>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
        #contato input::placeholder,
        #contato textarea::placeholder {
          color: var(--text-muted);
          opacity: 0.4;
        }
      `}</style>
    </section>
  );
}
