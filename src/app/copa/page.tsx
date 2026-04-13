"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const games = [
  {
    title: "FIGURINHA DA COPA",
    description: "Crie sua figurinha oficial! Tire uma foto e vire um card colecionável da Copa 2026.",
    href: "/figurinha",
    image: "/assets/figurinha/CardCopa.png",
    color: "#f0b606",
    gradient: "from-yellow-600/20 to-amber-900/20",
    border: "border-yellow-500/30",
  },
  {
    title: "GOLEIRO VIRTUAL",
    description: "Defenda o gol usando suas mãos! Mostre suas habilidades de goleiro contra chutes cada vez mais difíceis.",
    href: "/goleiro",
    image: "/assets/goleiro/FundoGoleirPOV.png",
    color: "#50c850",
    gradient: "from-green-600/20 to-emerald-900/20",
    border: "border-green-500/30",
  },
];

export default function CopaHub() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[radial-gradient(ellipse_at_50%_30%,#1a2850_0%,#0A0F1A_70%)]">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)",
        }}
      />

      {/* Title */}
      <div
        className={`text-center mb-10 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
      >
        <h1
          className="text-5xl md:text-7xl font-black tracking-tight"
          style={{
            fontFamily: "'Russo One', sans-serif",
            background: "linear-gradient(135deg, #f0b606 0%, #FFD54F 50%, #f0b606 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
          }}
        >
          COPA 2026
        </h1>
        <p className="text-white/50 text-lg mt-2 tracking-widest font-medium">
          COLÉGIO SANTA MARIA
        </p>
      </div>

      {/* Game Cards */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl relative z-10">
        {games.map((game, i) => (
          <Link
            key={game.href}
            href={game.href}
            className={`group flex-1 rounded-2xl overflow-hidden border ${game.border} bg-gradient-to-br ${game.gradient} backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(240,182,6,0.15)] ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${300 + i * 200}ms` }}
          >
            {/* Image */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2
                className="text-2xl md:text-3xl font-black tracking-wide mb-2"
                style={{ color: game.color }}
              >
                {game.title}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                {game.description}
              </p>
              <div
                className="w-full py-3 rounded-xl text-center font-bold text-lg tracking-wider transition-all duration-300 group-hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)`,
                  color: "#0A0F1A",
                }}
              >
                JOGAR
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p
        className={`mt-10 text-white/20 text-xs tracking-widest transition-all duration-700 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        ATIVAÇÃO COPA DO MUNDO 2026
      </p>
    </div>
  );
}
