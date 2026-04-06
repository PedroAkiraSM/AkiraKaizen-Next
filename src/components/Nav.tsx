'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { label: { pt: 'PROJETOS', en: 'PROJECTS' }, href: '#projetos' },
  { label: { pt: 'MÉTODO', en: 'METHOD' }, href: '#metodo' },
  { label: { pt: 'SOBRE', en: 'ABOUT' }, href: '#sobre' },
  { label: { pt: 'CONTATO', en: 'CONTACT' }, href: '#contato' },
];

type Lang = 'pt' | 'en';

export default function Nav() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('pt');

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);

      // Only start hiding after scrolling past the entire hero section (300vh)
      const heroEl = document.getElementById('hero');
      const heroEnd = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : window.innerHeight;

      if (current < heroEnd) {
        // Always visible during hero
        setVisible(true);
      } else if (current > lastScroll + 5) {
        // Scrolling down past hero → hide
        setVisible(false);
      } else if (current < lastScroll - 5) {
        // Scrolling up → show
        setVisible(true);
      }
      lastScroll = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [],
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: scrolled
            ? 'rgba(180, 15, 40, 0.95)'
            : 'rgba(180, 15, 40, 0.85)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          padding: '0 28px',
          transform: `translateY(${visible ? '0' : '-100%'})`,
          transition: 'transform 0.3s ease, background 0.5s ease, backdrop-filter 0.5s ease',
        }}
      >
        <div className="mx-auto flex items-center justify-between h-[88px] max-w-[1400px] relative">
          {/* Logo */}
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="flex-shrink-0">
            <Image
              src="/assets/logo-icon.svg"
              alt="AkiraKaizen"
              width={40}
              height={40}
              priority
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center justify-center gap-14">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={styles.navLink}
                >
                  {link.label[lang]}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={toggleLang}
                className={`${styles.navLink} cursor-pointer`}
                aria-label="Toggle language"
              >
                {lang === 'pt' ? 'PT' : 'EN'}
                <span className="opacity-40 mx-1">/</span>
                {lang === 'pt' ? 'EN' : 'PT'}
              </button>
            </li>
          </ul>

          {/* Spacer to balance logo on desktop */}
          <div className="hidden md:block w-[40px]" />

          {/* Hamburger button (mobile) */}
          <button
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-[6px] w-10 h-10 cursor-pointer z-[60]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{
                transform: menuOpen
                  ? 'rotate(45deg) translateY(4px)'
                  : 'none',
              }}
            />
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{
                transform: menuOpen
                  ? 'rotate(-45deg) translateY(-4px)'
                  : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={styles.navLink}
                style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}
              >
                {link.label[lang]}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={toggleLang}
              className={`${styles.navLink} cursor-pointer`}
              style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}
              aria-label="Toggle language"
            >
              {lang === 'pt' ? 'PT' : 'EN'}
              <span className="opacity-40 mx-2">/</span>
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
