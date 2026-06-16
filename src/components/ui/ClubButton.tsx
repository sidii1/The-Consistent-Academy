import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ClubButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/club');
  };

  return (
    <StyledWrapper onClick={handleClick} title="Go to C.C. Club">
      <div className="main-background">
        <label htmlFor="cc-button" className="wrap">
          <input
            id="cc-button"
            aria-label="C.C. Club Toggle"
            type="checkbox"
            readOnly
          />
          <button className="button" tabIndex={-1}>
            <div className="inner">
              {/* overflow="visible" prevents the drop-shadows from clipping into square boxes */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" style={{ overflow: 'visible' }} height="100%" width="100%">
                
                {/* Layer 1: Base Dark Text (The unlit, etched state) */}
                <g className="symbol">
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">C.C.</text>
                  <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle">Club</text>
                </g>

                {/* Layer 2: The Soft Blurred Outline (Animates first to simulate a wide light spread) */}
                <g className="symbol-path-glow">
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">C.C.</text>
                  <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle">Club</text>
                </g>

                {/* Layer 3: The Crisp Inner Outline (Animates simultaneously to create the bright core) */}
                <g className="symbol-path">
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">C.C.</text>
                  <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle">Club</text>
                </g>

                {/* Layer 4: The Solid Fill (Fades in softly after the tracing animation is nearly complete) */}
                <g className="illuminated-fill">
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">C.C.</text>
                  <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle">Club</text>
                </g>

              </svg>
            </div>
          </button>
          
          {/* The ambient shadow base */}
          {/* <div className="bg" /> */}
          
          {/* Subtle Surface Texture Overlay */}
          <div className="noise">
            <svg height="100%" width="100%">
              <defs>
                <pattern height={500} width={500} patternUnits="userSpaceOnUse" id="noise-pattern">
                  <filter y={0} x={0} id="noise">
                    <feTurbulence stitchTiles="stitch" numOctaves={3} baseFrequency="0.65" type="fractalNoise" />
                    <feBlend mode="screen" />
                  </filter>
                  <rect filter="url(#noise)" height={500} width={500} />
                </pattern>
              </defs>
              <rect fill="url(#noise-pattern)" height="100%" width="100%" />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
};

const SplashOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #252436;
  z-index: 9999;
  transform-origin: center;
  animation: splashScale 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  @keyframes splashScale {
    0% {
      clip-path: circle(0% at 90% 90%);
    }
    100% {
      clip-path: circle(150% at 90% 90%);
    }
  }
`;


const StyledWrapper = styled.div`
  cursor: pointer;

  .main-background {
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }

  .wrap {
    --radius: 50%;
    --bg: #2c3238;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    pointer-events: none;
  }

  /* Ambient Drop Shadows for depth */
  .wrap::before {
    content: "";
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: var(--radius);
    background-color: rgba(255, 255, 255, 0.1);
    filter: blur(40px);
    transform: skewY(-10deg);
  }

  .wrap::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--radius);
    background-color: rgba(0, 0, 0, 0.4);
    filter: blur(25px);
  }

  .wrap input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    inset: 0;
    z-index: 999;
    cursor: pointer;
    pointer-events: all;
    user-select: none;
  }

  /* Core Button Geometry */
  .button {
    position: relative;
    overflow: hidden;
    width: 132px;
    height: 132px;
    background-color: var(--bg);
    z-index: 2;
    border: transparent;
    border-radius: var(--radius);
    box-shadow:
      inset 0 1px 1px rgb(255 255 255 / 40%),
      inset 0 -5px 1px -3px rgba(0,0,0,0.5),
      inset 0 -12px 5px -7px rgba(0,0,0,0.8);
    transition: all 0.3s ease;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    border-top: 38px solid #414244;
    border-left: 34px solid #2b2b2c;
    border-right: 34px solid #2b2b2c;
    border-bottom: 42px solid #15161a;
    filter: blur(7px);
    transition: all 0.5s ease;
  }

  .button .inner {
    z-index: 9;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 22px;
    border-radius: var(--radius);
    background: linear-gradient(180deg, #232324 5%, #46484b 100%);
    transition: all 0.3s ease;
    box-shadow:
      inset 0 -5px 15px -1px rgba(0, 0, 0, 0.3),
      inset 0 -4px 3px -3px black,
      inset 0 -10px 20px -8px rgb(255 255 255 / 40%),
      inset 0 1px 0 1px rgb(255 255 255 / 20%);
  }

  /* Typography Settings */
  .button .inner svg text {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500; 
    font-size: 32px;
    letter-spacing: 2px;
  }

  /* Text Layer Styling */
  .button .inner svg .symbol text {
    fill: #1e1e20; /* The dark, unlit state */
  }

  .button .inner svg .symbol-path text,
  .button .inner svg .symbol-path-glow text {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
    /* Sets up the invisible path length for the animation */
    stroke-dasharray: 250;
    stroke-dashoffset: 250; 
  }

  .button .inner svg .symbol-path text { 
    stroke: #9C37FC; 
    stroke-width: 1.5px; 
  }
  
  .button .inner svg .symbol-path-glow text {
    stroke: #9C37FC;
    stroke-width: 4px;
    filter: blur(4px); /* A wide, blurred stroke for the ambient neon haze */
  }

  .button .inner svg .illuminated-fill text {
    fill: #9C37FC;
    opacity: 0; /* Kept invisible until the animation triggers */
    filter: drop-shadow(0 0 2px rgba(156, 55, 252, 0.6));
  }

  /* The Base Plinth under the button */
  .bg {
    background-color: black;
    position: absolute;
    inset: -7px;
    border-radius: var(--radius);
    box-shadow: 0 20px 10px -10px rgba(0, 0, 0, 0.3);
    transition: all 0.5s ease;
    z-index: 1;
  }

  .bg::before {
    content: "";
    position: absolute;
    border-radius: inherit;
    box-shadow:
      inset 0 0 5px 1px black,
      inset 0 0 0 1px black;
    inset: 0;
    z-index: 1;
  }

  .noise {
    position: absolute;
    top: -20px;
    bottom: -20px;
    left: 0;
    right: 0;
    opacity: 0.08;
    mask-image: radial-gradient(circle, white 40%, transparent 80%);
    filter: grayscale(1);
    pointer-events: none;
  }

  /* ========================================= */
  /* INTERACTIVE STATES & ANIMATIONS           */
  /* ========================================= */

  .wrap input:hover + .button {
    transform: scale(1.02);
  }

  .wrap input:active + .button {
    transform: scale(0.97);
    filter: contrast(1.07);
    background-color: transparent;
  }
  
  .wrap input:active + .button .inner {
    background: linear-gradient(180deg, #232324 5%, #3b3d40 100%);
    transform: scale(0.95);
  }

  /* The Organic Tracing Animation */
  .wrap input:checked + .button .inner svg .symbol-path text,
  .wrap input:checked + .button .inner svg .symbol-path-glow text {
    animation: traceLight 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* The Solid Fill Fade-in */
  .wrap input:checked + .button .inner svg .illuminated-fill text {
    animation: bloomFill 0.8s ease-in forwards;
    animation-delay: 0.8s; /* Waits for the tracing to mostly finish before blooming */
  }

  /* The Sub-surface Glow Bleeding from Beneath */
  .wrap input:checked + .button ~ .bg {
    /* Radiates the light outward from the very base of the button */
    box-shadow: 
      0 0 35px 5px rgba(156, 55, 252, 0.5), 
      0 0 70px 15px rgba(156, 55, 252, 0.2),
      0 20px 10px -10px rgba(0, 0, 0, 0.3); /* Preserves the physical shadow */
  }

  /* --- Keyframes --- */

  @keyframes traceLight {
    0%   { stroke-dashoffset: 250; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes bloomFill {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
`;

export default ClubButton;