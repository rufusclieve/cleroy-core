import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Audience {
  id: string;
  word: string;
  subtitle: string;
}

const AUDIENCES: Audience[] = [
  { id: "01", word: "ENTERPRISES", subtitle: "Engineering at global scale." },
  { id: "02", word: "VISIONARIES", subtitle: "Shaping tomorrow's innovation." },
  { id: "03", word: "CREATORS", subtitle: "Building unforgettable experiences." },
  { id: "04", word: "STARTUPS", subtitle: "From idea to launch." },
  { id: "05", word: "FOUNDERS", subtitle: "Turning vision into reality." },
  { id: "06", word: "BRANDS", subtitle: "Crafting meaningful identities." },
  { id: "07", word: "TEAMS", subtitle: "Empowering collaboration." },
  { id: "08", word: "INNOVATORS", subtitle: "Transforming bold concepts." },
];

export default React.memo(function StorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync scroll position with active index
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  const scrollToCard = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const targetChild = children[index];
    if (targetChild) {
      const targetScroll =
        targetChild.offsetLeft - (container.clientWidth - targetChild.offsetWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      id="story-cinematic-chapter1"
      className="relative w-full bg-[#020202] text-[#F5EFE7] py-16 sm:py-24 px-0 space-y-8 sm:space-y-12 overflow-hidden z-20 select-none"
    >
      {/* Background Engineering Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60 z-0" />

      {/* Ambient Orange Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,90,18,0.14)_0%,rgba(212,90,18,0.02)_60%,transparent_80%)] pointer-events-none z-0" />

      {/* Header Block Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "200px" }}
        className="w-full text-center px-4 max-w-4xl mx-auto space-y-2.5 z-20 relative"
      >
        <span className="text-[#D45A12] font-mono text-[10px] sm:text-xs tracking-[0.40em] uppercase block font-bold">
          WHO WE EMPOWER
        </span>

        <h2 className="flex flex-col items-center justify-center text-center my-1.5 space-y-1">
          <div className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-3 gap-y-0.5">
            <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-[#F5EFE7] tracking-wider uppercase">
              WE BUILD
            </span>
            <span className="font-sans text-xl sm:text-3xl md:text-4xl font-light text-[#F5EFE7] tracking-tight">
              technology for the
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-3 gap-y-0.5">
            <span className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-normal text-[#D45A12] tracking-wide drop-shadow-[0_0_25px_rgba(212,90,18,0.25)]">
              people shaping
            </span>
            <span className="font-sans text-2xl sm:text-4xl md:text-5xl font-bold text-[#F5EFE7] tracking-tight">
              tomorrow.
            </span>
          </div>
        </h2>

        <p className="text-zinc-400/70 font-sans text-[9px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase mt-1 font-normal">
          EXPLORE WHO WE EMPOWER
        </p>
      </motion.div>

      {/* Horizontal Spotlight Container */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-0">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-8 sm:py-12 px-[10vw] sm:px-[14vw] md:px-[18vw] gap-4 sm:gap-8 items-center touch-pan-x min-h-[280px] sm:min-h-[360px] md:min-h-[400px]"
        >
          {AUDIENCES.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                onClick={() => scrollToCard(index)}
                className={`snap-center shrink-0 w-[78vw] sm:w-[68vw] md:w-[60vw] max-w-2xl min-h-[220px] sm:min-h-[280px] md:min-h-[320px] relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-500 ease-[0.16,1,0.3,1] cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? "scale-100 opacity-100 bg-[#0A0A0A]/90 border border-[#FF802B]/35 shadow-[0_0_60px_rgba(212,90,18,0.20),inset_0_0_30px_rgba(255,128,43,0.05)] z-20"
                    : "scale-90 opacity-40 hover:opacity-65 bg-[#080808]/60 border border-white/10 z-10"
                }`}
              >
                {/* Active Soft Radial Glow Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,128,43,0.12)_0%,transparent_70%)] pointer-events-none" />
                )}

                {/* Left Thin Orange Accent Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 transition-all duration-500 rounded-l-2xl sm:rounded-l-3xl ${
                    isActive
                      ? "bg-gradient-to-b from-[#FF802B] via-[#D45A12] to-transparent shadow-[0_0_15px_#FF802B]"
                      : "bg-zinc-800/80"
                  }`}
                />

                {/* Top Row: Index Badge */}
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#D45A12]">
                    {item.id}
                  </span>
                  <span className="font-mono text-[9px] sm:text-xs tracking-widest text-zinc-500 uppercase">
                    AUDIENCE
                  </span>
                </div>

                {/* Center / Content: Title & Subtitle */}
                <div className="my-auto py-3 relative z-10 space-y-2 sm:space-y-3">
                  <h3
                    className={`font-sans font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F5EFE7] tracking-tight uppercase leading-none transition-all duration-500 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70"
                    }`}
                  >
                    {item.word}
                  </h3>

                  <p
                    className={`font-serif italic text-sm sm:text-lg md:text-2xl text-[#B8ACA0] font-normal leading-relaxed transition-all duration-500 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Indicator & Controls Bar */}
        <div className="max-w-2xl mx-auto px-6 sm:px-12 flex items-center justify-between pt-2">
          {/* Navigation Arrow Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className={`p-2 sm:p-2.5 rounded-full border border-white/10 transition-all cursor-pointer ${
                activeIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#FF802B]/10 hover:border-[#FF802B]/40 text-[#F5EFE7]"
              }`}
              aria-label="Previous audience"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5EFE7]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToCard(Math.min(AUDIENCES.length - 1, activeIndex + 1))}
              disabled={activeIndex === AUDIENCES.length - 1}
              className={`p-2 sm:p-2.5 rounded-full border border-white/10 transition-all cursor-pointer ${
                activeIndex === AUDIENCES.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#FF802B]/10 hover:border-[#FF802B]/40 text-[#F5EFE7]"
              }`}
              aria-label="Next audience"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5EFE7]" />
            </button>
          </div>

          {/* Right Indicator: 01 / 08 */}
          <div className="font-mono text-xs sm:text-sm tracking-[0.25em] text-[#D45A12] font-bold">
            {String(activeIndex + 1).padStart(2, "0")} / {String(AUDIENCES.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
});
