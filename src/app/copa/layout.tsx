export const metadata = {
  title: "Copa 2026 - Colégio Santa Maria",
};

export default function CopaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white">
      {children}
    </div>
  );
}
