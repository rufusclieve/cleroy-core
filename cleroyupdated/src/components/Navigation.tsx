import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useVelocity, useTransform, AnimatePresence } from "motion/react";
import { Menu, X, Mail, MapPin, Phone } from "lucide-react";
import CleroyLogo from "./CleroyLogo";
import CleroyButton from "./CleroyButton";
import { openGmailCompose, makePhoneCall } from "../utils/contact";

interface NavigationProps {
  phase: "loading" | "completed" | "transitioning" | "done";
  isScrolled?: boolean;
}

export default function Navigation({ phase, isScrolled = false }: NavigationProps) {
  const [activeItem, setActiveItem] = useState("ABOUT");
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isScrolledState, setIsScrolledState] = useState(false);
  const scrolled = isScrolled || isScrolledState;

  const navItems = [
    { name: "ABOUT", href: "#about" },
    { name: "EXPERTISE", href: "#expertise" },
    { name: "SERVICES", href: "#services" },
    { name: "PROJECTS", href: "#projects" },
    { name: "CONTACT", href: "#contact" },
  ];

  const isVisible = phase !== "loading";

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // 1. Scroll-spy to automatically highlight active section seamlessly
  useEffect(() => {
    if (phase !== "done") return;

    const sections = [
      { id: "about", name: "ABOUT" },
      { id: "expertise", name: "EXPERTISE" },
      { id: "services", name: "SERVICES" },
      { id: "projects", name: "PROJECTS" },
      { id: "contact", name: "CONTACT" },
    ];

    let ticking = false;

    const handleScrollSpy = () => {
      // Check if user is near bottom of the page
      const scrollPosition = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      if (totalHeight > 0 && totalHeight - scrollPosition < 120) {
        setActiveItem("CONTACT");
        return;
      }

      // Determine active section based on distance to viewport focal area
      const triggerPoint = window.innerHeight * 0.35;
      let currentSection = "ABOUT";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            currentSection = section.name;
          }
        }
      }

      setActiveItem(currentSection);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollSpy();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScrollSpy();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [phase]);

  const lastScrollYRef = useRef(0);

  // 2. Smart Navigation Scroll Behavior (Show/Hide)
  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      // Always show if we are near the top of the page
      const isAtTop = currentScrollY <= 80;

      setIsScrolledState(currentScrollY > 20);

      if (isAtTop) {
        setIsNavHidden(false);
      } else {
        const diff = currentScrollY - lastScrollYRef.current;
        // Apply noise threshold (6px) to ignore small jitter
        if (Math.abs(diff) > 6) {
          if (diff > 0) {
            // Scrolling down
            setIsNavHidden(true);
          } else {
            // Scrolling up
            setIsNavHidden(false);
          }
        }
      }

      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 3. Smooth Anchor Scroll Click Handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string; href: string }) => {
    e.preventDefault();
    setActiveItem(item.name);
    setIsMobileMenuOpen(false);

    const id = item.href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 4. Parallax Motion Physics (Subtle tracking based on mouse coordinate)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 45, stiffness: 100, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 5. Scroll Inertia: Map scroll velocity to subtle y stabilizer offset
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const rawScrollOffset = useTransform(scrollVelocity, [-3000, 3000], [4, -4]);
  const smoothScrollOffset = useSpring(rawScrollOffset, { damping: 30, stiffness: 90 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      // Tight parallax constraints (max 4px horizontal, 2px vertical)
      mouseX.set(nx * 4);
      mouseY.set(ny * 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.header
        id="global-navigation-header"
        style={{
          y: smoothScrollOffset,
        }}
        className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none"
      >
        <motion.div
          animate={{
            y: isNavHidden ? "-100%" : "0%",
            opacity: isNavHidden ? 0 : 1,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1], // Apple premium expo-out
          }}
          className="w-full flex justify-center pointer-events-none"
        >
          {/* Main Full-Width Transparent Header (Fades in blur & glass background when scrolled) */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: isVisible ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full pointer-events-auto transition-all duration-300 ease-out ${
              scrolled
                ? "bg-[#0B0B0B]/95 md:bg-[#0B0B0B]/70 md:backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
                : "bg-transparent py-7 sm:py-9"
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-between w-full">
              {/* Left Side: Cleroy Logo with dynamic entry */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveItem("ABOUT");
                }}
                className="flex-shrink-0 transition-opacity hover:opacity-95 min-h-[36px] flex items-center gap-4 select-none"
              >
                {phase === "loading" || phase === "completed" ? (
                  /* Stable layout placeholder during preloader phase */
                  <div className="w-8 h-8" />
                ) : (
                  <div className="flex items-center gap-3" id="nav-brand-wrapper">
                    <motion.div
                      layoutId="shared-logo-icon"
                      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                      className="w-8 h-8 relative flex items-center justify-center flex-shrink-0"
                      style={{ willChange: "transform" }}
                    >
                      <CleroyLogo size="full" withGlow={false} hideText={true} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      className="flex flex-col items-start leading-none justify-center"
                    >
                      <span className="font-serif text-[13px] tracking-[0.25em] font-light text-[#F5EFE7] uppercase">
                        CLEROY
                      </span>
                      <span className="font-sans text-[7.5px] tracking-[0.35em] text-[#B8ACA0] font-bold mt-[3px]">
                        ENGINEERING
                      </span>
                    </motion.div>
                  </div>
                )}
              </a>

              {/* Center: Desktop/Tablet Navigation Links */}
              <nav className="hidden md:flex items-center gap-3 lg:gap-8 xl:gap-10" id="nav-links-container">
                {navItems.map((item, idx) => {
                  const isActive = activeItem === item.name;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: phase === "loading" || phase === "completed" ? 0 : 1,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                        delay: phase === "done" ? 0 : 0.15 + idx * 0.04,
                      }}
                      className={`relative px-1 py-1.5 text-[12px] lg:text-[14px] font-medium tracking-wider transition-colors duration-300 ease-out cursor-pointer group flex flex-col items-center select-none ${
                        isActive ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[1px]">
                        {item.name}
                      </span>

                      {/* Active item sliding indicator */}
                      {isActive ? (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 h-[1.5px] w-4 rounded-full bg-[#FF7A00]"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      ) : (
                        /* Hover underline expanding from center */
                        <span className="absolute bottom-0 h-[1.5px] w-0 bg-[#FF7A00]/80 rounded-full transition-all duration-300 ease-out group-hover:w-3 origin-center" />
                      )}
                    </motion.a>
                  );
                })}
              </nav>

              {/* Right Side: Primary CTA / Mobile Hamburger */}
              <div className="flex items-center gap-3" id="nav-actions-container">
                {/* Build Solutions CTA Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: phase === "loading" || phase === "completed" ? 0 : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: phase === "done" ? 0 : 0.35,
                  }}
                  className="hidden md:block"
                >
                  <CleroyButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-cleroy-discovery"));
                    }}
                  >
                    Build Solutions
                  </CleroyButton>
                </motion.div>

                {/* Hamburger Button (Mobile only) */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="relative z-50 p-2 text-white/80 hover:text-white focus:outline-none focus:ring-0 select-none cursor-pointer flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                    aria-label="Toggle Menu"
                  >
                    <motion.span
                      animate={isMobileMenuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="w-5.5 h-[1.5px] bg-white rounded-full block"
                    />
                    <motion.span
                      animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-5.5 h-[1.5px] bg-white rounded-full block"
                    />
                    <motion.span
                      animate={isMobileMenuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="w-5.5 h-[1.5px] bg-white rounded-full block"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Mobile Slide-In Full-Screen Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-8 pt-28 pointer-events-auto"
            id="mobile-nav-menu"
          >
            {/* Background glowing particles for Cleroy aesthetic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#D45A12]/5 blur-3xl rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D45A12]/4 blur-3xl rounded-full" />
            </div>

            {/* Top Logo Section */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <CleroyLogo size="full" withGlow={false} hideText={true} />
              </div>
              <div className="flex flex-col items-start leading-none justify-center">
                <span className="font-serif text-[13px] tracking-[0.25em] font-light text-white uppercase">
                  CLEROY
                </span>
                <span className="font-sans text-[7.5px] tracking-[0.35em] text-white/50 font-bold mt-[2px]">
                  ENGINEERING
                </span>
              </div>
            </div>

            {/* Vertical stack of links */}
            <div className="flex flex-col gap-6 mt-12 pl-4">
              {navItems.map((item, idx) => {
                const isActive = activeItem === item.name;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className="inline-flex items-center gap-4 py-2 text-3xl font-serif font-light tracking-wide text-white/80 hover:text-white transition-colors duration-200 select-none"
                    >
                      {isActive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
                      )}
                      <span className={isActive ? "text-white font-normal" : ""}>
                        {item.name}
                      </span>
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Actions and Context */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 pl-4 pb-8"
            >
              {/* Build Solutions Touch CTA Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("open-cleroy-discovery"));
                }}
                className="w-full sm:w-auto inline-flex relative overflow-hidden rounded-full py-4 px-8 text-sm font-medium tracking-wider uppercase select-none border border-[#FF7A00]/40 bg-[#FF7A00]/5 text-white items-center justify-center gap-3 group hover:bg-[#FF7A00]/15 cursor-pointer"
              >
                Build Solutions
                <span className="text-[#FF7A00] font-bold text-lg">→</span>
              </button>

              {/* Minimal contact details */}
              <div className="space-y-2.5 border-t border-white/5 pt-6 max-w-sm">
                <button 
                  type="button"
                  onClick={() => openGmailCompose()}
                  className="flex items-center gap-2 text-white/60 hover:text-[#FF7A00] text-xs font-mono transition-colors cursor-pointer text-left"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>cleroyhq@gmail.com</span>
                </button>
                <button 
                  type="button"
                  onClick={() => makePhoneCall()}
                  className="flex items-center gap-2 text-white/60 hover:text-[#FF7A00] text-xs font-mono transition-colors cursor-pointer text-left"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Call Us</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
