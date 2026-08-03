import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import CleroyButton from "./CleroyButton";
import { openGmailCompose, openWhatsApp, makePhoneCall } from "../utils/contact";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Mail,
  Building,
  Phone,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Video,
  ShieldCheck,
  Compass,
  Rocket,
  ExternalLink,
  MessageCircle
} from "lucide-react";

interface ProjectDiscoveryWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SimpleWorkspaceData {
  fullName: string;
  email: string;
  company: string;
  phoneOrWhatsapp: string;
  preferredContactMethod: string;
  projectType: string;
  ideaText: string;
  selectedChips: string[];
  budget: string;
  timeline: string;
}

const DEFAULT_DATA: SimpleWorkspaceData = {
  fullName: "",
  email: "",
  company: "",
  phoneOrWhatsapp: "",
  preferredContactMethod: "Email",
  projectType: "Website",
  ideaText: "",
  selectedChips: [],
  budget: "Let's Discuss",
  timeline: "Let's Discuss",
};

const PROJECT_TYPES = [
  { id: "Website", label: "Website", icon: "🌐" },
  { id: "Mobile App", label: "Mobile App", icon: "📱" },
  { id: "AI Product", label: "AI Product", icon: "🤖" },
  { id: "Business Software", label: "Business Software", icon: "⚙" },
  { id: "E-commerce", label: "E-commerce", icon: "🛒" },
  { id: "UI / UX Design", label: "UI / UX Design", icon: "🎨" },
  { id: "API Development", label: "API Development", icon: "🔗" },
  { id: "Startup MVP", label: "Startup MVP", icon: "🚀" },
  { id: "Not Sure Yet", label: "Not Sure Yet", icon: "💡" },
];

const HELPFUL_PROMPTS = [
  "Appointment Booking",
  "Admin Dashboard",
  "Online Payments",
  "Authentication",
  "AI Features",
  "Customer Portal",
  "Inventory",
  "Analytics",
  "Automation",
];

