"use client";

import { useState } from "react";

export default function FormScreen({ onSubmit }: { onSubmit: (nome: string) => void }) {
  const [nome, setNome] = useState("");

  const valid = nome.trim().length >= 2;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#1a2850_0%,#0A0F1A_70%)]">
      <div className="w-[90%] max-w-md flex flex-col gap-5 p-6">
        <h1
          className="text-3xl md:text-4xl font-black text-center"
          style={{
            background: "linear-gradient(135deg, #f0b606, #FFD54F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SEUS DADOS
        </h1>

        <label className="text-white/70 text-sm font-semibold tracking-wider">
          NOME E SOBRENOME
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value.toUpperCase())}
          placeholder="Ex: JOÃO SILVA"
          maxLength={30}
          autoComplete="off"
          className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-xl font-bold text-center placeholder:text-white/30 focus:outline-none focus:border-[#f0b606] focus:ring-1 focus:ring-[#f0b606] transition-colors"
          autoFocus
        />

        <button
          onClick={() => valid && onSubmit(nome.trim())}
          disabled={!valid}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wider transition-all ${
            valid
              ? "bg-gradient-to-r from-[#f0b606] to-[#f0b606cc] text-[#0A0F1A] hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(240,182,6,0.3)]"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          PRÓXIMO
        </button>
      </div>
    </div>
  );
}
