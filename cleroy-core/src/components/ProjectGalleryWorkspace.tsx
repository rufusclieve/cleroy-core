import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import CleroyButton from "./CleroyButton";
import {
  X,
  ArrowLeft,
  ArrowUpRight,
  Zap,
  Sparkles,
  Cpu,
  Layers,
  BarChart3,
  Smartphone,
  Server,
  ShieldCheck,
  CheckCircle2,
  Globe,
  ExternalLink,
  ChevronRight,
  Activity,
  Terminal,
  Grid
} from "lucide-react";

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  status: string;
  description: string;
  longDescription: string;
  liveUrl: string;
  tags: string[];
  icon: React.ElementType;
  accentColor: string;
  highlights: string[];
  metrics: {
    latency: string;
    uptime: string;
    throughput: string;
  };
  architecturalOverview: string;
}

export const CLEROY_PROJECTS: ProjectItem[] = [
  {
    id: "matts-glitters",
    name: "MATT'S GLITTERS",
    subtitle: "Salon Management Platform",
    category: "Salon Management & E-Commerce",
    status: "LIVE / PRODUCTION",
    description: "Enterprise multi-branch salon booking, automated staff commissions, service catalogs & client notifications.",
    longDescription: "A modern full-stack salon management platform engineered to streamline appointments, staff commission tracking, multi-location inventory, and automated client communications via WhatsApp.",
    liveUrl: "https://matts-glitters-demo.vercel.app",
    tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Realtime Sync"],
    icon: Zap,
    accentColor: "#E85002",
    highlights: [
      "Multi-Branch Appointment Scheduling with sub-second conflict resolution",
      "Automated Staff Commission & Performance Telemetry Dashboard",
      "Real-time Inventory & Service Catalog Management",
      "Integrated WhatsApp Client Reminders & Payment Gateways"
    ],
    metrics: {
      latency: "6.4ms",
      uptime: "99.98%",
      throughput: "2.4k req/s"
    },
    architecturalOverview: "Built on an event-driven serverless architecture with real-time state synchronization, enabling zero-latency multi-terminal booking updates across salon branches."
  }
];

