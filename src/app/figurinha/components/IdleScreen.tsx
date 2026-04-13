"use client";

import Image from "next/image";

export default function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#1a2850_0%,#0A0F1A_70%)]">
      <div className="relative w-52 h-72 md:w-64 md:h-88 mb-6 animate-[float_3s_ease-in-out_infinite]">
        <Image
          src="/assets/figurinha/CardCopa.png"
          alt="Card Copa"
          fill
          className="object-contain drop-shadow-[0_10px_30px_rgba(240,182,6,0.25)]"
          priority
        />
      </div>
      <h1
        className="text-4xl md:text-6xl font-black text-center leading-tight mb-2"
        style={{
          fontFamily: "'Impact', 'Haettenschweiler', sans-serif",
          background: "linear-gradient(135deg, #f0b606, #FFD54F)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        CRIE SUA<br />FIGURINHA!
      </h1>
      <button
        onClick={onStart}
        className="mt-6 px-10 py-4 rounded-full font-bold text-lg tracking-wider bg-gradient-to-r from-[#f0b606] to-[#f0b606cc] text-[#0A0F1A] hover:scale-105 active:scale-95 transition-transform shadow-[0_4px_20px_rgba(240,182,6,0.3)] animate-[btn-glow_2.5s_ease-in-out_infinite]"
      >
        TOQUE PARA COMEÇAR
      </button>
    </div>
  );
}