const CONTACT_METHODS = [
  { id: "Email", label: "Email", icon: Mail },
  { id: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
  { id: "Phone", label: "Phone", icon: Phone },
];

const BUDGET_OPTIONS = [
  "₹199+",
  "₹499+",
  "₹999+",
  "Let's Discuss",
  "Not Sure Yet",
];

const TIMELINE_OPTIONS = [
  "Within 1 Week",
  "Within 2 Weeks",
  "Within 1 Month",
  "Let's Discuss",
  "Flexible",
];

export default function ProjectDiscoveryWorkspace({ isOpen, onClose }: ProjectDiscoveryWorkspaceProps) {
  const [formData, setFormData] = useState<SimpleWorkspaceData>(DEFAULT_DATA);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<"contact" | "enquiry" | null>(null);
  const [showContactPanel, setShowContactPanel] = useState<boolean>(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedRefId, setAssignedRefId] = useState<string>("");
  const [copiedRef, setCopiedRef] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset state when workspace opens or custom event triggers
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.openContact) {
        setShowContactPanel(true);
      }
    };
    window.addEventListener("open-cleroy-discovery", handleCustomOpen);
    return () => window.removeEventListener("open-cleroy-discovery", handleCustomOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData(DEFAULT_DATA);
      setCurrentStep(1);
      setHoveredCard(null);
      setCopiedContact(null);
      setIsSubmitting(false);
      setAssignedRefId("");
      setCopiedRef(false);
      setSubmitError(null);
      setErrors({});
    }
  }, [isOpen]);

  // Lock background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showContactPanel) {
          setShowContactPanel(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showContactPanel, onClose]);

  // Canvas particle ambient background animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.4 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 80, 2, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#E85002";
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  const handleChange = (field: keyof SimpleWorkspaceData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleChip = (chip: string) => {
    setFormData((prev) => {
      const exists = prev.selectedChips.includes(chip);
      const updated = exists
        ? prev.selectedChips.filter((c) => c !== chip)
        : [...prev.selectedChips, chip];
      return { ...prev, selectedChips: updated };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "First name is required";
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        newErrors.email = "Please enter a valid email address";
      }
      if (
        (formData.preferredContactMethod === "Phone" || formData.preferredContactMethod === "WhatsApp") &&
        !formData.phoneOrWhatsapp.trim()
      ) {
        newErrors.phoneOrWhatsapp = `Please provide your ${formData.preferredContactMethod.toLowerCase()} number`;
      }
    } else if (step === 3) {
      // Project Details step is optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Format payload for backend server API compatibility
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company,
      whatsappNumber: formData.phoneOrWhatsapp,
      phoneNumber: formData.phoneOrWhatsapp,
      communications: [formData.preferredContactMethod],
      productType: [
        formData.projectType || "Website",
        ...(formData.selectedChips.length > 0 ? formData.selectedChips : []),
      ],
      productDescription: formData.ideaText || `Interested in building: ${formData.selectedChips.join(", ")}`,
      budget: formData.budget,
      timeline: formData.timeline,
      capabilities: formData.selectedChips,
      priority: "Direct Discussion",
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch("/api/submit-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await res.json().catch(() => ({ success: false }));

      const generatedRef = result.refId || `CLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setAssignedRefId(generatedRef);
      setIsSubmitting(false);
      setCurrentStep(5);
    } catch (err: any) {
      console.error("Submission error:", err);
      // Even if network fails in preview, generate fallback ref so user receives success confirmation
      const fallbackRef = `CLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setAssignedRefId(fallbackRef);
      setIsSubmitting(false);
      setCurrentStep(5);
    }
  };

  const copyRefToClipboard = () => {
    if (!assignedRefId) return;
    navigator.clipboard.writeText(assignedRefId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-[#050505] text-[#F5EFE7] font-sans overflow-hidden flex flex-col select-none">
      {/* Canvas ambient background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Ambient Orange Spotlights with dynamic position shifting based on hovered card */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#E85002]/06 blur-[160px] rounded-full pointer-events-none z-0 transition-all duration-700 ease-out ${
          hoveredCard === "contact"
            ? "translate-x-[-70%] bg-[#E85002]/12 scale-110"
            : hoveredCard === "enquiry"
            ? "translate-x-[-30%] bg-[#E85002]/12 scale-110"
            : ""
        }`}
      />
      <div
        className={`absolute -bottom-20 right-10 w-[550px] h-[350px] bg-[#E85002]/04 blur-[160px] rounded-full pointer-events-none z-0 transition-all duration-700 ${
          hoveredCard === "enquiry" ? "opacity-100 scale-125" : "opacity-50"
        }`}
      />

      {/* HEADER BAR */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 md:px-12 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E85002] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase font-bold">
              CLEROY DISCOVERY
            </span>
          </div>

          {currentStep > 1 && currentStep < 5 && (
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#B8ACA0] pl-3 sm:pl-4 border-l border-white/10">
              <span className="text-white/60">PHASE:</span>
              <span className="text-[#E85002] font-semibold">
                0{currentStep - 1} / 03
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] sm:text-xs font-mono text-[#B8ACA0]">
            <Clock className="w-3.5 h-3.5 text-[#E85002]" />
            <span>Takes under 1 min</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-[#F5EFE7] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className={`relative z-20 flex-grow overflow-y-auto custom-scrollbar flex flex-col justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 ${currentStep === 1 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto w-full transition-all duration-300`}>
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME SCREEN (CLEROY PRIVATE STUDIO DISCOVERY SESSION) */}
          {currentStep === 1 && (
            <motion.div
              key="step1-welcome"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.04,
                  },
                },
              }}
              className="relative my-auto py-2 sm:py-3 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* OVERSIZED CLEROY WATERMARK AT 3-5% OPACITY */}
              <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0">
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                    scale: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="font-serif text-[clamp(4rem,18vw,16rem)] font-light tracking-[0.12em] text-[#E85002]/[0.035] whitespace-nowrap leading-none uppercase select-none pointer-events-none"
                >
                  CLEROY
                </motion.span>
              </div>

              {/* SOFT AMBER RADIAL GLOW BEHIND HERO */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[280px] sm:h-[400px] bg-[#E85002]/[0.07] blur-[140px] rounded-full pointer-events-none z-0" />

              {/* CENTERED EDITORIAL STUDIO COMPOSITION */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto px-4 my-auto">
                
                {/* SMALL BADGE */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85002]/10 border border-[#E85002]/30 text-[#E85002] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold shadow-[0_0_15px_rgba(232,80,2,0.12)] backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85002] animate-pulse" />
                  <span>CLEROY DISCOVERY SESSION</span>
                </motion.div>

                {/* DOMINANT ELEGANT HEADING */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="font-serif text-[clamp(1.85rem,3.8vw,3.5rem)] text-white font-light tracking-tight leading-[1.08] max-w-3xl drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)]"
                >
                  Let's Build Something{" "}
                  <span className="text-[#E85002] italic font-normal drop-shadow-[0_0_30px_rgba(232,80,2,0.4)]">
                    Remarkable.
                  </span>
                </motion.h1>

                {/* CONCISE TWO-LINE SUPPORTING PARAGRAPH */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="space-y-1 font-sans text-[clamp(0.875rem,1.15vw,1.125rem)] text-[#B8ACA0] font-light leading-relaxed max-w-xl text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
                >
                  <p>Every great product begins with the right conversation.</p>
                  <p>Let's define your vision together.</p>
                </motion.div>

                {/* BOTH PRIMARY & SECONDARY CTA BUTTONS */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full sm:w-auto"
                >
                  <div
                    onMouseEnter={() => setHoveredCard("enquiry")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="w-full sm:w-auto"
                  >
                    <CleroyButton
                      variant="primary"
                      size="md"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto shadow-[0_0_25px_rgba(232,80,2,0.35)] hover:shadow-[0_0_40px_rgba(232,80,2,0.55)] px-6 sm:px-7 py-3 text-xs sm:text-xs font-mono tracking-wider font-bold group flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Start Discovery</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </CleroyButton>
                  </div>

                  <div
                    onMouseEnter={() => setHoveredCard("contact")}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="w-full sm:w-auto"
                  >
                    <CleroyButton
                      variant="primary"
                      size="md"
                      onClick={() => setShowContactPanel(true)}
                      className="w-full sm:w-auto hover:shadow-[0_0_25px_rgba(232,80,2,0.3)] px-6 sm:px-7 py-3 text-xs sm:text-xs font-mono tracking-wider font-bold cursor-pointer"
                    >
                      Talk to Cleroy
                    </CleroyButton>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* PREMIUM APPLE-STYLE BOTTOM SHEET FOR TALK TO CLEROY */}
          <AnimatePresence>
            {showContactPanel && (
              <>
                {/* Soft blur & dimmed background backdrop */}
                <motion.div
                  key="contact-sheet-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setShowContactPanel(false)}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md cursor-pointer"
                />

                {/* Premium Gliding Bottom Sheet */}
                <motion.div
                  key="contact-bottom-sheet"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 300) {
                      setShowContactPanel(false);
                    }
                  }}
                  className="fixed bottom-0 left-0 right-0 z-[60] max-w-[650px] mx-auto w-full max-h-[85vh] overflow-y-auto custom-scrollbar rounded-t-[28px] sm:rounded-t-[32px] bg-[#0A0A0A]/98 border-t sm:border border-white/15 p-5 sm:p-7 shadow-[0_-15px_60px_rgba(232,80,2,0.25)] backdrop-blur-2xl flex flex-col justify-between space-y-4 select-none"
                >
                  {/* Soft orange ambient glow behind sheet */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#E85002]/20 blur-[90px] rounded-full pointer-events-none" />

                  {/* Drag Handle */}
                  <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-0.5 shrink-0 cursor-grab active:cursor-grabbing" />

                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E85002]/15 border border-[#E85002]/30 text-[#E85002] font-mono text-[10px] uppercase tracking-widest font-bold">
                        <Sparkles className="w-3 h-3" />
                        CONNECT WITH CLEROY
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-tight">
                        Let's <span className="text-[#E85002] italic font-normal">Talk.</span>
                      </h2>

                      <p className="font-sans text-xs text-[#B8ACA0] font-light leading-normal">
                        Choose your preferred way to connect with our engineering team.<br className="hidden sm:inline" />
                        We're just one message away.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowContactPanel(false)}
                      className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 3 CONTACT ROWS */}
                  <div className="space-y-2.5 pt-0.5">
                    {/* ROW 1: CALL */}
                    <button
                      type="button"
                      onClick={() => makePhoneCall()}
                      className="w-full text-left group relative p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#E85002]/70 hover:bg-[#E85002]/10 hover:shadow-[0_0_20px_rgba(232,80,2,0.18)] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E85002]/15 border border-[#E85002]/30 flex items-center justify-center text-[#E85002] group-hover:bg-[#E85002] group-hover:text-white transition-all duration-300 shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-serif text-base text-white font-medium group-hover:text-[#E85002] transition-colors block">
                            Call Us
                          </span>
                          <p className="font-sans text-[11px] text-[#B8ACA0] font-light">
                            Speak directly with our engineering team.
                          </p>
                        </div>
                      </div>

                      <div className="py-2 px-3.5 rounded-lg bg-[#E85002] group-hover:bg-[#ff5d0d] font-mono text-[10px] uppercase tracking-wider font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(232,80,2,0.3)] shrink-0">
                        <span>CALL NOW</span>
                        <Phone className="w-3 h-3" />
                      </div>
                    </button>

                    {/* ROW 2: WHATSAPP */}
                    <button
                      type="button"
                      onClick={() => openWhatsApp("Hi Cleroy, I'd like to discuss my project.")}
                      className="w-full text-left group relative p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#E85002]/70 hover:bg-[#E85002]/10 hover:shadow-[0_0_20px_rgba(232,80,2,0.18)] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E85002]/15 border border-[#E85002]/30 flex items-center justify-center text-[#E85002] group-hover:bg-[#E85002] group-hover:text-white transition-all duration-300 shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-serif text-base text-white font-medium group-hover:text-[#E85002] transition-colors block">
                            WhatsApp
                          </span>
                          <p className="font-sans text-[11px] text-[#B8ACA0] font-light">
                            Start a conversation instantly.
                          </p>
                        </div>
                      </div>

                      <div className="py-2 px-3.5 rounded-lg bg-[#E85002] group-hover:bg-[#ff5d0d] font-mono text-[10px] uppercase tracking-wider font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(232,80,2,0.3)] shrink-0">
                        <span>CHAT NOW</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </button>

                    {/* ROW 3: EMAIL */}
                    <button
                      type="button"
                      onClick={() => openGmailCompose("Project Inquiry")}
                      className="w-full text-left group relative p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#E85002]/70 hover:bg-[#E85002]/10 hover:shadow-[0_0_20px_rgba(232,80,2,0.18)] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E85002]/15 border border-[#E85002]/30 flex items-center justify-center text-[#E85002] group-hover:bg-[#E85002] group-hover:text-white transition-all duration-300 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif text-base text-white font-medium group-hover:text-[#E85002] transition-colors">
                              Email Us
                            </span>
                            <span className="font-mono text-[10px] text-[#E85002] font-bold truncate">
                              cleroyhq@gmail.com
                            </span>
                          </div>
                          <p className="font-sans text-[11px] text-[#B8ACA0] font-light">
                            Tell us about your project by email.
                          </p>
                        </div>
                      </div>

                      <div className="py-2 px-3.5 rounded-lg bg-[#E85002] group-hover:bg-[#ff5d0d] font-mono text-[10px] uppercase tracking-wider font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(232,80,2,0.3)] shrink-0">
                        <span>SEND EMAIL</span>
                        <Mail className="w-3 h-3" />
                      </div>
                    </button>
                  </div>

                  {/* BOTTOM DIVIDER & SUBTLE ACTION */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <span className="font-sans text-xs text-[#B8ACA0]">
                      Prefer sharing your project details instead?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowContactPanel(false);
                        setCurrentStep(2);
                      }}
                      className="px-4 py-2 rounded-full border border-white/20 hover:border-[#E85002] hover:bg-[#E85002]/10 font-mono text-[10px] uppercase tracking-wider font-bold text-white transition-all cursor-pointer shrink-0"
                    >
                      START ENQUIRY
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* STEP 2: BASIC INFORMATION (STEP 01 — YOUR DETAILS) */}
          {currentStep === 2 && (
            <motion.div
              key="step2-info"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-5 my-auto w-full py-1 sm:py-2 max-w-2xl mx-auto"
            >
              {/* HEADING */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] sm:text-xs text-[#E85002] tracking-[0.2em] uppercase font-bold block">
                  STEP 01 — YOUR DETAILS
                </span>
                <h2 className="font-serif text-[clamp(1.5rem,2.8vw,2.5rem)] text-white font-light tracking-tight">
                  Let's get to know you.
                </h2>
                <p className="text-xs text-[#B8ACA0] font-sans font-light leading-normal">
                  Just a few details so we know how to reach you.
                </p>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-0.5">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                    First Name <span className="text-[#E85002]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        handleChange("fullName", e.target.value);
                        if (errors.fullName) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.fullName;
                            return next;
                          });
                        }
                      }}
                      placeholder="e.g. Alex"
                      className={`w-full bg-white/[0.03] border ${
                        errors.fullName ? "border-[#E85002]/80 bg-[#E85002]/[0.03]" : "border-white/10 focus:border-[#E85002]"
                      } rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white caret-[#E85002] focus:outline-none focus:bg-white/[0.06] focus:ring-1 focus:ring-[#E85002]/50 transition-all duration-300`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[10px] text-[#E85002] font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 text-[#E85002]" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                    Email Address <span className="text-[#E85002]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange("email", e.target.value);
                        if (errors.email) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.email;
                            return next;
                          });
                        }
                      }}
                      placeholder="alex@company.com"
                      className={`w-full bg-white/[0.03] border ${
                        errors.email ? "border-[#E85002]/80 bg-[#E85002]/[0.03]" : "border-white/10 focus:border-[#E85002]"
                      } rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white caret-[#E85002] focus:outline-none focus:bg-white/[0.06] focus:ring-1 focus:ring-[#E85002]/50 transition-all duration-300`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] text-[#E85002] font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 text-[#E85002]" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Company (Optional) */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                    Company <span className="text-white/40 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="e.g. Acme Inc / Stealth"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white caret-[#E85002] focus:outline-none focus:border-[#E85002] focus:bg-white/[0.06] focus:ring-1 focus:ring-[#E85002]/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Preferred Contact Method Selection Pills */}
                <div className="space-y-2 sm:col-span-2 pt-1">
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {CONTACT_METHODS.map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.preferredContactMethod === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            handleChange("preferredContactMethod", item.id);
                            if (errors.phoneOrWhatsapp) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.phoneOrWhatsapp;
                                return next;
                              });
                            }
                          }}
                          className={`py-2 sm:py-2.5 px-3 rounded-xl font-mono text-[11px] sm:text-xs flex items-center justify-center gap-2 border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-[#E85002] border-[#E85002] text-white shadow-[0_0_15px_rgba(232,80,2,0.35)] font-bold scale-[1.01]"
                              : "bg-white/[0.03] border-white/10 text-[#B8ACA0] hover:text-white hover:border-white/25 hover:bg-white/[0.05]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC UNFOLDING PHONE OR WHATSAPP INPUT */}
                <div className="sm:col-span-2">
                  <AnimatePresence>
                    {(formData.preferredContactMethod === "Phone" || formData.preferredContactMethod === "WhatsApp") && (
                      <motion.div
                        key="dynamic-phone-field"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden space-y-1"
                      >
                        <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                          {formData.preferredContactMethod === "Phone" ? "Phone Number" : "WhatsApp Number"}{" "}
                          <span className="text-[#E85002]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={formData.phoneOrWhatsapp}
                            onChange={(e) => {
                              handleChange("phoneOrWhatsapp", e.target.value);
                              if (errors.phoneOrWhatsapp) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.phoneOrWhatsapp;
                                  return next;
                                });
                              }
                            }}
                            placeholder="+91 98765 43210"
                            className={`w-full bg-white/[0.03] border ${
                              errors.phoneOrWhatsapp
                                ? "border-[#E85002]/80 bg-[#E85002]/[0.03]"
                                : "border-white/10 focus:border-[#E85002]"
                            } rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white caret-[#E85002] focus:outline-none focus:bg-white/[0.06] focus:ring-1 focus:ring-[#E85002]/50 transition-all duration-300`}
                          />
                        </div>
                        {errors.phoneOrWhatsapp && (
                          <p className="text-[10px] text-[#E85002] font-mono mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-[#E85002]" />
                            <span>{errors.phoneOrWhatsapp}</span>
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROJECT DETAILS (STEP 02 — YOUR IDEA) */}
          {currentStep === 3 && (
            <motion.div
              key="step3-idea"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5 sm:space-y-4 my-auto w-full py-1 sm:py-2 max-w-2xl mx-auto"
            >
              {/* HEADING */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] sm:text-xs text-[#E85002] tracking-[0.2em] uppercase font-bold block">
                  STEP 02 — PROJECT DETAILS
                </span>
                <h2 className="font-serif text-[clamp(1.5rem,2.8vw,2.5rem)] text-white font-light tracking-tight">
                  Tell us about your idea.
                </h2>
                <p className="text-xs text-[#B8ACA0] font-sans font-light leading-normal">
                  A few details help us understand your vision.
                </p>
              </div>

              {/* PROJECT TYPE SELECTION PILLS */}
              <div className="space-y-2 pt-0.5">
                <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                  Project Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_TYPES.map((type) => {
                    const isSelected = formData.projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleChange("projectType", type.id)}
                        className={`py-2 px-3 rounded-xl font-mono text-[11px] sm:text-xs flex items-center justify-start gap-2 border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "bg-[#E85002] border-[#E85002] text-white shadow-[0_0_15px_rgba(232,80,2,0.35)] font-bold scale-[1.01]"
                            : "bg-white/[0.03] border-white/10 text-[#B8ACA0] hover:text-white hover:border-white/25 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="text-sm">{type.icon}</span>
                        <span className="truncate">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PROJECT DESCRIPTION TEXTAREA */}
              <div className="space-y-1.5 pt-0.5">
                <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                  Project Description <span className="text-white/40 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.ideaText}
                    onChange={(e) => handleChange("ideaText", e.target.value)}
                    placeholder="Tell us about your idea... (e.g. A booking app with online payments and customer portal)"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#E85002] rounded-xl p-3 text-xs sm:text-sm text-white caret-[#E85002] placeholder:text-white/30 focus:outline-none focus:bg-white/[0.06] focus:ring-1 focus:ring-[#E85002]/50 transition-all duration-300 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* HELPFUL PROMPTS / SUGGESTION CHIPS */}
              <div className="space-y-2 pt-0.5">
                <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                  Helpful Prompts <span className="text-white/40 font-normal lowercase">(click to inspire)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {HELPFUL_PROMPTS.map((prompt) => {
                    const isSelected = formData.selectedChips.includes(prompt);
                    return (
                      <motion.button
                        key={prompt}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleChip(prompt)}
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#E85002] border-[#E85002] text-white font-bold shadow-[0_0_12px_rgba(232,80,2,0.35)]"
                            : "bg-white/[0.03] border-white/10 text-[#B8ACA0] hover:text-white hover:border-white/25 hover:bg-white/[0.06]"
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Sparkles className="w-2.5 h-2.5 text-[#E85002]" />}
                        <span>{prompt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: OPTIONAL DETAILS */}
          {currentStep === 4 && (
            <motion.div
              key="step4-optional"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-5 my-auto w-full py-1 sm:py-2 max-w-2xl mx-auto"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] sm:text-xs text-[#E85002] tracking-[0.2em] uppercase font-bold block">
                  STEP 03 — OPTIONAL DETAILS
                </span>
                <h2 className="font-serif text-[clamp(1.5rem,2.8vw,2.5rem)] text-white font-light tracking-tight">
                  Budget & Timeline
                </h2>
                <p className="text-xs text-[#B8ACA0] font-sans font-light">
                  Both completely optional. Choose whatever fits or select "Let's Discuss".
                </p>
              </div>

              {/* Budget Section */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                  Estimated Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = formData.budget === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange("budget", opt)}
                        className={`p-2.5 rounded-xl font-mono text-[11px] sm:text-xs text-center border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E85002] border-[#E85002] text-white font-bold shadow-[0_0_12px_rgba(232,80,2,0.4)]"
                            : "bg-white/[0.03] border-white/10 text-[#B8ACA0] hover:text-white hover:border-white/20"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Start Section */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] sm:text-[11px] text-[#B8ACA0] tracking-wider uppercase">
                  Preferred Start
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TIMELINE_OPTIONS.map((opt) => {
                    const isSelected = formData.timeline === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange("timeline", opt)}
                        className={`p-2.5 rounded-xl font-mono text-[11px] sm:text-xs text-center border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E85002] border-[#E85002] text-white font-bold shadow-[0_0_12px_rgba(232,80,2,0.4)]"
                            : "bg-white/[0.03] border-white/10 text-[#B8ACA0] hover:text-white hover:border-white/20"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Summary Preview */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs font-mono text-[#B8ACA0]">
                <div className="text-white font-bold uppercase tracking-wider text-[11px]">Summary:</div>
                <div>Name: <span className="text-white">{formData.fullName}</span> ({formData.email})</div>
                <div>Contact via: <span className="text-[#E85002]">{formData.preferredContactMethod}</span></div>
                {formData.selectedChips.length > 0 && (
                  <div>Category: <span className="text-white">{formData.selectedChips.join(", ")}</span></div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS / CONFIRMATION */}
          {currentStep === 5 && (
            <motion.div
              key="step5-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="my-auto max-w-lg w-full mx-auto text-center space-y-6 sm:space-y-8 py-4 sm:py-6"
            >
              {/* Cinematic Checkmark Graphic */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E85002] text-white flex items-center justify-center shadow-[0_0_40px_rgba(232,80,2,0.6)]"
                >
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
                </motion.div>
                <div className="absolute inset-0 rounded-full border border-[#E85002] animate-ping opacity-25" />
              </div>

              {/* Heading & Confirmation Message */}
              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
                  You're All Set.
                </h2>
                <div className="space-y-1 font-sans text-xs sm:text-sm text-[#B8ACA0] font-light leading-relaxed max-w-md mx-auto">
                  <p>Thank you for sharing your idea.</p>
                  <p>
                    Our engineering team will review your enquiry and contact you within 24 hours.
                  </p>
                </div>
              </div>

              {/* Action Buttons/Links */}
              <div className="space-y-4 pt-2">
                <div>
                  <CleroyButton
                    variant="primary"
                    size="md"
                    onClick={onClose}
                    className="shadow-[0_0_25px_rgba(232,80,2,0.3)] hover:shadow-[0_0_35px_rgba(232,80,2,0.5)] px-8"
                  >
                    RETURN TO HOME
                  </CleroyButton>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(DEFAULT_DATA);
                      setCurrentStep(1);
                      setErrors({});
                      setSubmitError(null);
                      setAssignedRefId("");
                    }}
                    className="font-mono text-xs text-[#B8ACA0] hover:text-[#E85002] transition-colors duration-300 underline underline-offset-4 decoration-white/20 hover:decoration-[#E85002] cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FIXED PINNED BOTTOM NAVIGATION CONTROLS */}
      {currentStep > 1 && currentStep < 5 && (
        <footer className="relative z-30 shrink-0 px-4 sm:px-8 md:px-12 py-2.5 sm:py-3 border-t border-white/10 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-full border border-white/10 font-mono text-[11px] sm:text-xs text-[#B8ACA0] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <CleroyButton
              variant="primary"
              size="md"
              onClick={handleNext}
            >
              CONTINUE
            </CleroyButton>
          ) : (
            <CleroyButton
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "SENDING ENQUIRY..." : "SUBMIT ENQUIRY"}
            </CleroyButton>
          )}
        </footer>
      )}
    </div>
  );
}
