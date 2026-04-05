export default function SectionDivider({ kanji }: { kanji: string }) {
  return (
    <div className="relative flex items-center justify-center py-16">
      <div className="absolute left-[clamp(24px,4vw,60px)] right-[clamp(24px,4vw,60px)] top-1/2 h-px bg-[#1e1a17]" />
      <span className="relative z-10 bg-[#0a0a0a] px-6 font-serif text-2xl text-[#8a7b6b] opacity-30">
        {kanji}
      </span>
    </div>
  );
}
