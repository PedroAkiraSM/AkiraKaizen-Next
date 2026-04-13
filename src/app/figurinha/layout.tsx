export const metadata = {
  title: "Figurinha da Copa 2026 - Colégio Santa Maria",
};

export default function FigurinhaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white overflow-hidden">
      {children}
    </div>
  );
}
