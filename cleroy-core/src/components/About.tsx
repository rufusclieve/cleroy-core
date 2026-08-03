import React, { useEffect } from "react";
import AboutManifesto from "./AboutManifesto";
import StorySection from "./StorySection";
import CleroyMindset from "./CleroyMindset";
import StorySection2 from "./StorySection2";
import CinematicTransition from "./CinematicTransition";
import FeaturedExhibition from "./FeaturedExhibition";
import LetsBuildSection from "./LetsBuildSection";
import EditorialContactSection from "./EditorialContactSection";

export default function About() {
  // Dynamically import Cormorant Garamond for luxurious serif rendering
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      const existing = document.querySelector(`link[href="${link.href}"]`);
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, []);

  return (
    <div id="about-section-container" className="w-full bg-[#020202] text-[#F5EFE7] relative select-none">
      
      {/* 
        ======================================================
        ABOUT SECTION:
        • About Cleroy
        • Company Philosophy
        • Vision
        • Mission
        • Think → Engineer → Deliver
        ======================================================
      */}
      <div id="about" className="scroll-mt-24">
        <AboutManifesto />
        <CleroyMindset />
      </div>

      {/* 
        ======================================================
        EXPERTISE SECTION:
        • Who We Empower (Audience Cleroy builds for)
        ======================================================
      */}
      <div id="expertise" className="scroll-mt-24">
        <StorySection />
      </div>

      {/* 
        ======================================================
        SERVICES SECTION:
        • What We Create (Engineering capabilities and solutions)
        ======================================================
      */}
      <div id="services" className="scroll-mt-24">
        <StorySection2 />
      </div>

      {/* 
        ======================================================
        PROJECTS SECTION:
        • Digital Exhibit
        • What If
        • Let's Build
        ======================================================
      */}
      <div id="projects" className="scroll-mt-24">
        <FeaturedExhibition />
        <CinematicTransition />
        <LetsBuildSection />
      </div>

      {/* 
        ======================================================
        FULL-SCREEN EDITORIAL CONTACT & FOOTER SECTION
        ======================================================
      */}
      <div id="contact" className="scroll-mt-24">
        <EditorialContactSection />
      </div>

    </div>
  );
}
