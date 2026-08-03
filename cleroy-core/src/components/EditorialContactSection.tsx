import React, { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight, Phone, MessageSquare, Mail } from "lucide-react";
import CleroyButton from "./CleroyButton";
import { openGmailCompose, openWhatsApp, makePhoneCall } from "../utils/contact";

export default React.memo(function EditorialContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const typoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Continuously calculate exact font size so CLEROY fills ~96% of viewport width
  useLayoutEffect(() => {
    const calculateFontSize = () => {
      if (!typoContainerRef.current || !textRef.current) return;
      const availableWidth = typoContainerRef.current.clientWidth * 0.96;
      const currentWidth = textRef.current.scrollWidth;
      const currentFS = parseFloat(window.getComputedStyle(textRef.current).fontSize) || 100;

      if (currentWidth > 0 && currentFS > 0) {
        const idealFS = (availableWidth / currentWidth) * currentFS;
        setFontSize(idealFS);
      }
    };

    calculateFontSize();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(calculateFontSize);
    }

    const ro = new ResizeObserver(calculateFontSize);
    if (typoContainerRef.current) {
      ro.observe(typoContainerRef.current);
    }

    window.addEventListener("resize", calculateFontSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calculateFontSize);
    };
  }, []);

  // Background smooth color transition matching the signature Cleroy burnt orange (#D45A12)
  // Darkens subtly (5-10%) into a richer, deeper burnt orange (#AD4407) as footer is reached
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.7, 1.0],
    ["#020202", "#D45A12", "#C2500C", "#AD4407"]
  );

  // Oversized "CLEROY" typography vertical motion:
  // Starts 140px below, rises smoothly into view, and continues traveling upward slowly (20-30% scroll speed) out of frame
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.3, 1.0],
    [150, 0, -280]
  );

  const springY = useSpring(rawY, {
    stiffness: 75,
    damping: 25,
    mass: 0.35,
  });

  const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
  const activeY = isMobileDevice ? 0 : springY;
  const activeBg = isMobileDevice ? "#D45A12" : backgroundColor;

  // Dynamically launch Project Discovery modal
  const handleOpenDiscovery = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-cleroy-discovery"));
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.section
      id="contact"
      ref={containerRef}
      style={{ backgroundColor: activeBg }}
      className="relative w-full min-h-screen py-24 sm:py-36 px-6 sm:px-12 md:px-20 lg:px-28 flex flex-col justify-between overflow-hidden select-none scroll-mt-24 transition-colors duration-300"
    >
      {/* Fine Grain & Subtle Ambient Lighting Overlays */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Soft Center Lighting Glow & Darkened Edge Vignette */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[1400px] h-[50vh] sm:h-[900px] bg-radial from-white/12 via-[#E85002]/15 to-transparent blur-xl sm:blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-black/30 pointer-events-none" />

      {/* OVERSIZED TYPOGRAPHY: "CLEROY" - CONTINUOUS EDGE-TO-EDGE RESPONSIVE SCALING */}
      <div 
        ref={typoContainerRef} 
        className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden flex items-center justify-center pt-8 pb-12 sm:pb-16 z-0 pointer-events-none"
      >
        <motion.div
          ref={textRef}
          style={{ 
            y: activeY, 
            fontSize: fontSize ? `${fontSize}px` : "23.5vw",
            willChange: "transform" 
          }}
          className="font-sans font-black text-[#0A0A0A] leading-none tracking-tighter uppercase whitespace-nowrap text-center select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        >
          CLEROY
        </motion.div>
      </div>

      {/* EDITORIAL CONTACT CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-12 sm:space-y-16 my-auto pt-6">
        
        <div className="space-y-6">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0A0A0A]" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.35em] text-[#0A0A0A]/80 uppercase font-bold">
              PROJECT DISCOVERY
            </span>
          </div>

          {/* Editorial Headline */}
          <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#0A0A0A] font-normal leading-[0.98] tracking-tight max-w-4xl">
            Let’s build <br />
            the future <br />
            <span className="italic font-light">together.</span>
          </h2>

          {/* Supporting Text */}
          <p className="font-sans text-base sm:text-xl text-[#0A0A0A]/80 font-medium max-w-xl leading-relaxed pt-2">
            Every great product begins with a conversation. Let's build yours.
          </p>
        </div>

        {/* Large Interactive Email Link & Direct Action Button */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => openGmailCompose()}
              className="group relative inline-flex items-center gap-2 xs:gap-3 sm:gap-5 text-lg xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-[#0A0A0A] tracking-tight transition-all cursor-pointer break-all sm:break-normal max-w-full text-left"
            >
              <span className="border-b-2 sm:border-b-4 border-[#0A0A0A] pb-1 group-hover:border-[#0A0A0A]/60 transition-colors">
                cleroyhq@gmail.com
              </span>

              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center group-hover:bg-[#0A0A0A] group-hover:text-[#D45A12] text-[#0A0A0A] transition-all duration-300 shadow-md group-hover:scale-105 group-hover:shadow-2xl">
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-45" />
              </div>
            </button>
          </div>

          {/* Quick Contact Chips: Call, WhatsApp, Email */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => makePhoneCall()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0A0A0A]/20 bg-[#0A0A0A]/5 hover:bg-[#0A0A0A] hover:text-[#D45A12] text-[#0A0A0A] font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>CALL US</span>
            </button>

            <button
              type="button"
              onClick={() => openWhatsApp("Hi Cleroy, I'd like to discuss my project.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0A0A0A]/20 bg-[#0A0A0A]/5 hover:bg-[#0A0A0A] hover:text-[#D45A12] text-[#0A0A0A] font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WHATSAPP</span>
            </button>

            <button
              type="button"
              onClick={() => openGmailCompose()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0A0A0A]/20 bg-[#0A0A0A]/5 hover:bg-[#0A0A0A] hover:text-[#D45A12] text-[#0A0A0A] font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>EMAIL US</span>
            </button>
          </div>

          <div className="pt-2">
            <CleroyButton
              variant="primary"
              size="lg"
              onClick={handleOpenDiscovery}
            >
              LAUNCH DISCOVERY HUB
            </CleroyButton>
          </div>
        </div>

      </div>

      {/* MINIMAL EDITORIAL FOOTER */}
      <div className="relative z-10 w-full max-w-6xl mx-auto border-t border-[#0A0A0A]/20 mt-16 sm:mt-20 pt-8 sm:pt-10 space-y-8 sm:space-y-10">
        {/* Top Row: Back to Top Navigation (Structured to allow future social/location widgets without layout redesign) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[#0A0A0A]">
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono tracking-widest text-[#0A0A0A]/70 uppercase block font-bold">
              BACK TO TOP
            </span>
            <button
              type="button"
              onClick={handleScrollTop}
              className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0A0A0A]/10 hover:bg-[#0A0A0A]/20 text-[#0A0A0A] font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span className="w-8 h-[2px] bg-[#0A0A0A] group-hover:w-12 transition-all duration-300" />
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Reserved flex container for future social links or office locations */}
          {/* <div className="flex flex-wrap gap-6 sm:gap-8 font-mono text-xs font-bold tracking-wider" /> */}
        </div>

        {/* Bottom Row: Copyright Only */}
        <div className="pt-6 border-t border-[#0A0A0A]/15 text-center sm:text-left text-[11px] font-mono text-[#0A0A0A]/75 font-semibold tracking-widest uppercase">
          <span>© CLEROY ENGINEERING 2026</span>
        </div>
      </div>

    </motion.section>
  );
});
