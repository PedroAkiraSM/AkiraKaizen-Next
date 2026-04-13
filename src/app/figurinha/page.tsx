"use client";

import { useState, useCallback } from "react";
import IdleScreen from "./components/IdleScreen";
import FormScreen from "./components/FormScreen";
import CameraScreen from "./components/CameraScreen";
import PreviewScreen from "./components/PreviewScreen";

type Screen = "idle" | "form" | "camera" | "preview";

export default function FigurinhaPage() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [nome, setNome] = useState("");
  const [capturedFrame, setCapturedFrame] = useState<HTMLCanvasElement | null>(null);

  const handleFormSubmit = useCallback((name: string) => {
    setNome(name);
    setScreen("camera");
  }, []);

  const handleCapture = useCallback((frame: HTMLCanvasElement) => {
    setCapturedFrame(frame);
    setScreen("preview");
  }, []);

  const handleReset = useCallback(() => {
    setNome("");
    setCapturedFrame(null);
    setScreen("idle");
  }, []);

  return (
    <>
      {screen === "idle" && <IdleScreen onStart={() => setScreen("form")} />}
      {screen === "form" && <FormScreen onSubmit={handleFormSubmit} />}
      {screen === "camera" && <CameraScreen onCapture={handleCapture} />}
      {screen === "preview" && capturedFrame && (
        <PreviewScreen
          capturedFrame={capturedFrame}
          nome={nome}
          onDone={handleReset}
        />
      )}
    </>
  );
}
