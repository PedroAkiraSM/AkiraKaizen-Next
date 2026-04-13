"use client";

import { useEffect, useRef, useState } from "react";
import { composeCard } from "../lib/imageComposer";
import { removeBackground } from "../lib/removeBg";

const PREVIEW_DURATION = 7;

interface Props {
  capturedFrame: HTMLCanvasElement;
  nome: string;
  onDone: () => void;
}

export default function PreviewScreen({ capturedFrame, nome, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Removendo fundo...");
  const [ready, setReady] = useState(false);
  const [timer, setTimer] = useState(PREVIEW_DURATION);

  useEffect(() => {
    let cancelled = false;

    async function compose() {
      let personImg: HTMLImageElement | null = null;

      try {
        setStatus("Removendo fundo...");
        personImg = await removeBackground(capturedFrame);
      } catch (e) {
        console.error("remove.bg falhou:", e);
        setStatus("Usando foto sem recorte...");
      }

      if (cancelled) return;

      setStatus("Compondo figurinha...");
      const result = await composeCard(capturedFrame, personImg, nome);

      if (cancelled) return;

      // Display on canvas
      const displayCanvas = canvasRef.current;
      if (displayCanvas) {
        displayCanvas.width = result.width;
        displayCanvas.height = result.height;
        displayCanvas.getContext("2d")!.drawImage(result, 0, 0);
      }

      // Auto-download
      const link = document.createElement("a");
      const safeName = nome.replace(/\s+/g, "_");
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      link.download = `figurinha_${safeName}_${ts}.png`;
      link.href = result.toDataURL("image/png");
      link.click();

      setStatus("Salvo!");
      setReady(true);
    }

    compose();
    return () => { cancelled = true; };
  }, [capturedFrame, nome]);

  // Auto-reset timer
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          onDone();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [ready, onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0F1A] p-4">
      <h1
        className="text-3xl md:text-5xl font-black mb-4"
        style={{
          fontFamily: "'Impact', sans-serif",
          fontStyle: "italic",
          background: "linear-gradient(135deg, #f0b606, #FFD54F)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SUA FIGURINHA!
      </h1>

      <div
        className={`transition-all duration-1000 ${
          ready ? "animate-[cardReveal_1s_ease-out_forwards]" : "opacity-50 scale-90"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="max-h-[65vh] max-w-[90vw] object-contain rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        />
      </div>

      <p className="mt-4 text-[#f0b606] font-bold text-lg">{status}</p>
      {ready && (
        <p className="text-white/40 text-sm mt-1">
          Próximo em {timer}
        </p>
      )}
    </div>
  );
}
