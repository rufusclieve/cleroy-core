/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import GlobalBackground from "./components/GlobalBackground";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import About from "./components/About";
import ProjectDiscoveryWorkspace from "./components/ProjectDiscoveryWorkspace";
import ProjectGalleryWorkspace from "./components/ProjectGalleryWorkspace";

export type TransitionPhase = "loading" | "completed" | "transitioning" | "done";

const isMobileDevice = () =>
  window.matchMedia("(max-width: 768px)").matches;

// Helper to retrieve saved navigation state when returning via browser Back button
function getSavedNavigationState() {
  try {
    const raw = sessionStorage.getItem("cleroy_saved_navigation_state");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isReturning) return parsed;
    }
    const historyState = window.history?.state?.cleroyState;
    if (historyState && historyState.isReturning) return historyState;
  } catch (e) {
    console.error("Error reading saved navigation state:", e);
  }
  return null;
}

export default function App() {
  const initialSavedState = getSavedNavigationState();

  const [phase, setPhase] = useState<TransitionPhase>(() => {
  // Skip preloader on mobile devices
  if (isMobileDevice()) {
    return "done";
  }

  const hasBooted =
    sessionStorage.getItem("cleroy_boot_completed") === "true";

  return initialSavedState || hasBooted ? "done" : "loading";
});
  const [isScrolled, setIsScrolled] = useState(() => {
    return initialSavedState ? true : false;
  });
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Clear session boot flag on page refresh or tab close so new tab/refresh starts from 0% boot sequence
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("cleroy_boot_completed");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useEffect(() => {
    const handleOpenDiscovery = () => setIsDiscoveryOpen(true);
    const handleOpenGallery = () => setIsGalleryOpen(true);

    window.addEventListener("open-cleroy-discovery", handleOpenDiscovery);
    window.addEventListener("open-cleroy-gallery", handleOpenGallery);

    return () => {
      window.removeEventListener("open-cleroy-discovery", handleOpenDiscovery);
      window.removeEventListener("open-cleroy-gallery", handleOpenGallery);
    };
  }, []);

  // Restore scroll position and UI state when returning from launched project
  useEffect(() => {
    if (initialSavedState) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      const targetY = typeof initialSavedState.savedScrollY === "number" ? initialSavedState.savedScrollY : 0;

      const performScroll = () => {
        if (targetY > 0) {
          window.scrollTo({ top: targetY, behavior: "instant" });
        } else {
          const featuredEl = document.getElementById("featured-work");
          if (featuredEl) {
            featuredEl.scrollIntoView({ behavior: "instant" });
          }
        }
      };

      // Perform instant scroll across layout frames to ensure DOM components have painted
      performScroll();
      const rAF1 = requestAnimationFrame(() => {
        performScroll();
        const rAF2 = requestAnimationFrame(() => {
          performScroll();
        });
        return () => cancelAnimationFrame(rAF2);
      });

      // Clear the saved state after successful restoration
      const cleanupTimer = setTimeout(() => {
        sessionStorage.removeItem("cleroy_saved_navigation_state");
      }, 1500);

      return () => {
        cancelAnimationFrame(rAF1);
        clearTimeout(cleanupTimer);
      };
    }
  }, []);

  // Back/Forward cache and popstate event handler
  useEffect(() => {
    const handlePageRestoration = (event: Event) => {
      const navState = getSavedNavigationState();
      if (navState && navState.isReturning) {
        setPhase("done");
        setIsScrolled(true);
        const targetY = typeof navState.savedScrollY === "number" ? navState.savedScrollY : 0;
        if (targetY > 0) {
          window.scrollTo({ top: targetY, behavior: "instant" });
        } else {
          const featuredEl = document.getElementById("featured-work");
          if (featuredEl) {
            featuredEl.scrollIntoView({ behavior: "instant" });
          }
        }
      }
    };

    window.addEventListener("pageshow", handlePageRestoration);
    window.addEventListener("popstate", handlePageRestoration);

    return () => {
      window.removeEventListener("pageshow", handlePageRestoration);
      window.removeEventListener("popstate", handlePageRestoration);
    };
  }, []);

  // Handle phase progression from completed -> transitioning -> done
  useEffect(() => {
    if (phase === "loading") return;

    let timer: NodeJS.Timeout;

    if (phase === "completed" && isScrolled) {
      setPhase("transitioning");
    } else if (phase === "transitioning") {
      timer = setTimeout(() => {
        setPhase("done");
      }, 850); // Exact 850ms logo flight duration
    }

    return () => clearTimeout(timer);
  }, [isScrolled, phase]);

  const handleHeroReverseComplete = () => {
    if (!isScrolled && phase === "done") {
      setPhase("transitioning");
    }
  };

  // Gesture and Native Scroll Listeners
  useEffect(() => {
    if (phase === "loading") return;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 25) {
        setIsScrolled((prev) => (prev ? prev : true));
      } else if (y <= 5) {
        setIsScrolled((prev) => (prev ? false : prev));
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 10) {
        setIsScrolled((prev) => (prev ? prev : true));
      } else if (e.deltaY < -10 && window.scrollY <= 5) {
        setIsScrolled((prev) => (prev ? false : prev));
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY; // positive = scroll down
      if (diffY > 15) {
        setIsScrolled((prev) => (prev ? prev : true));
      } else if (diffY < -15 && window.scrollY <= 5) {
        setIsScrolled((prev) => (prev ? false : prev));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        setIsScrolled((prev) => (prev ? prev : true));
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && window.scrollY <= 5) {
        setIsScrolled((prev) => (prev ? false : prev));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase]);

  return (
    <div 
      className="relative min-h-screen bg-[#020202] text-[#F5EFE7] font-sans overflow-x-clip selection:bg-[#D45A12]/30 selection:text-[#FFD8A0]"
      id="cleroy-app-root"
    >
      {/* 
        1. THE ATMOSPHERIC FIRE GLOWS
        Always mounted at the bottom of the stack to support seamless rendering.
      */}
      <GlobalBackground />

      {/* 
        2. PRELOADER ENGINE
        Maintains centered Cleroy logo, percentage tracker, and status.
      */}
      <Preloader phase={phase} onPhaseChange={(p) => setPhase(p)} isScrolled={isScrolled} />

      {/* 
        3. EXCLUSIVE DIGITAL INTERFACE
        Mounted directly to ensure correct coordinate mapping for the shared-element logo flight.
        We maintain a stable layout hierarchy so the Hero section is centered and fixed from frame 0.
      */}
      <div 
        id="experience-canvas"
        className={`relative w-full flex flex-col transition-all duration-700 ease-out ${
          isDiscoveryOpen || isGalleryOpen ? "scale-[0.96] blur-md opacity-30 pointer-events-none origin-center" : ""
        }`}
      >
        {/* Floating Navigation Pill (z-50) */}
        <Navigation phase={phase} isScrolled={isScrolled} />

        {/* Main Page: Hero Layout Column Configuration */}
        <main className="w-full relative">
          <Hero 
            phase={phase} 
            isScrolled={isScrolled} 
            onReverseComplete={handleHeroReverseComplete} 
          />
        </main>

        <About />
      </div>

      {/* Fullscreen Project Discovery Workspace */}
      <ProjectDiscoveryWorkspace 
        isOpen={isDiscoveryOpen} 
        onClose={() => setIsDiscoveryOpen(false)} 
      />

      {/* Fullscreen Project Gallery Workspace */}
      <ProjectGalleryWorkspace
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