interface ProjectGalleryWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectGalleryWorkspace({ isOpen, onClose }: ProjectGalleryWorkspaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  // Esc key listener to close gallery or return to grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedProject, onClose]);

  // Lock body scroll when workspace is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSelectedProject(null);
      setIsLaunching(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const categories = ["ALL", "SALON & RETAIL", "AI & INTELLIGENCE", "FINANCE & TELEMETRY", "HEALTH & INFRASTRUCTURE"];

  const filteredProjects = selectedCategory === "ALL"
    ? CLEROY_PROJECTS
    : CLEROY_PROJECTS.filter((p) => {
        if (selectedCategory === "SALON & RETAIL") return p.category.includes("Salon");
        if (selectedCategory === "AI & INTELLIGENCE") return p.category.includes("AI") || p.category.includes("Neural");
        if (selectedCategory === "FINANCE & TELEMETRY") return p.category.includes("Financial") || p.category.includes("Supply");
        if (selectedCategory === "HEALTH & INFRASTRUCTURE") return p.category.includes("Health") || p.category.includes("SaaS");
        return true;
      });

  const handleLaunchProduct = (project: ProjectItem) => {
    // Open live demo in a new browser tab with target="_blank" rel="noopener noreferrer"
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");

    if (isLaunching) return;

    // Save exact navigation state & scroll position before launch
    try {
      const state = {
        savedScrollY: window.scrollY,
        isReturning: true,
        sectionId: "projects",
        timestamp: Date.now(),
      };
      sessionStorage.setItem("cleroy_saved_navigation_state", JSON.stringify(state));
      if (window.history && window.history.replaceState) {
        window.history.replaceState({ ...window.history.state, cleroyState: state }, "");
      }
    } catch (err) {
      console.error("Failed to save navigation state:", err);
    }

    setIsLaunching(true);

    setTimeout(() => {
      setIsLaunching(false);
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="project-gallery-overlay"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[1000] bg-[#020202] text-[#F5EFE7] overflow-y-auto overflow-x-hidden selection:bg-[#D45A12]/30 selection:text-[#FFD8A0]"
      >
        {/* Background Ambient Volumetric Lighting */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] bg-[#E85002]/10 blur-[220px] pointer-events-none z-0" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#D45A12]/10 blur-[200px] pointer-events-none z-0" />
        
        {/* Film Grain Texture Overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-50 w-full bg-[#020202]/85 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 lg:px-16 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedProject) {
                  setSelectedProject(null);
                } else {
                  onClose();
                }
              }}
              className="flex items-center gap-2 font-mono text-xs text-[#B8ACA0] hover:text-[#FF7A00] transition-colors uppercase tracking-[0.2em] font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{selectedProject ? "BACK TO GALLERY" : "BACK TO HOME"}</span>
            </button>

            <span className="hidden sm:inline-block text-white/20">|</span>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#E85002] bg-[#E85002]/10 border border-[#E85002]/30 px-3 py-1 rounded-full uppercase font-bold">
              <Sparkles className="w-3 h-3 text-[#E85002]" />
              <span>CLEROY DIGITAL EXHIBITION</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">
              ESC TO EXIT
            </span>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#E85002]/60 hover:bg-[#E85002]/20 transition-all duration-300"
              aria-label="Close Project Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 md:py-20">
          <AnimatePresence mode="wait">
            {!selectedProject ? (
              /* VIEW 1: FULL PROJECT GALLERY GRID */
              <motion.div
                key="gallery-grid-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col space-y-12"
              >
                {/* GALLERY HEADER TYPOGRAPHY */}
                <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E85002] animate-pulse" />
                    <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#E85002] uppercase font-bold">
                      [ CURATED EXHIBITION ]
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F5EFE7] tracking-tight font-light leading-[0.98]">
                    SELECTED WORK
                  </h1>

                  <p className="font-sans text-base sm:text-lg lg:text-xl text-[#B8ACA0] max-w-2xl font-light leading-relaxed">
                    Every product we showcase has been designed, engineered, and delivered by Cleroy. Quality over quantity.
                  </p>
                </div>

                {/* CATEGORY FILTER TABS (Rendered when multiple projects exist) */}
                {filteredProjects.length > 1 && (
                  <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-full font-mono text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-300 ${
                            isActive
                              ? "bg-[#E85002] text-white font-bold shadow-[0_0_20px_rgba(232,80,2,0.4)]"
                              : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* PROJECT CARDS SHOWCASE (FEATURED CASE STUDY FOR SINGLE PROJECT, GRID FOR MULTIPLE) */}
                <div className={`pt-4 ${filteredProjects.length === 1 ? "flex flex-col items-center max-w-4xl mx-auto w-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}`}>
                  {filteredProjects.map((project, idx) => {
                    const IconComponent = project.icon;
                    const isSingle = filteredProjects.length === 1;

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => handleLaunchProduct(project)}
                        data-cursor="card"
                        className={`project-card exhibition-card group relative w-full bg-gradient-to-br from-[#121216] via-[#09090b] to-[#040405] border border-white/10 hover:border-[#E85002]/70 rounded-3xl cursor-none transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_30px_80px_rgba(232,80,2,0.25)] overflow-hidden flex flex-col justify-between ${
                          isSingle ? "p-8 sm:p-12 space-y-8" : "p-7 sm:p-8 space-y-8"
                        }`}
                      >
                        {/* Ambient Card Background Glow on Hover */}
                        <div className="absolute -inset-10 bg-radial from-[#E85002]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />

                        {/* TOP METADATA & STATUS */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#E85002] bg-[#E85002]/10 border border-[#E85002]/30 px-3.5 py-1 rounded-full uppercase font-bold backdrop-blur-md">
                              {project.status}
                            </span>
                            {isSingle && (
                              <span className="font-mono text-xs text-[#B8ACA0] uppercase tracking-wider hidden sm:inline-block">
                                {project.subtitle}
                              </span>
                            )}
                          </div>

                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#E85002] group-hover:bg-[#E85002] group-hover:text-white transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* CARD VISUAL CANVAS */}
                        <div className={`relative z-10 my-2 rounded-2xl bg-[#08080A]/90 border border-white/5 group-hover:border-[#E85002]/30 transition-colors flex flex-col space-y-4 ${
                          isSingle ? "py-8 px-6 sm:px-10" : "py-6 px-5"
                        }`}>
                          <div className="flex items-center gap-2 font-mono text-xs text-[#E85002] uppercase tracking-wider font-semibold">
                            <IconComponent className="w-4 h-4 text-[#E85002]" />
                            <span>{project.category}</span>
                          </div>

                          <h3 className={`font-sans font-extrabold text-[#F5EFE7] group-hover:text-white tracking-tight uppercase leading-tight ${
                            isSingle ? "text-3xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl"
                          }`}>
                            {project.name}
                          </h3>

                          <p className={`font-sans text-[#B8ACA0] leading-relaxed font-light ${
                            isSingle ? "text-base sm:text-lg" : "text-xs sm:text-sm line-clamp-2"
                          }`}>
                            {project.description}
                          </p>
                        </div>

                        {/* TECH TAGS & FOOTER */}
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="font-mono text-[10px] sm:text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs text-[#FF7A00] tracking-[0.2em] font-bold uppercase group-hover:text-white transition-colors shrink-0">
                            <span>VIEW CASE STUDY</span>
                            <ChevronRight className="w-4 h-4 text-[#FF7A00] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SUBTLE EMPTY STATE / FUTURE READY NOTICE */}
                <div className="flex flex-col items-center text-center space-y-2 pt-8 pb-4">
                  <div className="w-12 h-[1px] bg-white/10 mb-3" />
                  <p className="font-mono text-xs sm:text-sm text-[#B8ACA0]/60 tracking-[0.2em] uppercase font-light">
                    More engineering stories are currently in development.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* VIEW 2: INDIVIDUAL PROJECT SHOWCASE DETAIL */
              <motion.div
                key="project-showcase-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col space-y-12"
              >
                {/* SHOWCASE HEADER & BACK BAR */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-2 font-mono text-xs text-[#B8ACA0] hover:text-[#FF7A00] transition-colors uppercase tracking-[0.2em] font-bold group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>ALL PROJECTS</span>
                  </button>

                  <div className="flex items-center gap-3 font-mono text-xs text-[#E85002]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="uppercase font-bold tracking-widest">{selectedProject.status}</span>
                  </div>
                </div>

                {/* SHOWCASE EDITORIAL CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  
                  {/* LEFT: HIGH-IMPACT PROJECT CARD VISUAL */}
                  <div className="lg:col-span-7 flex flex-col space-y-8">
                    <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#121216] via-[#09090b] to-[#040405] border border-[#E85002]/40 p-8 sm:p-12 flex flex-col justify-between shadow-[0_30px_100px_rgba(232,80,2,0.25)] overflow-hidden">
                      {/* Background Ambient Aura */}
                      <div className="absolute -inset-10 bg-radial from-[#E85002]/30 via-transparent to-transparent blur-3xl pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-mono text-xs tracking-[0.25em] text-[#E85002] bg-[#E85002]/10 border border-[#E85002]/30 px-3.5 py-1.5 rounded-full uppercase font-bold">
                          EXHIBIT DETAILS
                        </span>

                        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                          <Activity className="w-3.5 h-3.5" />
                          <span>STATE LATENCY {selectedProject.metrics.latency}</span>
                        </div>
                      </div>

                      <div className="relative z-10 my-auto flex flex-col space-y-4">
                        <span className="font-mono text-xs sm:text-sm tracking-[0.35em] text-[#B8ACA0] uppercase font-semibold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#E85002]" />
                          {selectedProject.category}
                        </span>

                        <h2 className="font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F5EFE7] tracking-tight uppercase leading-[0.95]">
                          {selectedProject.name}
                        </h2>

                        <p className="font-sans text-base sm:text-lg text-[#B8ACA0] font-light leading-relaxed">
                          {selectedProject.longDescription}
                        </p>
                      </div>

                      {/* TELEMETRY METRICS ROW */}
                      <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                        <div>
                          <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest">LATENCY</span>
                          <span className="font-mono text-sm sm:text-base text-white font-bold">{selectedProject.metrics.latency}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest">UPTIME</span>
                          <span className="font-mono text-sm sm:text-base text-white font-bold">{selectedProject.metrics.uptime}</span>
                        </div>
                        <div>
                          <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest">THROUGHPUT</span>
                          <span className="font-mono text-sm sm:text-base text-white font-bold">{selectedProject.metrics.throughput}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION CTA: EXPLORE PRODUCT */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <div>
                        <h4 className="font-sans text-lg font-bold text-white uppercase">READY TO EXPERIENCE LIVE PRODUCT?</h4>
                        <p className="font-sans text-xs text-[#B8ACA0] font-light">Opens the live interactive software in the same browser session.</p>
                      </div>

                      <CleroyButton
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                        onClick={() => handleLaunchProduct(selectedProject)}
                        disabled={isLaunching}
                      >
                        {isLaunching ? "LAUNCHING EXPERIENCE..." : "EXPLORE PRODUCT"}
                      </CleroyButton>
                    </div>
                  </div>

                  {/* RIGHT: ARCHITECTURE & HIGHLIGHTS SPECIFICATION */}
                  <div className="lg:col-span-5 flex flex-col space-y-8">
                    {/* ARCHITECTURAL HIGHLIGHTS */}
                    <div className="flex flex-col space-y-4">
                      <h3 className="font-mono text-xs tracking-[0.25em] text-[#E85002] uppercase font-bold flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        <span>ENGINEERING HIGHLIGHTS</span>
                      </h3>

                      <div className="flex flex-col space-y-3">
                        {selectedProject.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <CheckCircle2 className="w-4 h-4 text-[#E85002] shrink-0 mt-0.5" />
                            <span className="font-sans text-xs sm:text-sm text-[#F5EFE7] font-light leading-relaxed">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SYSTEM ARCHITECTURE OVERVIEW */}
                    <div className="flex flex-col space-y-3 p-6 rounded-2xl bg-[#08080A] border border-white/10">
                      <h4 className="font-mono text-xs tracking-[0.2em] text-[#FF7A00] uppercase font-bold">
                        SYSTEM ARCHITECTURE
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-[#B8ACA0] font-light leading-relaxed">
                        {selectedProject.architecturalOverview}
                      </p>
                    </div>

                    {/* TECHNOLOGY STACK */}
                    <div className="flex flex-col space-y-3">
                      <h4 className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase font-bold">
                        TECHNOLOGY STACK
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-xs text-white/80 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
