import React from "react";
import { motion } from "motion/react";

/**
 * KingPartsProps for the luxury chess piece parts
 */
interface KingPartsProps {
  isWhite: boolean;
  prefix: string;
}

/**
 * Standard Chess King Geometry
 * Utilizes reflective base gradients and luxury specular highlights
 */
function KingParts({ isWhite, prefix }: KingPartsProps) {
  const leftFill = isWhite ? `url(#${prefix}-whiteLeft)` : `url(#${prefix}-blackLeft)`;
  const centerFill = isWhite ? `url(#${prefix}-whiteCenter)` : `url(#${prefix}-blackCenter)`;
  const rightFill = isWhite ? `url(#${prefix}-whiteRight)` : `url(#${prefix}-blackRight)`;
  const baseFill = isWhite ? `url(#${prefix}-whiteBase)` : `url(#${prefix}-blackBase)`;

  const silverStroke = isWhite ? `url(#${prefix}-whiteSilverSpecular)` : `url(#${prefix}-blackSilverSpecular)`;
  const orangeStroke = isWhite ? `url(#${prefix}-whiteOrangeSpecular)` : `url(#${prefix}-blackOrangeSpecular)`;
  const rimStroke = `url(#${prefix}-horizontalRim)`;

  return (
    <g id={`${prefix}-king-geometry`} filter={isWhite ? `url(#ivory-ceramic-3d)` : `url(#piano-black-3d)`}>
      {/* 1. Base Silhouette Background Layer */}
      <path
        d="M 200,15 C 192,15 208,15 208,20 L 206,25 L 225,23 C 228,23 228,37 225,37 L 206,35 L 208,52 C 208,57 192,57 192,52 L 194,35 L 175,37 C 172,37 172,23 175,23 L 194,25 Z"
        fill={baseFill}
      />
      
      {/* 2. Cross Finial Bevels */}
      <path
        d="M 200,15 L 194,25 L 194,35 L 175,37 C 172,37 172,23 175,23 L 194,25 L 194,52 L 200,52 Z"
        fill={leftFill}
      />
      <path
        d="M 200,15 L 206,25 L 225,23 C 228,23 228,37 225,37 L 206,35 L 206,52 L 200,52 Z"
        fill={rightFill}
      />

      {/* Cross Base Connector Ball */}
      <circle cx="200" cy="59" r="7" fill={centerFill} />
      <circle cx="198" cy="57" r="3" fill="#ffffff" opacity={isWhite ? 0.6 : 0.25} />

      {/* 3. Crown Dome */}
      <path
        d="M 200,66 C 182,66 160,82 160,102 C 160,110 170,113 174,115 L 200,115 Z"
        fill={leftFill}
      />
      <path
        d="M 200,66 C 218,66 240,82 240,102 C 240,110 230,113 226,115 L 200,115 Z"
        fill={rightFill}
      />
      <path
        d="M 200,66 C 195,66 188,82 188,102 C 188,110 196,113 200,115 L 212,115 C 212,110 205,82 200,66 Z"
        fill={centerFill}
      />

      {/* 4. Crown Platform Collar */}
      <path
        d="M 170,115 C 170,111 230,111 230,115 L 234,123 C 234,127 166,127 166,123 Z"
        fill={centerFill}
      />
      <path
        d="M 166,123 C 166,123 200,121 200,123 L 200,127 C 200,127 166,127 166,123 Z"
        fill={leftFill}
      />
      <path
        d="M 234,123 C 234,123 200,121 200,123 L 200,127 C 200,127 234,127 234,123 Z"
        fill={rightFill}
      />

      {/* 5. Neck Ring */}
      <path
        d="M 180,123 L 220,123 L 224,135 L 176,135 Z"
        fill={baseFill}
      />
      <path
        d="M 180,123 L 200,123 L 200,135 L 176,135 Z"
        fill={leftFill}
      />
      <path
        d="M 220,123 L 200,123 L 200,135 L 224,135 Z"
        fill={rightFill}
      />

      {/* 6. Fluted Body */}
      <path
        d="M 176,135 C 180,165 185,185 185,200 C 185,240 150,270 150,300 L 183,300 C 183,270 195,240 195,200 C 195,185 190,165 188,135 Z"
        fill={leftFill}
      />
      <path
        d="M 212,135 C 210,165 205,185 205,200 C 205,240 225,270 225,300 L 250,300 C 250,270 215,240 215,200 C 215,185 220,165 224,135 Z"
        fill={rightFill}
      />
      <path
        d="M 188,135 C 190,165 195,185 195,200 C 195,240 183,270 183,300 L 217,300 C 217,270 205,240 205,200 C 205,185 210,165 212,135 Z"
        fill={centerFill}
      />

      {/* 7. Stacked Collar Rings */}
      {/* Upper collar ring */}
      <path
        d="M 148,300 C 144,300 142,308 146,316 L 254,316 C 258,308 256,300 252,300 Z"
        fill={baseFill}
      />
      <path
        d="M 148,300 C 144,300 142,308 146,316 L 200,316 L 200,300 Z"
        fill={leftFill}
      />
      <path
        d="M 252,300 C 256,300 258,308 254,316 L 200,316 L 200,300 Z"
        fill={rightFill}
      />

      {/* Middle collar ring */}
      <path
        d="M 142,316 C 138,316 136,326 140,336 L 260,336 C 264,326 262,316 258,316 Z"
        fill={baseFill}
      />
      <path
        d="M 142,316 C 138,316 136,326 140,336 L 200,336 L 200,316 Z"
        fill={leftFill}
      />
      <path
        d="M 258,316 C 262,316 264,326 260,336 L 200,336 L 200,316 Z"
        fill={rightFill}
      />

      {/* Lower collar ring */}
      <path
        d="M 144,336 C 140,336 138,344 142,352 L 258,352 C 262,344 260,336 256,336 Z"
        fill={baseFill}
      />
      <path
        d="M 144,336 C 140,336 138,344 142,352 L 200,352 L 200,336 Z"
        fill={leftFill}
      />
      <path
        d="M 256,336 C 260,336 262,344 258,352 L 200,352 L 200,336 Z"
        fill={rightFill}
      />

      {/* 8. Flared Pedestal Base */}
      <path
        d="M 146,352 C 148,380 130,410 115,440 L 165,440 C 175,410 185,380 182,352 Z"
        fill={leftFill}
      />
      <path
        d="M 218,352 C 215,380 225,410 235,440 L 285,440 C 270,410 252,380 254,352 Z"
        fill={rightFill}
      />
      <path
        d="M 182,352 C 185,380 175,410 165,440 L 235,440 C 225,410 215,380 218,352 Z"
        fill={centerFill}
      />

      {/* 9. Base Plinths */}
      {/* Top base ring */}
      <path
        d="M 112,440 C 108,440 106,448 110,455 L 290,455 C 294,448 292,440 288,440 Z"
        fill={baseFill}
      />
      <path
        d="M 112,440 C 108,440 106,448 110,455 L 200,455 L 200,440 Z"
        fill={leftFill}
      />
      <path
        d="M 288,440 C 292,440 294,448 290,455 L 200,455 L 200,440 Z"
        fill={rightFill}
      />

      {/* Bottom base block */}
      <path
        d="M 110,455 L 290,455 L 285,465 L 115,465 Z"
        fill={baseFill}
      />
      <path
        d="M 110,455 L 200,455 L 200,465 L 115,465 Z"
        fill={leftFill}
      />
      <path
        d="M 290,455 L 200,455 L 200,465 L 285,465 Z"
        fill={rightFill}
      />

      {/* 10. Specular Outline / Reflective Rim Light Strokes */}
      <path
        d="M 160,102 C 160,82 182,66 200,66 M 170,115 C 166,123 200,125 200,125 M 176,135 C 180,165 185,185 185,200 C 185,240 150,270 150,300 M 148,300 C 144,300 142,308 146,316 M 142,316 C 138,316 136,326 140,336 M 144,336 C 140,336 138,344 142,352 M 146,352 C 148,380 130,410 115,440 M 112,440 C 108,440 106,448 110,455"
        stroke={silverStroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M 200,66 C 218,66 240,82 240,102 M 230,115 C 234,123 200,125 200,125 M 224,135 C 220,165 215,185 215,200 C 215,240 250,270 250,300 M 252,300 C 256,300 258,308 254,316 M 258,316 C 262,316 264,326 260,336 M 256,336 C 260,336 262,344 258,352 M 254,352 C 252,380 270,410 285,440 M 288,440 C 292,440 294,448 290,455"
        stroke={orangeStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Horizontal disks rim lights */}
      <path d="M 170,115 C 170,115 200,119 230,115" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 148,300 C 148,300 200,305 252,300" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 142,316 C 142,316 200,321 258,316" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 144,336 C 144,336 200,341 256,336" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 112,440 C 112,440 200,446 288,440" stroke={rimStroke} strokeWidth="1.2" fill="none" />
    </g>
  );
}

/**
 * Isolated Upper Half of the King (Cross to Upper Torso, Y = 15 to 300)
 */
function KingUpperHalf({ isWhite, prefix }: KingPartsProps) {
  const leftFill = isWhite ? `url(#${prefix}-whiteLeft)` : `url(#${prefix}-blackLeft)`;
  const centerFill = isWhite ? `url(#${prefix}-whiteCenter)` : `url(#${prefix}-blackCenter)`;
  const rightFill = isWhite ? `url(#${prefix}-whiteRight)` : `url(#${prefix}-blackRight)`;
  const baseFill = isWhite ? `url(#${prefix}-whiteBase)` : `url(#${prefix}-blackBase)`;

  const silverStroke = isWhite ? `url(#${prefix}-whiteSilverSpecular)` : `url(#${prefix}-blackSilverSpecular)`;
  const orangeStroke = isWhite ? `url(#${prefix}-whiteOrangeSpecular)` : `url(#${prefix}-blackOrangeSpecular)`;
  const rimStroke = `url(#${prefix}-horizontalRim)`;

  return (
    <g id={`${prefix}-king-upper-geometry`} filter={isWhite ? `url(#ivory-ceramic-3d)` : `url(#piano-black-3d)`}>
      {/* 1. Base Silhouette Background Layer */}
      <path
        d="M 200,15 C 192,15 208,15 208,20 L 206,25 L 225,23 C 228,23 228,37 225,37 L 206,35 L 208,52 C 208,57 192,57 192,52 L 194,35 L 175,37 C 172,37 172,23 175,23 L 194,25 Z"
        fill={baseFill}
      />
      
      {/* 2. Cross Finial Bevels */}
      <path
        d="M 200,15 L 194,25 L 194,35 L 175,37 C 172,37 172,23 175,23 L 194,25 L 194,52 L 200,52 Z"
        fill={leftFill}
      />
      <path
        d="M 200,15 L 206,25 L 225,23 C 228,23 228,37 225,37 L 206,35 L 206,52 L 200,52 Z"
        fill={rightFill}
      />

      {/* Cross Base Connector Ball */}
      <circle cx="200" cy="59" r="7" fill={centerFill} />
      <circle cx="198" cy="57" r="3" fill="#ffffff" opacity={0.2} />

      {/* 3. Crown Dome */}
      <path
        d="M 200,66 C 182,66 160,82 160,102 C 160,110 170,113 174,115 L 200,115 Z"
        fill={leftFill}
      />
      <path
        d="M 200,66 C 218,66 240,82 240,102 C 240,110 230,113 226,115 L 200,115 Z"
        fill={rightFill}
      />
      <path
        d="M 200,66 C 195,66 188,82 188,102 C 188,110 196,113 200,115 L 212,115 C 212,110 205,82 200,66 Z"
        fill={centerFill}
      />

      {/* 4. Crown Platform Collar */}
      <path
        d="M 170,115 C 170,111 230,111 230,115 L 234,123 C 234,127 166,127 166,123 Z"
        fill={centerFill}
      />
      <path
        d="M 166,123 C 166,123 200,121 200,123 L 200,127 C 200,127 166,127 166,123 Z"
        fill={leftFill}
      />
      <path
        d="M 234,123 C 234,123 200,121 200,123 L 200,127 C 200,127 234,127 234,123 Z"
        fill={rightFill}
      />

      {/* 5. Neck Ring */}
      <path
        d="M 180,123 L 220,123 L 224,135 L 176,135 Z"
        fill={baseFill}
      />
      <path
        d="M 180,123 L 200,123 L 200,135 L 176,135 Z"
        fill={leftFill}
      />
      <path
        d="M 220,123 L 200,123 L 200,135 L 224,135 Z"
        fill={rightFill}
      />

      {/* 6. Fluted Body */}
      <path
        d="M 176,135 C 180,165 185,185 185,200 C 185,240 150,270 150,300 L 183,300 C 183,270 195,240 195,200 C 195,185 190,165 188,135 Z"
        fill={leftFill}
      />
      <path
        d="M 212,135 C 210,165 205,185 205,200 C 205,240 225,270 225,300 L 250,300 C 250,270 215,240 215,200 C 215,185 220,165 224,135 Z"
        fill={rightFill}
      />
      <path
        d="M 188,135 C 190,165 195,185 195,200 C 195,240 183,270 183,300 L 217,300 C 217,270 205,240 205,200 C 205,185 210,165 212,135 Z"
        fill={centerFill}
      />

      {/* 10. Specular Outline */}
      <path
        d="M 160,102 C 160,82 182,66 200,66 M 170,115 C 166,123 200,125 200,125 M 176,135 C 180,165 185,185 185,200 C 185,240 150,270 150,300"
        stroke={silverStroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 200,66 C 218,66 240,82 240,102 M 230,115 C 234,123 200,125 200,125 M 224,135 C 220,165 215,185 215,200 C 215,240 250,270 250,300"
        stroke={orangeStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Horizontal disks rim lights */}
      <path d="M 170,115 C 170,115 200,119 230,115" stroke={rimStroke} strokeWidth="1" fill="none" />
    </g>
  );
}

/**
 * Isolated Lower Half of the King (Stacked Collar to Base, Y = 300 to 465)
 */
function KingLowerHalf({ isWhite, prefix }: KingPartsProps) {
  const leftFill = isWhite ? `url(#${prefix}-whiteLeft)` : `url(#${prefix}-blackLeft)`;
  const centerFill = isWhite ? `url(#${prefix}-whiteCenter)` : `url(#${prefix}-blackCenter)`;
  const rightFill = isWhite ? `url(#${prefix}-whiteRight)` : `url(#${prefix}-blackRight)`;
  const baseFill = isWhite ? `url(#${prefix}-whiteBase)` : `url(#${prefix}-blackBase)`;

  const silverStroke = isWhite ? `url(#${prefix}-whiteSilverSpecular)` : `url(#${prefix}-blackSilverSpecular)`;
  const orangeStroke = isWhite ? `url(#${prefix}-whiteOrangeSpecular)` : `url(#${prefix}-blackOrangeSpecular)`;
  const rimStroke = `url(#${prefix}-horizontalRim)`;

  return (
    <g id={`${prefix}-king-lower-geometry`} filter={isWhite ? `url(#ivory-ceramic-3d)` : `url(#piano-black-3d)`}>
      {/* Upper collar break cover */}
      <path
        d="M 148,300 C 144,300 142,308 146,316 L 254,316 C 258,308 256,300 252,300 Z"
        fill={baseFill}
      />
      
      {/* 7. Stacked Collar Rings */}
      <path
        d="M 148,300 C 144,300 142,308 146,316 L 200,316 L 200,300 Z"
        fill={leftFill}
      />
      <path
        d="M 252,300 C 256,300 258,308 254,316 L 200,316 L 200,300 Z"
        fill={rightFill}
      />

      {/* Middle collar ring */}
      <path
        d="M 142,316 C 138,316 136,326 140,336 L 260,336 C 264,326 262,316 258,316 Z"
        fill={baseFill}
      />
      <path
        d="M 142,316 C 138,316 136,326 140,336 L 200,336 L 200,316 Z"
        fill={leftFill}
      />
      <path
        d="M 258,316 C 262,316 264,326 260,336 L 200,336 L 200,316 Z"
        fill={rightFill}
      />

      {/* Lower collar ring */}
      <path
        d="M 144,336 C 140,336 138,344 142,352 L 258,352 C 262,344 260,336 256,336 Z"
        fill={baseFill}
      />
      <path
        d="M 144,336 C 140,336 138,344 142,352 L 200,352 L 200,336 Z"
        fill={leftFill}
      />
      <path
        d="M 256,336 C 260,336 262,344 258,352 L 200,352 L 200,336 Z"
        fill={rightFill}
      />

      {/* 8. Flared Pedestal Base */}
      <path
        d="M 146,352 C 148,380 130,410 115,440 L 165,440 C 175,410 185,380 182,352 Z"
        fill={leftFill}
      />
      <path
        d="M 218,352 C 215,380 225,410 235,440 L 285,440 C 270,410 252,380 254,352 Z"
        fill={rightFill}
      />
      <path
        d="M 182,352 C 185,380 175,410 165,440 L 235,440 C 225,410 215,380 218,352 Z"
        fill={centerFill}
      />

      {/* 9. Base Plinths */}
      {/* Top base ring */}
      <path
        d="M 112,440 C 108,440 106,448 110,455 L 290,455 C 294,448 292,440 288,440 Z"
        fill={baseFill}
      />
      <path
        d="M 112,440 C 108,440 106,448 110,455 L 200,455 L 200,440 Z"
        fill={leftFill}
      />
      <path
        d="M 288,440 C 292,440 294,448 290,455 L 200,455 L 200,440 Z"
        fill={rightFill}
      />

      {/* Bottom base block */}
      <path
        d="M 110,455 L 290,455 L 285,465 L 115,465 Z"
        fill={baseFill}
      />
      <path
        d="M 110,455 L 200,455 L 200,465 L 115,465 Z"
        fill={leftFill}
      />
      <path
        d="M 290,455 L 200,455 L 200,465 L 285,465 Z"
        fill={rightFill}
      />

      {/* 10. Specular Outline */}
      <path
        d="M 148,300 C 144,300 142,308 146,316 M 142,316 C 138,316 136,326 140,336 M 144,336 C 140,336 138,344 142,352 M 146,352 C 148,380 130,410 115,440 M 112,440 C 108,440 106,448 110,455"
        stroke={silverStroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 252,300 C 256,300 258,308 254,316 M 258,316 C 262,316 264,326 260,336 M 256,336 C 260,336 262,344 258,352 M 254,352 C 252,380 270,410 285,440 M 288,440 C 292,440 294,448 290,455"
        stroke={orangeStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Horizontal disks rim lights */}
      <path d="M 148,300 C 148,300 200,305 252,300" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 142,316 C 142,316 200,321 258,316" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 144,336 C 144,336 200,341 256,336" stroke={rimStroke} strokeWidth="1" fill="none" />
      <path d="M 112,440 C 112,440 200,446 288,440" stroke={rimStroke} strokeWidth="1.2" fill="none" />
    </g>
  );
}

/**
 * Premium King Chess Collision Visual Component
 * Styled with high-fidelity glossy gradients, specular silver highlights,
 * and warm orange ambient reflections from the lower-right fire environment.
 * Renders the frozen dramatic collision between the Black King and the White King.
 */
export function ChessCollisionScene() {
  const p = "scene"; // Prefixes to prevent ID clashes in SVG Gradients

  // Flying Shards from the Impact Zone (recolored and lit with the 3D glossy shaders)
  const shardsList = [
    // Big shards from collision center (around x: 340-410, y: 280-370)
    { d: "M 0 0 L 18 -6 L 12 14 Z", x: 335, y: 320, rot: 15, isWhite: false, scale: 0.9 },
    { d: "M 0 0 L 14 -12 L 20 6 Z", x: 355, y: 295, rot: -28, isWhite: true, scale: 0.8 },
    { d: "M 0 0 L -16 8 L -4 18 Z", x: 310, y: 345, rot: 42, isWhite: false, scale: 0.75 },
    { d: "M 0 0 L 12 16 L -6 18 Z", x: 380, y: 350, rot: 80, isWhite: false, scale: 0.7 },
    { d: "M 0 0 L 15 -3 L 5 15 Z", x: 395, y: 315, rot: 110, isWhite: true, scale: 0.85 },
    { d: "M 0 0 L -8 -15 L 12 -6 Z", x: 375, y: 275, rot: -45, isWhite: true, scale: 0.65 },
    { d: "M 0 0 L 10 10 L -12 6 Z", x: 285, y: 355, rot: 15, isWhite: false, scale: 0.7 },
    { d: "M 0 0 L -14 -4 L -6 14 Z", x: 325, y: 360, rot: -95, isWhite: false, scale: 0.8 },
    { d: "M 0 0 L 18 -10 L 8 16 Z", x: 425, y: 330, rot: 55, isWhite: true, scale: 0.6 },
    { d: "M 0 0 L -12 12 L 6 15 Z", x: 410, y: 285, rot: 135, isWhite: true, scale: 0.75 },
    { d: "M 0 0 L 8 -14 L 16 0 Z", x: 315, y: 280, rot: -60, isWhite: false, scale: 0.55 },
    { d: "M 0 0 L -15 -8 L 5 12 Z", x: 290, y: 325, rot: 25, isWhite: false, scale: 0.65 },
    { d: "M 0 0 L 12 -12 L 14 8 Z", x: 440, y: 310, rot: -15, isWhite: true, scale: 0.7 },
  ];

  // Floating orange glowing sparks
  const glowingDust = [
    { cx: 348, cy: 335, r: 2.2 },
    { cx: 322, cy: 310, r: 1.5 },
    { cx: 375, cy: 312, r: 2.0 },
    { cx: 305, cy: 360, r: 1.2 },
    { cx: 395, cy: 350, r: 1.8 },
    { cx: 418, cy: 325, r: 1.6 },
    { cx: 332, cy: 358, r: 2.0 },
    { cx: 365, cy: 362, r: 1.4 },
    { cx: 435, cy: 348, r: 2.0 },
    { cx: 288, cy: 338, r: 1.2 },
    { cx: 360, cy: 260, r: 1.5 },
    { cx: 460, cy: 290, r: 1.8 },
    { cx: 300, cy: 390, r: 1.3 },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 650 650"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[320px] sm:w-[420px] md:w-[540px] lg:w-[620px] h-[320px] sm:h-[420px] md:h-[540px] lg:h-[620px]"
    >
      <defs>
        {/* ========================================================= */}
        {/* LIGHTING FILTERS FOR REALISTIC 3D CHESS MATERIALS        */}
        {/* ========================================================= */}
        
        {/* 
          Obsidian/Piano Black Luxury 3D Filter
          Generates sharp high-gloss white reflections and warm orange rim light 
        */}
        <filter id="piano-black-3d" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="blur" />
          
          {/* Keylight specular reflection (Sharp White) */}
          <feSpecularLighting in="blur" surfaceScale="17" specularConstant="2.4" specularExponent="45" lightingColor="#ffffff" result="whiteSpec">
            <fePointLight x="130" y="-120" z="260" />
          </feSpecularLighting>
          
          {/* Environment specular reflection (Burnt Orange) */}
          <feSpecularLighting in="blur" surfaceScale="17" specularConstant="2.6" specularExponent="16" lightingColor="#f97316" result="orangeSpec">
            <fePointLight x="480" y="580" z="140" />
          </feSpecularLighting>
          
          <feComposite in="whiteSpec" in2="orangeSpec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="combinedSpec" />
          
          {/* Volumetric Diffuse Lighting */}
          <feDiffuseLighting in="blur" surfaceScale="17" diffuseConstant="0.8" lightingColor="#a3a3c2" result="diffuse">
            <fePointLight x="130" y="-120" z="260" />
          </feDiffuseLighting>
          
          <feBlend in="SourceGraphic" in2="diffuse" mode="multiply" result="shadedBase" />
          <feComposite in="shadedBase" in2="combinedSpec" operator="arithmetic" k1="0" k2="1" k3="0.88" k4="0" />
        </filter>

        {/* 
          Ivory Ceramic Satin 3D Filter
          Generates smooth satin-like high-contrast shading and soft orange wrap-around rim light 
        */}
        <filter id="ivory-ceramic-3d" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6.5" result="blur" />
          
          {/* Soft White highlight for luxurious ceramic gloss */}
          <feSpecularLighting in="blur" surfaceScale="15" specularConstant="1.5" specularExponent="28" lightingColor="#ffffff" result="whiteSpec">
            <fePointLight x="120" y="-100" z="280" />
          </feSpecularLighting>
          
          {/* Wrap orange rim highlight around the porcelain */}
          <feSpecularLighting in="blur" surfaceScale="15" specularConstant="1.8" specularExponent="18" lightingColor="#ea580c" result="orangeSpec">
            <fePointLight x="440" y="500" z="120" />
          </feSpecularLighting>
          
          <feComposite in="whiteSpec" in2="orangeSpec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="combinedSpec" />
          
          {/* Diffuse shading for the solid porcelain body */}
          <feDiffuseLighting in="blur" surfaceScale="15" diffuseConstant="1.0" lightingColor="#faf6f0" result="diffuse">
            <fePointLight x="120" y="-100" z="280" />
          </feDiffuseLighting>
          
          <feBlend in="SourceGraphic" in2="diffuse" mode="multiply" result="shadedBase" />
          <feComposite in="shadedBase" in2="combinedSpec" operator="arithmetic" k1="0" k2="1" k3="0.68" k4="0" />
        </filter>

        {/* Shadow filter for fragments (Ambient Occlusion) */}
        <filter id="ambient-occlusion-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="2" dy="5" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.9" />
        </filter>

        {/* ========================================================= */}
        {/* GRADIENTS: DETAILED METALLIC / CERAMIC TEXTURES           */}
        {/* ========================================================= */}
        <linearGradient id={`${p}-blackBase`} x1="200" y1="15" x2="200" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a0a0d" />
          <stop offset="50%" stopColor="#030304" />
          <stop offset="100%" stopColor="#010101" />
        </linearGradient>

        <linearGradient id={`${p}-blackLeft`} x1="100" y1="100" x2="250" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#030304" />
          <stop offset="25%" stopColor="#0c0c10" />
          <stop offset="50%" stopColor="#2c2c36" />
          <stop offset="65%" stopColor="#414150" />
          <stop offset="80%" stopColor="#121217" />
          <stop offset="100%" stopColor="#020202" />
        </linearGradient>

        <linearGradient id={`${p}-blackRight`} x1="200" y1="150" x2="350" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#040406" />
          <stop offset="35%" stopColor="#140702" />
          <stop offset="60%" stopColor="#3d1502" />
          <stop offset="85%" stopColor="#963704" />
          <stop offset="97%" stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2c0c01" />
        </linearGradient>

        <linearGradient id={`${p}-blackCenter`} x1="150" y1="100" x2="250" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#050507" />
          <stop offset="35%" stopColor="#121217" />
          <stop offset="50%" stopColor="#20202b" />
          <stop offset="65%" stopColor="#0e0e12" />
          <stop offset="100%" stopColor="#010102" />
        </linearGradient>

        <linearGradient id={`${p}-blackSilverSpecular`} x1="120" y1="20" x2="180" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#d4d4d8" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        <linearGradient id={`${p}-blackOrangeSpecular`} x1="280" y1="200" x2="300" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb088" stopOpacity="0.0" />
          <stop offset="40%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#ea580c" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0.9" />
        </linearGradient>

        {/* ========================================================= */}
        {/* GRADIENTS: WHITE IVORY                                    */}
        {/* ========================================================= */}
        <linearGradient id={`${p}-whiteBase`} x1="200" y1="15" x2="200" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#faf7f2" />
          <stop offset="100%" stopColor="#e7e0d5" />
        </linearGradient>

        <linearGradient id={`${p}-whiteLeft`} x1="100" y1="100" x2="250" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fdfbf8" />
          <stop offset="50%" stopColor="#f3eee3" />
          <stop offset="75%" stopColor="#dfd5c5" />
          <stop offset="100%" stopColor="#bfae9a" />
        </linearGradient>

        <linearGradient id={`${p}-whiteRight`} x1="200" y1="150" x2="350" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fcf9f2" />
          <stop offset="55%" stopColor="#fce7cb" />
          <stop offset="78%" stopColor="#fdbd83" />
          <stop offset="93%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id={`${p}-whiteCenter`} x1="150" y1="100" x2="250" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fefaeb" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f5f0e4" />
          <stop offset="75%" stopColor="#e9ded0" />
          <stop offset="100%" stopColor="#cca98b" />
        </linearGradient>

        <linearGradient id={`${p}-whiteSilverSpecular`} x1="120" y1="20" x2="180" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        <linearGradient id={`${p}-whiteOrangeSpecular`} x1="280" y1="200" x2="300" y2="480" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe6d5" stopOpacity="0.0" />
          <stop offset="45%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="80%" stopColor="#ea580c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id={`${p}-horizontalRim`} x1="100" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#ffb088" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id={`${p}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={`${p}-sparkle`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Atmospheric Orange & Gold Backdrop Glow wrapping the chess pieces */}
      <circle
        cx="370"
        cy="330"
        r="150"
        fill="radial-gradient(circle, rgba(234, 88, 12, 0.12) 0%, rgba(0,0,0,0) 70%)"
        filter={`url(#${p}-glow)`}
        className="pointer-events-none"
      />

      {/* ========================================================= */}
      {/* 1. BLACK KING: LOWER HALF (Volumetric static pedestal)    */}
      {/* ========================================================= */}
      <g transform="translate(115, 175) rotate(-12) scale(0.85)">
        <KingLowerHalf isWhite={false} prefix={p} />
      </g>

      {/* ========================================================= */}
      {/* 2. BLACK KING: UPPER HALF (Severed & tilted back in agony) */}
      {/* ========================================================= */}
      <g transform="translate(120, 160) rotate(-24) scale(0.85)">
        <KingUpperHalf isWhite={false} prefix={p} />
      </g>

      {/* ========================================================= */}
      {/* 3. WHITE KING: INTACT & STRIKING DOWNWARD POWERFULLY     */}
      {/* ========================================================= */}
      <g transform="translate(440, -99) rotate(33) scale(0.82)">
        <KingParts isWhite={true} prefix={p} />
      </g>

      {/* ========================================================= */}
      {/* 4. IMPACT ZONE FLYING SHARDS & PARTICLES                 */}
      {/* ========================================================= */}
      <g id={`${p}-shatter-particles`}>
        {/* Soft core orange sparks */}
        <ellipse
          cx="370"
          cy="315"
          rx="50"
          ry="32"
          fill="#ea580c"
          opacity="0.38"
          filter={`url(#${p}-glow)`}
        />
        <circle
          cx="365"
          cy="310"
          r="16"
          fill="#ffedd5"
          opacity="0.65"
          filter={`url(#${p}-glow)`}
        />

        {/* 3D Rendered Shards (applying corresponding 3D shaders directly on fragment geometry) */}
        {shardsList.map((s, idx) => {
          const fillGrad = s.isWhite ? `url(#${p}-whiteCenter)` : `url(#${p}-blackCenter)`;
          const filterId = s.isWhite ? "url(#ivory-ceramic-3d)" : "url(#piano-black-3d)";
          return (
            <path
              key={idx}
              d={s.d}
              fill={fillGrad}
              filter={`${filterId} url(#ambient-occlusion-shadow)`}
              transform={`translate(${s.x}, ${s.y}) rotate(${s.rot}) scale(${s.scale})`}
              stroke="#ea580c"
              strokeWidth="0.5"
              strokeLinejoin="round"
              opacity="0.95"
            />
          );
        })}

        {/* Tiny Floating Sparks / Sparkles */}
        {glowingDust.map((d, idx) => (
          <circle
            key={idx}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={idx % 3 === 0 ? "#ffd6b3" : idx % 3 === 1 ? "#ff9040" : "#f97316"}
            opacity={0.85}
            filter={`url(#${p}-sparkle)`}
          />
        ))}
      </g>
    </svg>
  );
}

export default function GlassSculpture() {
  return (
    <div
      id="hero-glass-sculpture-wrapper"
      className="relative w-full h-[360px] sm:h-[450px] md:h-[550px] lg:h-[650px] flex flex-col items-center justify-center select-none"
    >
      {/* 
        Slow Floating Assembly Wrapper
        Handles slow, elegant vertical floating on the Y-axis (6px movement, 8 seconds duration, Ease In Out)
      */}
      <motion.div
        id="sculpture-assembly"
        className="relative w-full flex items-center justify-center"
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChessCollisionScene />
      </motion.div>

      {/* 
        Subtle Interactive Contact Shadow
        Scales and fades in harmony with the floating vertical height
      */}
      <motion.div
        id="sculpture-shadow"
        className="absolute bottom-2 md:bottom-8 w-[240px] h-[16px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 70%)",
        }}
        animate={{
          scale: [1.05, 0.95, 1.05],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
