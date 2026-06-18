import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // ---------------------------------------------------------
    // SETUP: Establish the full-screen rectangular state
    // ---------------------------------------------------------
    tl.set(
      [
        layer1Ref.current,
        layer2Ref.current,
        layer3Ref.current,
        layer4Ref.current,
      ],
      {
        width: "100vw",
        height: "100vh",
        borderRadius: "0%",
        opacity: 1,
      }
    );

    // Ensure the logo remains hidden during the initial geometric phases
    tl.set(logoRef.current, { opacity: 0, scale: 1 });

    // ---------------------------------------------------------
    // PHASE 1: Staggered Morph & Contraction (00:00 - 01:85)
    // ---------------------------------------------------------
    // A 'back' easing creates the tension and springy recoil required 
    // to simulate physical drag between the overlapping layers.
    const springEase = "back.inOut(1.2)";

    // The innermost layer (#9C37FC) acts as the anchor point, moving first.
    tl.to(layer4Ref.current, { width: 200, height: 200, borderRadius: "50%", duration: 1.2, ease: springEase }, 0.2);
    // The underlying darker shades follow, creating the trailing concentric effect.
    tl.to(layer3Ref.current, { width: 300, height: 300, borderRadius: "50%", duration: 1.2, ease: springEase }, 0.35);
    tl.to(layer2Ref.current, { width: 400, height: 400, borderRadius: "50%", duration: 1.2, ease: springEase }, 0.5);
    tl.to(layer1Ref.current, { width: 500, height: 500, borderRadius: "50%", duration: 1.2, ease: springEase }, 0.65);

    // ---------------------------------------------------------
    // PHASE 2: The Logo Injection (01:40 - 01:80)
    // ---------------------------------------------------------
    // Once the innermost geometry stabilizes as a perfect circle, 
    // we fade its solid background out while simultaneously fading the logo in.
    tl.to(layer4Ref.current, { backgroundColor: "transparent", duration: 0.4 }, 1.4);
    tl.to(logoRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, 1.4);

    // ---------------------------------------------------------
    // PHASE 3: Coalesce Behind the Logo (02:00 - 02:80)
    // ---------------------------------------------------------
    // The outer rings collapse inward. We reduce their dimensions to match 
    // the logo's bounds (200px) and fade them into oblivion.
    tl.to(
      [layer3Ref.current, layer2Ref.current, layer1Ref.current],
      {
        width: 200,
        height: 200,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.inOut",
      },
      2.0
    );

    // ---------------------------------------------------------
    // PHASE 4: Infinite Expansion & Reveal (03:00 - 04:00)
    // ---------------------------------------------------------
    // The circular logo expands exponentially to function as a viewport wipe.
    tl.to(
      logoRef.current,
      {
        scale: 60, // Scales aggressively to ensure corner coverage on all monitor sizes
        duration: 1.0,
        ease: "power4.inOut",
      },
      3.0
    );

    // Cleanly dissolve the master container to hand control over to the landing page.
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      },
      3.7
    );

    return () => {
      tl.kill(); // Memory management cleanup
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-transparent select-none pointer-events-auto"
    >
      {/* Layer Hierarchy: 
        Rendered bottom-to-top to ensure proper z-indexing without arbitrary CSS numbers.
      */}

      {/* Layer 1: Outermost boundary (Deepest Purple) */}
      <div ref={layer1Ref} className="absolute bg-[#3C096C]" />

      {/* Layer 2: Mid-Outer boundary */}
      <div ref={layer2Ref} className="absolute bg-[#5A189A]" />

      {/* Layer 3: Mid-Inner boundary */}
      <div ref={layer3Ref} className="absolute bg-[#7B2CBF]" />

      {/* Layer 4: Innermost boundary (Primary #9C37FC) & Image Container */}
      <div
        ref={layer4Ref}
        className="absolute flex items-center justify-center bg-[#9C37FC]"
      >
        <img
          ref={logoRef}
          src="/logo2.png"
          alt="C.C. Club Logo"
          className="absolute w-[200px] h-[200px] object-cover rounded-full"
        />
      </div>
    </div>
  );
};