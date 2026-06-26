import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CCButton = () => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  const [splashConfig, setSplashConfig] = useState(null);

  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);

    // Grab the exact center coordinates of the button
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Small delay so the user sees the button press animation
    setTimeout(() => {
      setSplashConfig({
        '--click-x': `${x}px`,
        '--click-y': `${y}px`,
      });

      // Wait for the splash to cover the screen (600ms) before navigating
      setTimeout(() => {
        navigate('/club');
      }, 600);
    }, 200);
  };

  return (
    <StyledWrapper>
      <div>
        <svg style={{visibility: 'hidden', position: 'absolute'}} width={0} height={0} xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation={8} result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        
        <div className="button-wrapper">
          <button 
            className="button" 
            role="button" 
            ref={buttonRef} 
            onClick={handleClick}
          >
            <div className="liquid-bg" />
            <span className="text">
              <div className="words">
                <div className="text-wrapper">
                  <div className="text-normal">
                    <span>C.C.</span>
                    <span>Club</span>
                  </div>
                  <div className="text-hover">
                    <span>C.C.</span>
                    <span>Club</span>
                  </div>
                </div>
              </div>
              <svg className="premium-icon" xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1={7} y1={17} x2={17} y2={7} />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* 2. Wrap SplashOverlay in createPortal targeting document.body */}
      {splashConfig && createPortal(
        <SplashOverlay style={splashConfig} />,
        document.body
      )}
    </StyledWrapper>
  );
}



const SplashOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #252436;
  z-index: 9999;
  animation: splashScale 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  pointer-events: all;
  
  @keyframes splashScale {
    0% {
      clip-path: circle(0px at var(--click-x) var(--click-y));
    }
    100% {
      /* Uses vmax to ensure the circle easily covers ultra-wide or ultra-tall screens */
      clip-path: circle(150vmax at var(--click-x) var(--click-y));
    }
  }
`;

const StyledWrapper = styled.div`
  @keyframes hover-float {
    50% {
      transform: translateY(-4px);
      box-shadow:
        0 15px 25px rgba(0, 0, 0, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .button {
    position: relative;
    padding: 4px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    transition: all 150ms ease-in-out;
    animation: hover-float 2.5s infinite ease-in-out;
    z-index: 1;

    background: #181924;
    overflow: hidden;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.25),
      0 2px 8px rgba(0, 0, 0, 0.45);
  }

  .button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250%;
    aspect-ratio: 1;

    background: linear-gradient(
      to right,
      transparent 30%,
      rgba(255, 255, 255, 0.8) 45%,
      #db92e8 50%,
      rgba(255, 255, 255, 0.8) 55%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    animation: spin 3s linear infinite;
    animation-play-state: paused;
    z-index: 0;
  }

  .button .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    padding: 0;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    z-index: 1;

    background: radial-gradient(
        150% 100% at 50% 100%,
        #000000 40%,
        transparent 80%
      ),
      linear-gradient(
        90deg,
        #181924 0%,
        #9d4edd 25%,  /* 1. Medium Electric Purple */
        #c77dff 50%,  /* 2. Bright Lilac */
        #5a189a 75%,  /* 3. Deep Velvet Purple */
        #181924 100%
      );

    box-shadow:
      1px -1px 2px hsl(0 0% 100% / 0.5) inset,
      0px -1px 2px hsl(0 0% 100% / 0.5) inset,
      -1px -1px 2px hsl(0 0% 100% / 0.5) inset,
      1px 1px 2px hsl(0 0% 30% / 0.5) inset,
      -8px 4px 10px -6px hsl(0 0% 30% / 0.25) inset,
      -1px 1px 6px hsl(0 0% 30% / 0.25) inset,
      -1px -1px 8px hsl(0 0% 60% / 0.15),
      1px 1px 2px hsl(0 0% 30% / 0.15),
      2px 2px 6px hsl(0 0% 30% / 0.15),
      -2px -1px 2px hsl(0 0% 100% / 0.25) inset,
      3px 6px 16px -6px hsl(0 0% 30% / 0.5);

    transition: all 0.2s ease;

    color: #E0E5EC;
    font-family: "Fredoka", sans-serif;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow:
      0 1px 3px rgba(0, 0, 0, 0.8),
      0 0 8px rgba(255, 255, 255, 0.3);
  }

  .button .text::before,
  .button .text::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 2;
  }

  .button .text::before {
    background: linear-gradient(
      155deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.05) 42%,
      transparent 42.5%
    );
  }

  .button .text::after {
    background: linear-gradient(
      -155deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.05) 42%,
      transparent 42.5%
    );
  }

  .button .words {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden; 
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
    
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.4s cubic-bezier(0.5, 0, 0.2, 1);
  }

  .text-normal, .text-hover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.15;
  }

  .text-hover {
    position: absolute;
    top: 100%; 
    left: 0;
    width: 100%;
    color: #db92e8;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  }

  .button .text svg {
    position: absolute;
    right: -40px;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 3;
  }

  .premium-icon {
    transition:
      transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
      opacity 0.4s ease;
    opacity: 0.8;
  }

  .button:hover .premium-icon {
    transform: translateX(4px);
    opacity: 1;
  }

  .button:active .premium-icon {
    transform: translateX(2px);
    transition: 0.1s;
  }

  .button:hover {
    animation: none;
    transform: translateY(-2px);
  }

  .button:hover::before {
    animation-play-state: running;
  }

  .button:hover .words {
    transform: translateX(-12px); 
  }

  .button:hover .text-wrapper {
    transform: translateY(-100%); 
  }

  .button:hover .text svg {
    right: 20px;
    opacity: 1;
  }

  .button:active {
    transform: translateY(2px) scale(0.96);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.15),
      0 0 0 rgba(0, 0, 0, 0.1);
  }

  .button:active .text {
    box-shadow:
      1px -1px 2px hsl(0 0% 100% / 0.3) inset,
      0px -1px 2px hsl(0 0% 100% / 0.3) inset,
      -1px -1px 2px hsl(0 0% 100% / 0.3) inset,
      1px 1px 2px hsl(0 0% 30% / 0.8) inset,
      -8px 4px 10px -6px hsl(0 0% 30% / 0.5) inset,
      inset 0 8px 15px rgba(0, 0, 0, 0.6);
    filter: brightness(0.85);
  }
`;

export default CCButton;